import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button1, InnerFlexDiv1, OuterFlexDiv, PaddingDiv } from '../components/atoms/styled';

const TitleContainerDiv = styled(InnerFlexDiv1)`
    width: 600px;
    max-width: calc(100% - 40px);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.primaryInverse};
    background-color: transparent;
`;

const TitleH1 = styled.h1`
    font-size: 50px;
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.colors.secondary};
    width: 90%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoginButton = styled(Button1)`
    width: 100%;
`;

const ImageCard = styled.div`
    width: 100%;
    height: 100%;
`;

function Welcome(): JSX.Element {
    const navigate = useNavigate();

    const handleLogin = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const handleRegister = useCallback(() => {
        navigate('/register');
    }, [navigate]);

    return (
        <>
            <OuterFlexDiv>
                <TitleContainerDiv>
                    <TitleH1>
                        todo survival
                    </TitleH1>
                    <PaddingDiv height='20px' />
                    에 오신것을 환영합니다!
                    <PaddingDiv height='100px' />
                    <LoginButton onClick={handleLogin}>
                        로그인
                    </LoginButton>
                    <PaddingDiv height='20px' />
                    <LoginButton onClick={handleRegister}>
                        회원가입
                    </LoginButton>
                </TitleContainerDiv>
            </OuterFlexDiv>
            <OuterFlexDiv>
                <ImageCard>
                    <img src='/images/wellcome.png' />
                </ImageCard>
            </OuterFlexDiv>
        </>
    );
}

export default Welcome;
