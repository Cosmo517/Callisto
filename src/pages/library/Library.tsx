import Navbar from '../common/Navbar';
import { useState } from 'react';
import GameCard from './components/GameCard';
import AddGame from './components/AddGame';

function Library() {
    const [games, setGames] = useState([
        'Game 1',
        'Game 2',
        'Game 3',
        'Game 4',
        'Game 5',
        'Game 6',
        'Game 7',
        'Game 8',
        'Game 9',
        'Game 10',
        'Game 11',
    ]);

    const [addGameDialog, setAddGameDialog] = useState(false);

    return (
        <div className="bg-background flex min-h-screen flex-col">
            <Navbar />
            <div className="mt-18 flex flex-1 flex-row">
                <div className="border-secondary text-off-white w-1/6 border-r-2">
                    <div className="mt-5 flex w-full justify-center">
                        <button
                            className="hover:bg-accent-2 mb-5 w-30 cursor-pointer rounded-md"
                            onClick={() => setAddGameDialog(true)}
                        >
                            Add Game
                        </button>
                    </div>{' '}
                </div>
                <div className="flex w-5/6 flex-wrap">
                    {games.map((game, index) => (
                        <GameCard game={game} index={index} />
                    ))}
                </div>
            </div>
            <AddGame
                open={addGameDialog}
                onClose={() => setAddGameDialog(false)}
            />
        </div>
    );
}

export default Library;
