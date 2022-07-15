import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import HealthBar from '../components/atoms/HealthBar';
import { OuterFlexDiv, PaddingDiv } from '../components/atoms/styled';
//import useUser from '../hooks/useCurrentUser';
import * as queries from '../gql/queries';
import { useApolloClient } from '@apollo/client';
import { MyTodos_myTodos } from '../gql/__generated__/MyTodos';
import useToast from '../contexts/ToastContext';
import { MEDIA_MAX_WIDTH } from '../constants/css';
import useLocalStorageState from '../hooks/useLocalStorageState';
import { BEFORE_HEALTH_KEY } from '../constants/localStorage';
import shakeCamera from '../utilities/shakeCamera';
import { Game } from 'the-world-engine';
import { Bootstrapper, StateInteropObject } from '../game/GameBootstrapper';
import { HealthState } from '../game/script/PlayerStatusRenderController';
import { ContainerDiv, LightBlueBall, LightBlueBallContainer, TitleH1, TitleContainerDiv as RTitleContainerDiv } from './Ranking';
import { useNavigate } from 'react-router-dom';
//import useIsLoggedIn from '../hooks/useIsLoggedIn';

const BaseDiv = styled.div`
    display: flex;
    flex-direction: row;
    color: ${props => props.theme.colors.primaryInverse};

    @media (max-width: ${MEDIA_MAX_WIDTH + 60}px) {
        flex-direction: column;
        align-items: center;
        width: calc(100% - 40px);
    }
`;

const LeftSideDiv = styled.div`
`;

const RightSideDiv = styled.div`
    background-color: ${props => props.theme.colors.secondaryBG};
    border-radius: 30px;

    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.12);

    @media (max-width: ${MEDIA_MAX_WIDTH + 60}px) {
        width: 100%;
    }
`;

const TitleContainerDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 20px 0px;
`;

const HealthBarContainerDiv = styled.div`
    /* padding: 10px; */
    margin-top: 10px;
    
    @media (max-width: ${MEDIA_MAX_WIDTH + 60}px) {
        margin-bottom: 10px;
    }
`;

const TodoListContainerDiv = styled.div`
    display: flex;

    height: 250px;
    overflow-y: auto;

    justify-content: center;
    align-items: center;

    margin-bottom: 20px;
`;

const GameViewDiv = styled.div`
    width: 300px;
    height: 300px;
    overflow: hidden;

    border-radius: 30px;

    background-color: ${props => props.theme.colors.secondaryBG};
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.12);
`;

const FakeHr = styled.div`
    width: 100%;
    border-top: 3px solid ${props => props.theme.colors.quaternary};

    margin-top: 40px;
    
    margin-bottom: 60px;
    @media (max-width: ${MEDIA_MAX_WIDTH + 60}px) {
        margin-bottom: 20px;
    }

    max-width: 810px;
`;

const BottomDiv = styled.div`
    width: 100%;
    max-width: 810px;
    box-sizing: border-box;
    padding: 0px 50px 50px 50px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    
    @media (max-width: ${MEDIA_MAX_WIDTH + 60}px) {
        padding: 0px 50px 10px 50px;
    }
`;


const BtnImg = styled.img`
:hover {
    cursor: pointer;
}
`;

const BallContainerDiv = styled(ContainerDiv)`
    @media (max-width: ${MEDIA_MAX_WIDTH + 60}px) {
        display: none;
    }
`;

const AbsoluteArea = styled.div`
    display: flex;
    
    justify-content: center;

    position: absolute;
    top: 0;
    left: 50%;
    width: 800px;
    transform: translateX(-50%);
