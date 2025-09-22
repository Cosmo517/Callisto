import { useEffect, useState } from 'react';
import { Selection } from '@react-types/shared';
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

type Props = {
    games: Game[];
    selectedGames: Selection;
    setSelectedGames: React.Dispatch<React.SetStateAction<Selection>>;
    onRowClick?: (game: Game) => void;
};

export default function GameTable({
    games,
    selectedGames,
    setSelectedGames,
    onRowClick,
}: Props) {
    useEffect(() => {
        if (selectedGames === 'all') {
            // everything is selected
            const allIds = games.map((g) => g.app_id);
            console.log(allIds);
        } else {
            // it's a Set of keys
            const ids = Array.from(selectedGames) as number[];
            console.log(ids);
        }
    }, [selectedGames]);

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

    return (
        <div className="flex justify-center">
            <Table
                aria-label="Games"
                selectionMode="multiple"
                selectionBehavior="toggle"
                selectedKeys={selectedGames}
                onSelectionChange={setSelectedGames}
                className="text-off-white border-primary w-full border bg-[#1f2346]"
            >
                <TableHeader>
                    <Column className="w-16 text-center">Select</Column>
                    <Column isRowHeader>App ID</Column>
                    <Column>Game Name</Column>
                    <Column>Install Directory</Column>
                    <Column>Last Played</Column>
                    <Column>Size</Column>
                </TableHeader>
                <TableBody>
                    {games.map((game, index) => (
                        <Row
                            key={game.app_id}
                            id={game.app_id}
                            className="odd:bg-[#23244f] even:bg-[#26264f]"
                        >
                            <Cell className="flex h-5 items-center justify-center">
                                <Checkbox
                                    slot="selection"
                                    className="h-4 w-4 cursor-pointer rounded border border-gray-400 bg-gray-700 hover:border-blue-300 data-[selected]:border-blue-500 data-[selected]:bg-blue-500"
                                />
                            </Cell>
                            <Cell className="w-26">{game.app_id}</Cell>
                            <Cell className="w-60">{game.name}</Cell>
                            <Cell>{game.install_dir}</Cell>
                            <Cell className="w-60">
                                {convertToTime(game.last_played)}
                            </Cell>
                            <Cell>{humanSize(game.size)}</Cell>
                        </Row>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
