import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import HealthBar from '../components/atoms/HealthBar';
import { OuterFlexDiv, PaddingDiv } from '../components/atoms/styled';
import useUser from '../hooks/useCurrentUser';
import * as mutations from '../gql/mutations';
import * as queries from '../gql/queries';
import * as subscriptions from '../gql/subscriptions';
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
import useIsLoggedIn from '../hooks/useIsLoggedIn';
import useWindowSize from '../hooks/useWindowSize';

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
    height: 250px;
    overflow-y: auto;
    overflow-x: hidden;
`;

const TodoItemDiv = styled.div`
    box-sizing: border-box;
    border-radius: 50px;
    background-color: ${props => props.theme.colors.primary};

    color: ${props => props.theme.colors.textLightest};

    width: calc(100%-16px);
    margin: 8px;
    padding: 8px 12px;

    font-size: 13px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const TodoItemLeftDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

interface PriorityDivProps {
    priority: 1 | 2 | 3;
}

const PriorityDiv = styled.div<PriorityDivProps>`
    border-radius: 50px;
    width: 10px;
    height: 10px;
    margin-right: 8px;

    background-color: ${props => {
        switch (props.priority) {
        case 1:
            return '#ff0000';
        case 2:
            return '#ffa500';
        case 3:
            return '#00ff00';
        default:
            return '#ffffff';
        }
    }};

    cursor: pointer;
`;

const TodoItemButton = styled.button`
    border-radius: 50%;
    width: 20px;
    height: 20px;

    background-color: yellow;
    border: 1px solid ${props => props.theme.colors.primary};
`;

const TodoListAddForm = styled.form`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: calc(100%-12px);

    color: white;
    margin: 6px;

    border-radius: 21.5px;
    background-color: ${props => props.theme.colors.quaternary};
`;

const TodoListInput = styled.input`
    border-radius: 50px;
    margin: 8px;
    padding: 5px 10px;
    box-sizing: content-box;
    width: 100%;

    border: 0px solid #00000000;
    background-color: #00000000;
`;

const TodoListAddButton = styled.button`
    border-radius: 50%;
    width: 25px;
    height: 25px;
    box-sizing: content-box;

    margin-right: 10px;

    border: none;
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

function CheckButton({onChange, first}: {onChange: (state:boolean) => void, first?: boolean}) {
    const [checked, setChecked] = useState(first || false);
    const onClick = useCallback(() => {
        onChange(true);
        setChecked(true);
    }, [checked, setChecked, onChange]);

    return (
        <img 
            src={checked ? '/static/checked.svg' : '/static/unchecked.svg' }
            onClick={onClick}
        />
    );
}

const PriorityListDiv = styled.div`
    height: 40px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    padding-left: 10px;
    border-radius: 30px 30px 30px 30px;
    
    background-color: ${props => props.theme.colors.background};
`;

function ChoosePriority({onChange}: {onChange: (select: number) => void }) {
    const [selected, setSelected] = useState(2);
    const onClick = useCallback((select: number) => {
        onChange(select);
        setSelected(select);
    }, [setSelected, onChange]);

    return (
        <PriorityListDiv>
            <PriorityDiv style={{opacity: selected === 1 ? 1 : 0.3}} priority={1} onClick={() => onClick(1)} />
            <PriorityDiv style={{opacity: selected === 2 ? 1 : 0.3}} priority={2} onClick={() => onClick(2)} />
            <PriorityDiv style={{opacity: selected === 3 ? 1 : 0.3}} priority={3} onClick={() => onClick(3)} />
        </PriorityListDiv>
    );
}

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

const LogoImg = styled.img`
    height: 35px;
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

