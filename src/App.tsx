import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Logout from './pages/Logout';
import MyPage from './pages/MyPage';
import NotFound from './pages/NotFound';
import PasswordReset from './pages/PasswordReset';
import PasswordResetRequest from './pages/PasswordResetRequest';
import Register from './pages/Register';
import Todo from './pages/Todo';
import Welcome from './pages/Welcome';
import useIsLoggedIn from './hooks/useIsLoggedIn';
import Ranking from './pages/Ranking';
import GameViewTest from './pages/GameViewTest';
import Group from './pages/Group';
import Skin from './pages/Skin';
import GroupRanking from './pages/GroupRanking';

function App(): JSX.Element {
    const loggedIn = useIsLoggedIn();
    return (
        <BrowserRouter>
            <Routes>
                {loggedIn ? 
                    <Route path='/' element={<Navigate to="/todo" replace/>} /> :
                    <Route path='/' element={<Navigate to="/welcome" replace/>} />
                }
                <Route path='/group' element={<Group />} />
                <Route path='/skin' element={<Skin />} />
                <Route path='/login' element={<Login />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/register' element={<Register />} />
                <Route path='/password/reset-request' element={<PasswordResetRequest />} />
                <Route path='/password/reset' element={<PasswordReset />} />
                <Route path='/mypage' element={<MyPage />} />
                <Route path='/todo' element={<Todo />} />
                <Route path='/welcome' element={<Welcome />} />
                <Route path='/ranking' element={<Ranking />} />
                <Route path='/group/:groupId/ranking' element={<GroupRanking />} />
                <Route path='/game-view-test' element={<GameViewTest />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
