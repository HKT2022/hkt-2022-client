import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';
import { REFRESH_TOKEN_LOCAL_STORAGE_KEY } from '../../constants/localStorage';
import { useAuthContext } from '../../contexts/AuthContext';
import useToast from '../../contexts/ToastContext';
import * as Mutation from '../../gql/mutations';
import useLocalStorageRawState from '../../hooks/useLocalStorageRawState';

function JwtTokenRefresher(): JSX.Element {
    const apolloClient = useApolloClient();
    const [ refreshToken ] = useLocalStorageRawState('', REFRESH_TOKEN_LOCAL_STORAGE_KEY);
    const { setJwt } = useAuthContext();
    const toast = useToast();

    useEffect(() => {
        const timer = setInterval(() => {
            console.log('refreshing token', refreshToken);
            if (refreshToken !== '') {
                Mutation.refreshAccessToken(
                    apolloClient,
                    { refreshToken }
                ).then(res => {
                    if (!res.data?.refreshAccessToken) throw new Error('No access token');
                    apolloClient.resetStore();
                    setJwt(res.data?.refreshAccessToken);
                }).catch(error => {
                    toast.showToast(error.message, 'error');
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [apolloClient, refreshToken, setJwt, toast]);

    return <></>;
}

export default JwtTokenRefresher;
