import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/UserContext';
import Navbar from '../common/Navbar';
import { useState } from 'react';

function Library() {
    const navigate = useNavigate();
    const { user } = useUser();

    const [games, setGames] = useState(['Game 1', 'Game 2', 'Game 3']);

    const returnToProfileSelect = () => {
        navigate('/profiles');
    };

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-row flex-1">
                <div className="w-1/6 border-r-2 border-secondary text-off-white">
                    Filter
                </div>
                <div className="w-5/6">
                    {games.map((game, index) => (
                        <button
                            id={game}
                            className="bg-primary w-60 h-96 text-lg rounded-md cursor-pointer m-5 text-off-white hover:bg-accent-2"
                            onClick={returnToProfileSelect}
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
