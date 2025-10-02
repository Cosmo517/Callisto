import { invoke } from '@tauri-apps/api/core';

type GameCardProps = {
    game: any;
    index: number;
};

function GameCard({ game, index }: GameCardProps) {
    const playGame = () => {
        invoke('launch_steam_game', { appId: game.app_id.toString() });
    };

    return (
        <div className="bg-primary text-off-white m-5 flex h-96 w-68 rounded-md text-lg">
            <div className="flex h-full w-full flex-col justify-between">
                <div className="mt-5 text-center">{game.name}</div>
                <div className="flex justify-center">
                    <button
                        className="bg-accent-2 mb-5 w-30 cursor-pointer rounded-md"
                        onClick={playGame}
                    >
                        Play
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameCard;