import { Game } from '../../../common/interfaces/GameInterface';

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
    return (
        <div className="bg-primary border-secondary w-full overflow-x-auto rounded-md border p-2">
            <table className="min-w-full table-auto text-left">
                <thead className="bg-[#1f2346]">
                    <tr>
                        <th className="text-off-white px-4 py-2">App ID</th>
                        <th className="text-off-white px-4 py-2">Name</th>
                        <th className="text-off-white px-4 py-2">
                            Install Dir
                        </th>
                        <th className="text-off-white px-4 py-2">
                            Last Played
                        </th>
                        <th className="text-off-white px-4 py-2">
                            Last Updated
                        </th>
                        <th className="text-off-white px-4 py-2">Owner</th>
                        <th className="text-off-white px-4 py-2 text-right">
                            Size
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {games.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="text-secondary px-4 py-6 text-center"
                            >
                                No games found.
                            </td>
                        </tr>
                    ) : (
                        games.map((g) => (
                            <tr
                                key={g.app_id}
                                onClick={() => onRowClick?.(g)}
                                className="cursor-pointer odd:bg-[#23244f] even:bg-[#26264f] hover:bg-[#2f2a6a]"
                            >
                                <td className="text-off-white px-4 py-3">
                                    {g.app_id}
                                </td>
                                <td className="text-off-white px-4 py-3">
                                    {g.name}
                                </td>
                                <td
                                    className="text-secondary max-w-xs truncate px-4 py-3"
                                    title={g.install_dir ?? ''}
                                >
                                    {g.install_dir ?? '-'}
                                </td>
                                <td className="text-secondary px-4 py-3">
                                    {g.last_played ?? '-'}
                                </td>
                                <td className="text-secondary px-4 py-3">
                                    {g.last_updated ?? '-'}
                                </td>
                                <td className="text-secondary px-4 py-3">
                                    {g.last_owner ?? '-'}
                                </td>
                                <td className="text-off-white px-4 py-3 text-right">
                                    {humanSize(g.size)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
