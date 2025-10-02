import { invoke } from '@tauri-apps/api/core';
import Navbar from '../common/Navbar';
import { useState, useEffect } from 'react';
import GameCard from './components/GameCard';
import AddGame from './components/AddGame';
import { useUser } from '../../common/UserContext';
import { Game } from '../../common/interfaces/GameInterface';
import { ThemedSwitch } from '../../common/components/ThemedSwitch';
import GamesListView from './components/GamesListView';

function Library() {
    const [games, setGames] = useState<Game[]>([]);
    const { user } = useUser();

    const [addGameDialog, setAddGameDialog] = useState(false);
    const [listViewEnabled, setListViewEnabled] = useState(false);

    useEffect(() => {
        invoke<Game[]>('tauri_retrieve_user_games', { userId: Number(user.id) })
            .then((data) => {
                console.log(data);
                setGames(data);
            })
            .catch((err) => console.error('Error fetching users:', err));
    }, [addGameDialog]);

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
                    </div>
                    <ThemedSwitch
                        isSelected={listViewEnabled}
                        onChange={setListViewEnabled}
                        text="List View"
                    />
                </div>
                {listViewEnabled ? (
                    <div className="w-5/6">
                        <GamesListView games={games} />
                    </div>
                ) : (
                    <div className="flex w-5/6 flex-wrap">
                        {games.map((game, index) => (
                            <GameCard game={game} index={index} />
                        ))}
                    </div>
                )}
            </div>
            <AddGame
                open={addGameDialog}
                onClose={() => setAddGameDialog(false)}
            />
        </div>
    );
}

export default Library;
