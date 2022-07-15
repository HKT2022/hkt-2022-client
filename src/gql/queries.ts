import { ApolloClient, gql } from '@apollo/client';

import { GetCurrentUser } from './__generated__/GetCurrentUser';
import { GetCurrentUserCharacter } from './__generated__/GetCurrentUserCharacter';
import { GetUser, GetUserVariables } from './__generated__/GetUser';
import { GetUserCharacter, GetUserCharacterVariables } from './__generated__/GetUserCharacter';
import { IsEmailUsed, IsEmailUsedVariables } from './__generated__/IsEmailUsed';
import { MyTodos } from './__generated__/MyTodos';

export function isEmailUsed(
    apolloClient: ApolloClient<any>,
    variables: IsEmailUsedVariables
) {
    return apolloClient.query<IsEmailUsed>({
        query: gql`
            query IsEmailUsed($email: String!) {
                isEmailUsed(email: $email)
            }
        `,
        variables
    });
}

export function getUser(
    apolloClient: ApolloClient<any>,
    variables: GetUserVariables
) {
    return apolloClient.query<GetUser>({
        query: gql`
            query GetUser($id: String!) {
                User(id: $id) {
                    id,
                    username,
                    createdAt,
                    ranking {
                        totalRanking
                    }
                }
            }
        `,
        variables
    });
}

export function getCurrentUser(
    apolloClient: ApolloClient<any>
) {
    return apolloClient.query<GetCurrentUser>({
        query: gql`
            query GetCurrentUser {
                currentUser {
                    id,
                    username,
                    createdAt,
                    ranking {
                        totalRanking
                    }
                }
            }
        `
    });
}

export function getMyTodos(
    apolloClient: ApolloClient<any>
) {
    return apolloClient.query<MyTodos>({
        query: gql`
            query MyTodos {
                myTodos {
                    id,
                    createdAt,
                    priority,
                    completed,
                    content
                }
            }
        `
    });
}

export function getCurrentUserCharacter(
    apolloClient: ApolloClient<any>
) {
    return apolloClient.query<GetCurrentUserCharacter>({
        query: gql`
            query GetCurrentUserCharacter {
                currentUser {
                    character {
                        id
                        hp
                    }
                }
            }
        `
    });
}

export function getUserCharacter(
    apolloClient: ApolloClient<any>,
    variables: GetUserCharacterVariables
) {
    return apolloClient.query<GetUserCharacter>({
        query: gql`
            query GetUserCharacter($id: String!) {
                User(id: $id) {
                    character {
                        id
                        hp
                    }
                }
            }
        `,
        variables
    });
}