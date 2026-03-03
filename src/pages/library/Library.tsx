import { invoke } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import Navbar from '../common/Navbar';
import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../../common/UserContext';
import { useSettings } from '../../common/SettingsContext';
import { Game } from '../../common/interfaces/GameInterface';
import ContextMenu, { ContextMenuOption } from './components/ContextMenu';
import {
    PlayIcon,
    StarIcon,
    EyeSlashIcon,
    EyeIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

type GameMetadata = {
    app_id: number;
    short_description: string;
    developer: string;
    publisher: string;
    release_date: string;
    genres: string;
};

type NewsItem = {
    gid: string;
    title: string;
    url: string;
    contents: string;
    date: number;
};

type GameDetails = {
    metadata: GameMetadata | null;
    news: NewsItem[];
};

type ContextMenuState = { x: number; y: number; game: Game } | null;

function Library() {
    const [games, setGames] = useState<Game[]>([]);
    const [selected, setSelected] = useState<Game | null>(null);
    const [search, setSearch] = useState('');
    const [showHidden, setShowHidden] = useState(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
    const { user } = useUser();

    useEffect(() => {
        invoke<Game[]>('tauri_retrieve_all_games')
            .then((allGames) => {
                const ids = allGames.map((g) => Number(g.app_id));
                return invoke('tauri_add_user_games', {
                    userId: Number(user.id),
                    gameIds: ids,
                });
            })
            .then(() =>
                invoke<Game[]>('tauri_retrieve_user_games', {
                    userId: Number(user.id),
                })
            )
            .then((userGames) => {
                setGames(userGames);
                const first = userGames.find((g) => !g.is_hidden);
                setSelected(first ?? userGames[0] ?? null);
            })
            .catch((err) => console.error('Error loading library:', err));
    }, []);

    const updateGame = (appId: string, patch: Partial<Game>) => {
        setGames((prev) =>
            prev.map((g) => (g.app_id === appId ? { ...g, ...patch } : g))
        );
        setSelected((prev) =>
            prev?.app_id === appId ? { ...prev, ...patch } : prev
        );
    };

    const handleToggleFavorite = (game: Game) => {
        invoke<boolean>('tauri_toggle_favorite', {
            userId: Number(user.id),
            appId: Number(game.app_id),
        }).then((is_favorite) => updateGame(game.app_id, { is_favorite }));
    };

    const handleToggleHidden = (game: Game) => {
        invoke<boolean>('tauri_toggle_hidden', {
            userId: Number(user.id),
            appId: Number(game.app_id),
        }).then((is_hidden) => {
            updateGame(game.app_id, { is_hidden });
            // If we just hid the selected game and hidden games aren't shown, pick next visible
            if (is_hidden && selected?.app_id === game.app_id && !showHidden) {
                const next = games.find((g) => !g.is_hidden && g.app_id !== game.app_id);
                setSelected(next ?? null);
            }
        });
    };

    const openContextMenu = (e: React.MouseEvent, game: Game) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, game });
    };

    const contextMenuOptions = (game: Game): ContextMenuOption[] => [
        {
            label: 'Play',
            icon: <PlayIcon />,
            onClick: () => invoke('launch_steam_game', { appId: game.app_id.toString() }),
        },
        { separator: true },
        {
            label: game.is_favorite ? 'Remove from Favorites' : 'Add to Favorites',
            icon: game.is_favorite ? <StarSolid className="text-yellow-400" /> : <StarIcon />,
            onClick: () => handleToggleFavorite(game),
        },
        {
            label: game.is_hidden ? 'Unhide' : 'Hide from Library',
            icon: game.is_hidden ? <EyeIcon /> : <EyeSlashIcon />,
            onClick: () => handleToggleHidden(game),
        },
        { separator: true },
        {
            label: 'View on Steam',
            icon: <ArrowTopRightOnSquareIcon />,
            onClick: () => openUrl(`https://store.steampowered.com/app/${game.app_id}/`),
        },
    ];

    const { visibleGames, hiddenCount } = useMemo(() => {
        const q = search.toLowerCase();
        const matched = games.filter((g) => g.name.toLowerCase().includes(q));
        const favorites = matched.filter((g) => g.is_favorite && !g.is_hidden).sort((a, b) => a.name.localeCompare(b.name));
        const regular = matched.filter((g) => !g.is_favorite && !g.is_hidden).sort((a, b) => a.name.localeCompare(b.name));
        const hidden = matched.filter((g) => g.is_hidden).sort((a, b) => a.name.localeCompare(b.name));
        return {
            visibleGames: { favorites, regular, hidden },
            hiddenCount: games.filter((g) => g.is_hidden).length,
        };
    }, [games, search]);

    return (
        <div className="bg-background flex h-screen flex-col" onClick={() => setContextMenu(null)}>
            <Navbar />

            <div className="flex flex-1 overflow-hidden mt-14">
                {/* Sidebar */}
                <aside className="bg-navbar-color border-r border-secondary flex w-72 shrink-0 flex-col">
                    <div className="p-3 border-b border-secondary">
                        <input
                            type="text"
                            placeholder="Search games…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background border border-secondary text-off-white placeholder:text-secondary text-sm px-3 py-1.5 rounded-md focus:outline-none focus:border-accent-1 transition-colors"
                        />
                    </div>

                    <ul className="flex-1 overflow-y-auto">
                        {/* Favorites */}
                        {visibleGames.favorites.length > 0 && (
                            <>
                                <li className="px-4 pt-3 pb-1">
                                    <span className="text-secondary text-xs uppercase tracking-widest">Favorites</span>
                                </li>
                                {visibleGames.favorites.map((game) => (
                                    <SidebarItem
                                        key={game.app_id}
                                        game={game}
                                        active={selected?.app_id === game.app_id}
                                        onClick={() => setSelected(game)}
                                        onContextMenu={(e) => openContextMenu(e, game)}
                                    />
                                ))}
                                {visibleGames.regular.length > 0 && (
                                    <li className="px-4 pt-3 pb-1">
                                        <span className="text-secondary text-xs uppercase tracking-widest">All Games</span>
                                    </li>
                                )}
                            </>
                        )}

                        {/* Regular */}
                        {visibleGames.regular.map((game) => (
                            <SidebarItem
                                key={game.app_id}
                                game={game}
                                active={selected?.app_id === game.app_id}
                                onClick={() => setSelected(game)}
                                onContextMenu={(e) => openContextMenu(e, game)}
                            />
                        ))}

                        {/* Hidden (revealed) */}
                        {showHidden && visibleGames.hidden.length > 0 && (
                            <>
                                <li className="px-4 pt-3 pb-1">
                                    <span className="text-secondary text-xs uppercase tracking-widest">Hidden</span>
                                </li>
                                {visibleGames.hidden.map((game) => (
                                    <SidebarItem
                                        key={game.app_id}
                                        game={game}
                                        active={selected?.app_id === game.app_id}
                                        onClick={() => setSelected(game)}
                                        onContextMenu={(e) => openContextMenu(e, game)}
                                        muted
                                    />
                                ))}
                            </>
                        )}

                        {visibleGames.favorites.length === 0 &&
                            visibleGames.regular.length === 0 &&
                            (!showHidden || visibleGames.hidden.length === 0) && (
                                <li className="text-secondary text-sm px-4 py-4 text-center">
                                    No games found.
                                </li>
                            )}
                    </ul>

                    {/* Footer */}
                    <div className="border-t border-secondary px-4 py-2 flex items-center justify-between">
                        <span className="text-secondary text-xs">
                            {games.filter((g) => !g.is_hidden).length} games
                        </span>
                        {hiddenCount > 0 && (
                            <button
                                onClick={() => setShowHidden((v) => !v)}
                                className="text-secondary hover:text-off-white text-xs cursor-pointer transition-colors"
                            >
                                {showHidden ? 'Hide hidden' : `${hiddenCount} hidden`}
                            </button>
                        )}
                    </div>
                </aside>

                {/* Detail panel */}
                <main className="flex-1 overflow-y-auto bg-background">
                    {selected ? (
                        <GameDetail game={selected} onToggleFavorite={handleToggleFavorite} />
                    ) : (
                        <div className="flex h-full items-center justify-center text-secondary text-sm">
                            Select a game to view details.
                        </div>
                    )}
                </main>
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    options={contextMenuOptions(contextMenu.game)}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
}

