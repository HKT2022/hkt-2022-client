import { ApolloClient, gql } from '@apollo/client';
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