function Todo(): JSX.Element {
    const user = useUser();
    const loggedIn = useIsLoggedIn();
    const toast = useToast();
    const apolloClient = useApolloClient();
    const navigate = useNavigate();

    const [beforeHealth, setBeforeHealth] = useLocalStorageState(0, BEFORE_HEALTH_KEY);
    const [health, setHealth] = useState(100);
    const [characterId, setCharacterId] = useState(-1);
    const [todos, setTodos] = useState<MyTodos_myTodos[]>([]);

    const [newTodoContent, setNewTodoContent] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState(2);

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
                setCharacterId(res.data.currentUser.character.id);
                setHealth(res.data.currentUser.character.hp);
            })
            .catch(err => {
                toast.showToast(err.message, 'error');
            });
    }, []);

    useEffect(() => {
        if (characterId === -1) return;

        const charaInfoSub = subscriptions.subscribeUserCharacterState(apolloClient, {
            userCharacterId: characterId
        });

        const unsub = charaInfoSub.subscribe(res => {
            if(!(res.data?.userCharacterState)) return;
            setHealth(res.data?.userCharacterState.hp);
        });

        return () => {
            unsub.unsubscribe();
        };
    }, [characterId]);

    const onChangeNewTodoContent = useCallback((todo: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoContent(todo.target.value);
    }, [newTodoContent]);

    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newTodoContent.trim().length === 0) {
            toast.showToast('Todo content is empty', 'error');
            return;
        }
        if (newTodoContent.length > 50) {
            toast.showToast('Todo content is too long', 'error');
            return;
        }

        const newTodo = {
            content: newTodoContent,
            priority: newTodoPriority,
        };
        mutations.createTodo(apolloClient, {
            todo: newTodo
        }).then(res => {
            const resTodo = res.data?.createTodo;
            if (!resTodo) throw new Error('createTodo failed');
            setTodos(o => [...o, {...resTodo, createdAt: new Date()}]);
        }).catch(err => {
            toast.showToast(err.message, 'error');
        });
        setNewTodoContent('');
    }, [newTodoContent, apolloClient, toast]);

    const onChangeChecked = useCallback((todo: MyTodos_myTodos) => (state: boolean) => {
        mutations.updateTodo(apolloClient, {
            id: todo.id,
            todo: {
                completed: state,
                content: todo.content,
                priority: todo.priority
            }
        }).catch(err => {
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

        changedHealth(health);

        let state = HealthState.Healthy;
        if      (health <= 25) state = HealthState.Damaged3;
        else if (health <= 50) state = HealthState.Damaged2;
        else if (health <= 75) state = HealthState.Damaged1;

        gameInteropObject.setState(state);

    }, [gameInteropObject, health]);

    const windowSize = useWindowSize();

    const healthBarText = useMemo(() => {
        return `100/${health}`;
    }, [health]);

    return (
        <>
            <AbsoluteArea>
                <BallContainerDiv>
                    <LightBlueBallContainer>
                        <LightBlueBall/>
                    </LightBlueBallContainer>
                    <RTitleContainerDiv>
                        <TitleH1>{new Date(Date.now()).toLocaleDateString()}</TitleH1>
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
                            <HealthBar health={health} maxHealth={100} innerText={healthBarText}/>
                        </HealthBarContainerDiv>
                    </LeftSideDiv>
                    <PaddingDiv width='10px' />
                    <RightSideDiv>
                        <TitleContainerDiv>
                            { windowSize.width > MEDIA_MAX_WIDTH + 60
                                ? 'Todo'
                                : new Date(Date.now()).toLocaleDateString() + ' Todo' }
                        </TitleContainerDiv>
                        <TodoListContainerDiv>
                            {todos.map(todo => {
                                return (
                                    <TodoItemDiv key={todo.id}>
                                        <TodoItemLeftDiv>
                                            <PriorityDiv priority={todo.priority as 1 | 2 | 3} />
                                            {todo.content}
                                        </TodoItemLeftDiv>
                                        <CheckButton onChange={onChangeChecked(todo)} first={todo.completed} />
                                    </TodoItemDiv>
                                );
                            })}
                        </TodoListContainerDiv>
                        <TodoListAddForm onSubmit={onSubmit}>
                            <ChoosePriority onChange={setNewTodoPriority} />
                            <TodoListInput placeholder='new todo...' value={newTodoContent} onChange={onChangeNewTodoContent} />
                            <TodoListAddButton type='submit'>
                                +
                            </TodoListAddButton>
                        </TodoListAddForm>
                    </RightSideDiv>
                </BaseDiv>
                <FakeHr />
                <BottomDiv>
                    <LogoImg src={'static/LogoSmall.svg'} alt='logo' />
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

export default Todo;