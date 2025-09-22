import { Game } from '../../../common/interfaces/GameInterface';
import {
    Cell,
    Column,
    Row,
    Table,
    TableBody,
    TableHeader,
} from 'react-aria-components';

type Props = {
    games: Game[];
    onRowClick?: (game: Game) => void;
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

export default function GameTable({ games, onRowClick }: Props) {
    if (games.length == 0) return <div>Loading</div>;

    return (
        <Table
            aria-label="Files"
            selectionMode="multiple"
            className="text-off-white"
        >
            <TableHeader>
                <Column isRowHeader>App ID</Column>
                <Column>Game Name</Column>
                <Column>Install Directory</Column>
                <Column>Last Played</Column>
                <Column>Size</Column>
            </TableHeader>
            <TableBody>
                {games.map((game, index) => (
                    <Row>
                        <Cell>{game.app_id}</Cell>
                        <Cell>{game.name}</Cell>
                        <Cell>{game.install_dir}</Cell>
                        <Cell>{game.last_played}</Cell>
                        <Cell>{game.size}</Cell>
                    </Row>
                ))}
            </TableBody>
        </Table>
    );
}
