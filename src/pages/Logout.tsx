import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';
import {
    useNavigate,
    useSearchParams
} from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

function Logout(): JSX.Element {
    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const [serachParams] = useSearchParams();
    const { setJwt } = useAuthContext();

    useEffect(() => {
        const next = serachParams.get('next');
        setJwt('');
        apolloClient.resetStore()
            .then(() => {
                navigate(next || '/');
            });
    });

    return (
        <>
        </>
    );
}

export default Logout;