`;


function Skin(): JSX.Element {
    // const user = useUser();
    // const loggedIn = useIsLoggedIn();
    const toast = useToast();
    const apolloClient = useApolloClient();
    const navigate = useNavigate();

    const [beforeHealth, setBeforeHealth] = useLocalStorageState(0, BEFORE_HEALTH_KEY);
    const [health, setHealth] = useState(100);
    const [, setTodos] = useState<MyTodos_myTodos[]>([]);

    const [gameInteropObject, setGameInteropObject] = useState<StateInteropObject|null>(null);

    const changedHealth = useCallback((hp: number) => {
        const d = hp - beforeHealth;
        const dif = Math.abs(d);

        if (d < 0) {
            shakeCamera();
            toast.showToast(`You lost ${dif} health!`, 'error');
        }

        setBeforeHealth(hp);
    }, [beforeHealth]);

    useEffect(() => {
        queries.getMyTodos(apolloClient)
            .then(res => {
                setTodos(res.data.myTodos);
            })
            .catch(err => {
                toast.showToast(err.message, 'error');
            });
        queries.getCurrentUserCharacter(apolloClient)
            .then(res => {
                setHealth(res.data.currentUser.character.hp);
                changedHealth(res.data.currentUser.character.hp);
            })
            .catch(err => {
                toast.showToast(err.message, 'error');
            });
    }, []);


    const gameContainerRef = useRef<HTMLDivElement>(null);

    const [game, setGame] = useState<Game|null>(null);

    useEffect(() => {
        setTimeout(() => {
            if (gameContainerRef.current && !game) {
                const game = new Game(gameContainerRef.current);
                const interopObject = new StateInteropObject();
                game.run(Bootstrapper, interopObject);
                game.inputHandler.startHandleEvents();
                setGame(game);
                setGameInteropObject(interopObject);
            }

            return () => {
                if (game) {
                    game.inputHandler.stopHandleEvents();
                    game.dispose();
                }

                setGame(null);
                setGameInteropObject(null);

                //if (gameContainerRef.current) gameContainerRef.current.innerHTML = '';
            };
        }, 200);
    }, [gameContainerRef, setGame, setGameInteropObject]);

    useEffect(() => {
        if (!gameInteropObject) return;

        let state = HealthState.Healthy;
        if      (health <= 25) state = HealthState.Damaged3;
        else if (health <= 50) state = HealthState.Damaged2;
        else if (health <= 75) state = HealthState.Damaged1;

        gameInteropObject.setState(state);

    }, [gameInteropObject, health]);

    return (
        <>
            <AbsoluteArea>
                <BallContainerDiv>
                    <LightBlueBallContainer>
                        <LightBlueBall/>
                    </LightBlueBallContainer>
                    <RTitleContainerDiv>
                        <TitleH1>Skin</TitleH1>
                    </RTitleContainerDiv>
                </BallContainerDiv>
            </AbsoluteArea>
            <OuterFlexDiv>
                <div style={{height: 100}}>

                </div>
                <BaseDiv>
                    <LeftSideDiv>
                        <GameViewDiv ref={gameContainerRef} />
                        <HealthBarContainerDiv>
                            <HealthBar health={health} maxHealth={100} />
                        </HealthBarContainerDiv>
                    </LeftSideDiv>
                    <PaddingDiv width='10px' />
                    <RightSideDiv>
                        <TitleContainerDiv>
                            Add skin
                        </TitleContainerDiv>
                        <TodoListContainerDiv>
                            <img src="/static/plus.svg" />
                        </TodoListContainerDiv>
                    </RightSideDiv>
                </BaseDiv>
                <FakeHr />
                <BottomDiv>
                    <div>
                        logo
                    </div>
                    <div>
                        <BtnImg src='/static/group.svg' 
                            onClick={() => {
                                navigate('/group');
                            }}
                        />
                        <BtnImg src='/static/skin.svg' 
                            style={{marginLeft: 32}}
                            onClick={() => {
                                navigate('/');
                            }}
                        />
                        <BtnImg src='/static/trophy.svg' 
                            style={{marginLeft: 32}}
                            onClick={() => {
                                navigate('/ranking');
                            }}
                        />
                        <BtnImg 
                            src='/static/logout.svg' 
                            style={{marginLeft: 32}}
                            onClick={() => {
                                location.href = '/logout';
                            }}
                        />
                    </div>
                </BottomDiv>
            </OuterFlexDiv>
        </>
    );
}

export default Skin;