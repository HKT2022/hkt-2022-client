import { useAuthContext } from '../contexts/AuthContext';
import * as jose from 'jose';

export default function useIsLoggedIn() {
    const authContext = useAuthContext();

    if (authContext.jwt === null) return true;

    const jwt = jose.decodeJwt(authContext.jwt);
    if (jwt.exp === undefined) return true;
    if (jwt.exp < Date.now()) return true;

    return false;
}