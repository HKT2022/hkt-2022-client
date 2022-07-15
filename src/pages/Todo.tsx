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