import { useAuthContext } from '../contexts/AuthContext';


export default function useIsLoggedIn() {
    const authContext = useAuthContext();

    return authContext.jwt === null ? false : true;
}