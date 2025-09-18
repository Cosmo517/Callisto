type GameCardProps = {
    game: any;
    index: number;
};

function GameCard({ game, index }: GameCardProps) {
    const playGame = () => {
        // use this to start/do something for a game
    };

    return (
        <div className="bg-primary text-off-white m-5 flex h-96 w-60 rounded-md text-lg">
            <div className="flex h-full w-full flex-col justify-between">
                <div className="mt-5 text-center">{game}</div>
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
