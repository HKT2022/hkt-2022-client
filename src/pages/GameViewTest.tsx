import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Game } from 'the-world-engine';
import { Bootstrapper, StateInteropObject } from '../game/GameBootstrapper';

const GameViewDiv = styled.div`
    width: 100%;
    height: 100%;
`;

function GameViewTest(): JSX.Element {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const [game, setGame] = useState<Game|null>(null);
    
    useEffect(() => {
        if (gameContainerRef.current && !game) {
            const game = new Game(gameContainerRef.current);
            const interopObject = new StateInteropObject();
            game.run(Bootstrapper, interopObject);
            game.inputHandler.startHandleEvents();
            setGame(game);
        }

        return () => {
            if (game) {
                game.inputHandler.stopHandleEvents();
                game.dispose();
                setGame(null);
            }
        };
    }, [gameContainerRef, setGame]);

    return (
        <GameViewDiv ref={gameContainerRef} />
    );
}

export default GameViewTest;
