import React, { useCallback, useEffect, useState } from 'react';
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
    border: 1px solid red;

    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

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
    border: 1px solid red;
    padding: 10px;
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
    border: 1px solid red;
    box-sizing: border-box;
    border-radius: 50px;

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

function Todo(): JSX.Element {
    const user = useUser();
    const toast = useToast();
    const apolloClient = useApolloClient();

    const [health, setHealth] = useState(10);
    const [todos, setTodos] = useState<MyTodos_myTodos[]>([]);

    const [newTodoContent, setNewTodoContent] = useState('');

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
            })
            .catch(err => {
                toast.showToast(err.message, 'error');
            });
    }, []);

    const onChangeNewTodoContent = useCallback((todo: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoContent(todo.target.value);
        console.log(newTodoContent);
    }, [newTodoContent]);

    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
    }, [newTodoContent]);

    return (
        <OuterFlexDiv>
            <BaseDiv>
                <LeftSideDiv>
                    <div style={{width: 300, height: 300, background: 'white'}}>
                        charactor
                    </div>
                    <HealthBarContainerDiv>
                        health
                        <HealthBar health={health} maxHealth={100} />
                    </HealthBarContainerDiv>
                </LeftSideDiv>
                <PaddingDiv width='10px' />
                <RightSideDiv>
                    <TitleContainerDiv>
                        To Do
                    </TitleContainerDiv>
                    <TodoListContainerDiv>
                        {todos.map(todo => {
                            return (
                                <TodoItemDiv key={todo.id}>
                                    <TodoItemLeftDiv>
                                        <PriorityDiv priority={todo.priority as 1 | 2 | 3} />
                                        {todo.content}
                                    </TodoItemLeftDiv>
                                    <TodoItemButton>
                                        v
                                    </TodoItemButton>
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
        </OuterFlexDiv>
    );
}

export default Todo;