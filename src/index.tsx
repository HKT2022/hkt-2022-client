import { ApolloClient, ApolloLink, ApolloProvider,createHttpLink,FetchResult,InMemoryCache, Operation, split } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';

import App from './App';
import { DARK_THEME, LIGHT_THEME } from './constants/css';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { setContext } from '@apollo/client/link/context';
import { JWT_LOCAL_STORAGE_KEY } from './constants/localStorage';
import JwtTokenRefresher from './components/organisms/JwtTokenRefresher';
import { Client, ClientOptions, createClient } from 'graphql-ws';
import { getMainDefinition, Observable } from '@apollo/client/utilities';
import { print } from 'graphql';

// For socket connection

export function getSession(): { token: string|null } {
    return {
        token: localStorage.getItem(JWT_LOCAL_STORAGE_KEY),
    };
}


export class WebSocketLink extends ApolloLink {
    private _client: Client;

    constructor(options: ClientOptions) {
        super();
        this._client = createClient(options);
    }

    public request(operation: Operation): Observable<FetchResult> {
        return new Observable((sink) => {
            return this._client.subscribe<FetchResult>(
                { ...operation, query: print(operation.query) },
                {
                    next: sink.next.bind(sink),
                    complete: sink.complete.bind(sink),
                    error: (err) => {
                        if (Array.isArray(err))
                            // GraphQLError[]
                            return sink.error(
                                new Error(
                                    err.map(({ message }) => message).join(', ')
                                )
                            );

                        if (err instanceof CloseEvent)
                            return sink.error(
                                new Error(
                                    `Socket closed with event ${err.code} ${err.reason || ''
                                    }` // reason will be available on clean closes only
                                )
                            );

                        return sink.error(err);
                    },
                }
            );
        });
    }

    public get client(): Client {
        return this._client;
    }
}

export function getWSLink(): WebSocketLink {
    const link = new WebSocketLink({
        url: 'wss://truedu.kr/graphql',
        connectionParams: () => {
            const session = getSession();
            if (!session) {
                return {};
            }
            return {
                Authorization: `${session.token}`,
            };
        },
    });

    return link;
}

const httpLink = createHttpLink({
    uri: 'https://truedu.kr/graphql',
});

const wsLink = getWSLink();

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(JWT_LOCAL_STORAGE_KEY);

    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : '',
        }
    };
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a 'truthy' value
// * The Link to use for an operation if the function returns a 'falsy' value
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink),
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});



const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <React.StrictMode>
    <ApolloProvider client={client}>
        <AuthProvider>
            <ThemeProvider theme={LIGHT_THEME || DARK_THEME}>
                <ToastProvider>
                    <JwtTokenRefresher />
                    <App/>
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    </ApolloProvider>
    // </React.StrictMode>
);
