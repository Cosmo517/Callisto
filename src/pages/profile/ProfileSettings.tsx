import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Navbar from '../common/Navbar';
import { useUser } from '../../common/UserContext';
import { Game } from '../../common/interfaces/GameInterface';

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="bg-navbar-color border border-secondary/60 rounded-lg px-5 py-4 flex flex-col gap-1">
            <span className="text-secondary text-xs uppercase tracking-widest">{label}</span>
            <span className="text-off-white text-2xl font-bold">{value}</span>
        </div>
    );
}

function ProfileSettings() {
    const { user } = useUser();
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        invoke<Game[]>('tauri_retrieve_user_games', { userId: Number(user.id) })
            .then(setGames)
            .catch((err) => console.error('Error fetching games:', err));
    }, [user.id]);

    const avatarColors = [
        'bg-accent-1', 'bg-accent-2', 'bg-secondary', 'bg-primary',
    ];
    let hash = 0;
    for (let i = 0; i < user.username.length; i++) {
        hash = user.username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const avatarColor = avatarColors[Math.abs(hash) % avatarColors.length];

    return (
        <div className="bg-background flex h-screen flex-col">
            <Navbar />
            <div className="flex-1 overflow-y-auto mt-14">
                <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-8">

                    {/* Avatar + username */}
                    <div className="flex items-center gap-5">
                        <div className={`${avatarColor} w-20 h-20 rounded-full flex items-center justify-center text-off-white text-3xl font-bold select-none shrink-0`}>
                            {user.username[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <h1 className="text-off-white text-2xl font-bold">{user.username}</h1>
                            <p className="text-secondary text-sm mt-0.5">Player profile</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Games in library" value={games.length} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProfileSettings;