function SidebarItem({
    game,
    active,
    onClick,
    onContextMenu,
    muted = false,
}: {
    game: Game;
    active: boolean;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    muted?: boolean;
}) {
    const appId = game.app_id.toString();
    const { settings } = useSettings();

    return (
        <li>
            <button
                onClick={onClick}
                onContextMenu={onContextMenu}
                className={`w-full flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors border-l-2 ${
                    active
                        ? 'bg-primary/60 border-accent-1'
                        : 'border-transparent hover:bg-primary/30 hover:border-secondary'
                } ${muted ? 'opacity-50' : ''}`}
            >
                {settings.showSidebarThumbnails && (
                    <img
                        src={`https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_sm_120.jpg`}
                        alt=""
                        className="w-12 h-7 rounded object-cover shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                )}
                <span className={`text-sm truncate text-left flex-1 ${active ? 'text-off-white' : 'text-secondary'}`}>
                    {game.name}
                </span>
                {game.is_favorite && (
                    <StarSolid className="w-3 h-3 text-yellow-400 shrink-0" />
                )}
            </button>
        </li>
    );
}

function GameDetail({
    game,
    onToggleFavorite,
}: {
    game: Game;
    onToggleFavorite: (game: Game) => void;
}) {
    const appId = game.app_id.toString();
    const heroUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_hero.jpg`;
    const capsuleUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;
    const headerUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

    const [details, setDetails] = useState<GameDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDetails(null);
        setLoading(true);
        invoke<GameDetails>('fetch_game_details', { appId: Number(game.app_id) })
            .then(setDetails)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [game.app_id]);

    const playGame = () => invoke('launch_steam_game', { appId });

    const lastPlayed = Number(game.last_played);
    const lastPlayedStr = lastPlayed
        ? new Date(lastPlayed * 1000).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
          })
        : 'Never';

    return (
        <div className="flex flex-col h-full">
            {/* Hero */}
            <div className="relative w-full h-52 shrink-0 overflow-hidden">
                <img
                    src={heroUrl}
                    onError={(e) => { (e.target as HTMLImageElement).src = headerUrl; }}
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            {/* Info row */}
            <div className="flex items-end gap-5 px-8 -mt-14 relative z-10 pb-5 border-b border-secondary">
                <img
                    src={capsuleUrl}
                    onError={(e) => { (e.target as HTMLImageElement).src = headerUrl; }}
                    alt={game.name}
                    className="w-20 rounded-md shrink-0 shadow-xl"
                />
                <div className="flex flex-col gap-2.5 pb-0.5 flex-1">
                    <h2 className="text-off-white text-2xl font-bold leading-tight">
                        {game.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={playGame}
                            className="bg-accent-1 hover:bg-accent-2 text-off-white text-sm font-semibold px-5 py-1.5 rounded-md cursor-pointer transition-colors"
                        >
                            Play
                        </button>
                        <button
                            onClick={() => onToggleFavorite(game)}
                            title={game.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            className="p-1.5 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                        >
                            {game.is_favorite
                                ? <StarSolid className="w-5 h-5 text-yellow-400" />
                                : <StarIcon className="w-5 h-5 text-secondary hover:text-yellow-400 transition-colors" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
                {loading && (
                    <div className="flex items-center gap-2 text-secondary text-sm">
                        <div className="w-4 h-4 border-2 border-secondary border-t-accent-1 rounded-full animate-spin" />
                        Loading…
                    </div>
                )}

                {details?.metadata?.short_description && (
                    <p className="text-off-white/80 text-sm leading-relaxed">
                        {details.metadata.short_description}
                    </p>
                )}

                {details?.metadata && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        {details.metadata.developer && (
                            <div>
                                <span className="text-secondary text-xs uppercase tracking-wider block mb-0.5">Developer</span>
                                <span className="text-off-white">{details.metadata.developer}</span>
                            </div>
                        )}
                        {details.metadata.publisher && (
                            <div>
                                <span className="text-secondary text-xs uppercase tracking-wider block mb-0.5">Publisher</span>
                                <span className="text-off-white">{details.metadata.publisher}</span>
                            </div>
                        )}
                        {details.metadata.release_date && (
                            <div>
                                <span className="text-secondary text-xs uppercase tracking-wider block mb-0.5">Release Date</span>
                                <span className="text-off-white">{details.metadata.release_date}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-secondary text-xs uppercase tracking-wider block mb-0.5">Last Played</span>
                            <span className="text-off-white">{lastPlayedStr}</span>
                        </div>
                        {details.metadata.genres && (
                            <div className="col-span-2">
                                <span className="text-secondary text-xs uppercase tracking-wider block mb-0.5">Genres</span>
                                <span className="text-off-white">{details.metadata.genres}</span>
                            </div>
                        )}
                    </div>
                )}

                {details && details.news.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h3 className="text-secondary text-xs font-semibold uppercase tracking-widest">
                            Recent Updates
                        </h3>
                        <div className="flex flex-col gap-2">
                            {details.news.map((item) => (
                                <button
                                    key={item.gid}
                                    onClick={() => openUrl(item.url)}
                                    className="bg-navbar-color border border-secondary/50 hover:border-secondary rounded-lg px-4 py-3 text-left cursor-pointer transition-colors group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-off-white text-sm font-medium group-hover:text-accent-1 transition-colors leading-snug">
                                            {item.title}
                                        </span>
                                        <span className="text-secondary text-xs shrink-0 mt-0.5">
                                            {new Date(item.date * 1000).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    {item.contents && (
                                        <p className="text-secondary text-xs mt-1.5 line-clamp-2 leading-relaxed">
                                            {item.contents}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Library;
