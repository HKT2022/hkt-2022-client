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

const BaseDiv = styled.div`
    display: flex;
    flex-direction: row;
    color: ${props => props.theme.colors.primaryInverse};
`;

const LeftSideDiv = styled.div`
`;

const RightSideDiv = styled.div`
    border: 1px solid red;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
`;

const TodoItemDiv = styled.div`
    border: 1px solid red;
    border-radius: 50px;

    width: 400px;
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
    }, []);

    const onChangeNewTodoContent = useCallback((todo: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoContent(todo.target.value);
    }, []);

    return (
        <OuterFlexDiv>
            <BaseDiv>
                <LeftSideDiv>
                    <div style={{width: 300, height: 300, background: 'white'}}>
                        charactor
                    </div>
                    <HealthBarContainerDiv>
                        health
                        <HealthBar health={10} maxHealth={100} />
                    </HealthBarContainerDiv>
                </LeftSideDiv>
                <PaddingDiv width='10px' />
                <RightSideDiv>
                    <TitleContainerDiv>
                        To Do
                    </TitleContainerDiv>
                    <div>
                        {todos.map(todo => {
                            return (
                                <TodoItemDiv key={todo.id}>
                                    <TodoItemLeftDiv>
                                        <PriorityDiv priority={1} />
                                        {todo.content}
                                    </TodoItemLeftDiv>
                                    <TodoItemButton>
                                        v
                                    </TodoItemButton>
                                </TodoItemDiv>
                            );
                        })}
                    </div>
                    <TodoListAddForm>
                        <TodoListInput placeholder='new todo...' value={newTodoContent} onChange={onChangeNewTodoContent} />
                        <TodoListAddButton>
                            +
                        </TodoListAddButton>
                    </TodoListAddForm>
                </RightSideDiv>
            </BaseDiv>
        </OuterFlexDiv>
    );
}

export default Todo;