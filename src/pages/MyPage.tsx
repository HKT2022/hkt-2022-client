import useIsLoggedIn from '../hooks/useIsLoggedIn';
import useUser from '../hooks/useCurrentUser';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';


function MyPage(): JSX.Element {
    const loggedIn = useIsLoggedIn();
    const user = useUser();

    return (
        <CenterAlignedPage>
            <div>
                <h1 style={{color: 'white'}}>{user?.id}</h1>
                <h1 style={{color: 'white'}}>{user?.username}</h1>
            </div>
        </CenterAlignedPage>
    );
}

export default MyPage;