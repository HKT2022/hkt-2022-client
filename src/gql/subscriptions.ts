import { ApolloClient, gql } from '@apollo/client';
import { DayUpdate } from './__generated__/DayUpdate';
import { UserCharacterState, UserCharacterStateVariables } from './__generated__/UserCharacterState';



export function subscribeUserCharacterState(
    apolloClient: ApolloClient<any>,
    variables: UserCharacterStateVariables
) {
    return apolloClient.subscribe<UserCharacterState>({
        query: gql`
            subscription UserCharacterState($userCharacterId: Int!) {
                userCharacterState(userCharacterId: $userCharacterId) {
                    hp
                }
            }
        `,
        variables
    });
}

export function subscribeDayUpdate(
    apolloClient: ApolloClient<any>
) {
    return apolloClient.subscribe<DayUpdate>({
        query: gql`
            subscription DayUpdate {
                dayUpdate
            }
        `
    });
}