import { Game } from '../../../common/interfaces/GameInterface';
import {
    Cell,
    Column,
    Row,
    Table,
    TableBody,
    TableHeader,
    Checkbox,
} from 'react-aria-components';

type GamesListViewProps = {
    games: Game[];
};

function humanSize(bytes?: number): string {
    if (!bytes && bytes !== 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let val = bytes!;
    while (val >= 1024 && i < units.length - 1) {
        val /= 1024;
        i++;
    }
    return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function convertToTime(last_played?: string): string {
    const date = new Date(Number(last_played) * 1000);

    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
}

function GamesListView({ games }: GamesListViewProps) {
    return (
        <div className="flex justify-center">
            <Table
                aria-label="Games"
                selectionMode="multiple"
                selectionBehavior="toggle"
                className="text-off-white border-primary w-full border bg-[#1f2346]"
            >
                <TableHeader className="text-left">
                    <Column>Play</Column>
                    <Column isRowHeader>Game Name</Column>
                    <Column>Last Played</Column>
                </TableHeader>
                <TableBody>
                    {games.map((game, index) => (
                        <Row
                            key={game.app_id}
                            id={game.app_id}
                            className="odd:bg-[#23244f] even:bg-[#26264f]"
                        >
                            <Cell>Play</Cell>
                            <Cell>{game.name}</Cell>
                            <Cell>{convertToTime(game.last_played)}</Cell>
                        </Row>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default GamesListView;
