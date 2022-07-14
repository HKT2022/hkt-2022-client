import {
    useCallback
} from 'react';
import {
    Link,
    useNavigate
} from 'react-router-dom';
import styled from 'styled-components';

import {
    Button1,
    InnerFlexDiv1,
    Logo1,
    OuterFlexDiv,
    PaddingDiv
} from '../components/atoms/styled';
import NavBar from '../components/organisms/NavBar';
import PagedListView from '../components/organisms/PagedListView';

const MainFlexDiv = styled(OuterFlexDiv)`
    justify-content: flex-start;
    min-height: 100%;
    height: auto;
`;

const Container = styled(InnerFlexDiv1)`
    padding: 0px 15px;
`;

const PaddedButton = styled(Button1)`
    margin: 15px 0px;
`;

function Main(): JSX.Element {
    const navigate = useNavigate();

    const handlePasswordChangeClick = useCallback(() => {
        navigate('/password/change');
    }, [navigate]);

    return (
        <MainFlexDiv>
            <NavBar/>
            <PaddingDiv height='100px'/>
            <Link to={'/'}>
                <Logo1/>
            </Link>
            <Container>
                <PaddedButton onClick={handlePasswordChangeClick}>Change Password</PaddedButton>
            </Container>
            <PagedListView items={[
                {id: '1', name: 'test'},
                {id: '2', name: 'test2'},
                {id: '3', name: 'test3'},
                {id: '4', name: 'test4'}
            ]} pageCount={10} currentPage={3} onPageChange={() => {/* */}}/>
        </MainFlexDiv>
    );
}

export default Main;
