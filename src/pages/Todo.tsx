import { useState } from 'react';
import styled from 'styled-components';
import HealthBar from '../components/atoms/HealthBar';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';
import useUser from '../hooks/useCurrentUser';


const Base = styled.div`
    display: flex;
    flex-direction: row;
`;

const LeftSide = styled.div`
`;

const RightSide = styled.div`
    margin: 10px;
`;


function Todo(): JSX.Element {
    const user = useUser();

    const [todos, ] = useState<string[]>([
        'Todo 1',
        'Todo 2',
    ]);

    return (
        <CenterAlignedPage>
            <Base>
                <LeftSide>
                    <div>
                        <h1 style={{ color: 'white' }}>{user?.username || '샌즈'}</h1>
                    </div>
                    <div style={{ color: 'white' }}>
                        캐릭터 체력
                        <HealthBar health={10} maxHealth={100} />
                    </div>
                    <div style={{width: 300, height: 300, background: 'white'}}>
                        캐릭터 사진
                    </div>
                </LeftSide>
                <RightSide>
                    <input placeholder='새로운 todo 추가' />
                    <div>
                        {todos.map(todo => {
                            return (
                                <div key={todo} style={{color: 'white'}}>
                                    {todo}
                                    <button>V</button>
                                </div>
                            );
                        })}
                    </div>
                </RightSide>
            </Base>
        </CenterAlignedPage>
    );
}

export default Todo;