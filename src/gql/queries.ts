import { ApolloClient, gql } from '@apollo/client';

import { GetCurrentUser } from './__generated__/GetCurrentUser';
import { GetCurrentUserCharacter } from './__generated__/GetCurrentUserCharacter';
import { GetTodoGroupRankings, GetTodoGroupRankingsVariables } from './__generated__/GetTodoGroupRankings';
import { GetTotalRankings, GetTotalRankingsVariables } from './__generated__/GetTotalRankings';
import { GetUser, GetUserVariables } from './__generated__/GetUser';
import { GetUserCharacter, GetUserCharacterVariables } from './__generated__/GetUserCharacter';
import { IsEmailUsed, IsEmailUsedVariables } from './__generated__/IsEmailUsed';
import { MyTodos } from './__generated__/MyTodos';
import { SearchTodoGroups, SearchTodoGroupsVariables } from './__generated__/SearchTodoGroups';
import { TodoGroup, TodoGroupVariables } from './__generated__/TodoGroup';

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


export function getTotalRankings(
    apolloClient: ApolloClient<any>,
    variables: GetTotalRankingsVariables
) {
    return apolloClient.query<GetTotalRankings>({
        query: gql`
            query GetTotalRankings($skip: Int!, $limit: Int!) {
                totalRankings(skip: $skip, limit: $limit) {
                    id
                    username
                    score
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

export function getTodoGroup(
    apolloClient: ApolloClient<any>,
    variables: TodoGroupVariables
) {
    return apolloClient.query<TodoGroup>({
        query: gql`
            query TodoGroup($id: Int!) {
                TodoGroup(id: $id) {
                    id
                    name
                    owner {
                        id
                        username
                    }
                    description
                }
            }
        `,
        variables
    });
}

export function searchTodoGroups(
    apolloClient: ApolloClient<any>,
    variables: SearchTodoGroupsVariables
) {
    return apolloClient.query<SearchTodoGroups>({
        query: gql`
            query SearchTodoGroups($text: String!, $limit: Int!) {
                searchTodoGroups(text: $text, limit: $limit) {
                    id
                    name
                    description
                    owner {
                        id
                        username
                    }
                }
            }
        `,
        variables
    });
}


export function getTodoGroupRankings(
    apolloClient: ApolloClient<any>,
    variables: GetTodoGroupRankingsVariables
) {
    return apolloClient.query<GetTodoGroupRankings>({
        query: gql`
query GetTodoGroupRankings($todoGroupId: Int!, $skip: Int!, $limit: Int!) {
  todoGroupRankings(todoGroupId: $todoGroupId, skip: $skip, limit: $limit) {
    id
    username
    score
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