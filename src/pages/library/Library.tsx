import Navbar from '../common/Navbar';
import { useState } from 'react';

function Library() {
    const [games, setGames] = useState(['Game 1', 'Game 2', 'Game 3']);

    return (
        <div className="bg-background flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 flex-row">
                <div className="border-secondary text-off-white w-1/6 border-r-2">
                    Filter
                </div>
                <div className="w-5/6">
                    {games.map((game, index) => (
                        <button
                            id={game}
                            className="bg-primary text-off-white hover:bg-accent-2 m-5 h-96 w-60 cursor-pointer rounded-md text-lg"
                            onClick={() =>
                                console.log('Game: ' + index + ' clicked')
                            }
                        >
                            Play
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Library;
