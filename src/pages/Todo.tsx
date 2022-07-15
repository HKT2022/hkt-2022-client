import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import HealthBar from '../components/atoms/HealthBar';
import { OuterFlexDiv, PaddingDiv } from '../components/atoms/styled';
import useUser from '../hooks/useCurrentUser';
import * as mutations from '../gql/mutations';
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
    border: 1px solid red;
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
    width: 100%;
`;

const TodoListInput = styled.input`
    border-radius: 50px;
    margin: 8px;
    padding: 5px 10px;
    box-sizing: content-box;
    width: 100%;
`;

const TodoListAddButton = styled.button`
    border-radius: 50%;
    width: 25px;
    height: 25px;
    box-sizing: content-box;

    margin-right: 10px;
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
    height: 0px;
    border-top: 3px solid ${props => props.theme.colors.quaternary};

    margin-top: 40px;
    margin-bottom: 60px;

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
`;

function CheckButton({onChange, first}: {onChange: (state:boolean) => void, first?: boolean}) {
    const [checked, setChecked] = useState(first || false);
    const onClick = useCallback(() => {
        console.log(!checked);
        onChange(!checked);
        setChecked(o => !o);
    }, [checked, setChecked, onChange]);

    return (
        <img 
            src={checked ? '/static/checked.svg' : '/static/unchecked.svg' }
            onClick={onClick}
        />
    );
}

function Todo(): JSX.Element {
    const user = useUser();
    const toast = useToast();
    const apolloClient = useApolloClient();

    const [beforeHealth, setBeforeHealth] = useLocalStorageState(0, BEFORE_HEALTH_KEY);
    const [health, setHealth] = useState(100);
    const [todos, setTodos] = useState<MyTodos_myTodos[]>([]);

    const [newTodoContent, setNewTodoContent] = useState('');

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

    const onChangeNewTodoContent = useCallback((todo: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoContent(todo.target.value);
    }, [newTodoContent]);

    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newTodoContent.length === 0) {
            toast.showToast('Todo content is empty', 'error');
        }

        const newTodo = {
            content: newTodoContent,
            priority: 1,
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
                setGame(null);
                setGameInteropObject(null);
            }
        };
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
        <OuterFlexDiv>
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
                        Todo
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
                        <TodoListInput placeholder='new todo...' value={newTodoContent} onChange={onChangeNewTodoContent} />
                        <TodoListAddButton type='submit'>
                            +
                        </TodoListAddButton>
                    </TodoListAddForm>
                </RightSideDiv>
            </BaseDiv>
            <FakeHr />
            <BottomDiv>
                <div>
                    logo
                </div>
                <div>
                    <img src='/static/trophy.svg' />
                    <img src='/static/setting.svg' style={{marginLeft: 32}}/>
                </div>
            </BottomDiv>
        </OuterFlexDiv>
    );
}

export default Todo;