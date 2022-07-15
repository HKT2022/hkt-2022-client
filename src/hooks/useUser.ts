import { gql, useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../gql/queries";
import { GetCurrentUser } from "../gql/__generated__/GetCurrentUser";

function useUser(): GetCurrentUser['currentUser'] | null {
    const apolloClient = useApolloClient();
    const [user, setUser] = useState<GetCurrentUser['currentUser'] | null>(null);

    useEffect(() => {
        (async () => {
            const res = await getCurrentUser(apolloClient );

            setUser(res.data.currentUser);
        })();
    }, [apolloClient]);

    return user;
}

export default useUser;