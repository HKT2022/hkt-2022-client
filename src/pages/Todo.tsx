import { useState } from 'react';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';
import useUser from '../hooks/useCurrentUser';


function Todo(): JSX.Element {
    const user = useUser();

    const [todos, setTodos] = useState<string[]>([
        'Todo 1',
        'Todo 2',
    ]);

    return (
        <CenterAlignedPage>
            <>
                <div>
                    <h1 style={{ color: 'white' }}>{user?.id || '샌즈'}</h1>
                </div>
                <div style={{ color: 'white' }}>
                    캐릭터 체력 ===============================
                </div>
                <div style={{width: 300, height: 300, background: 'white'}}>
                    캐릭터 사진
                </div>
                <br />
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
            </>
        </CenterAlignedPage>
    );
}

export default Todo;