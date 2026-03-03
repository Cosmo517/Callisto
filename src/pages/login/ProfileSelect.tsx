import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/UserContext';
import { useSettings } from '../../common/SettingsContext';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

type User = {
    id: number;
    username: string;
    profile_picture?: string;
};

function avatarColor(username: string) {
    const colors = ['bg-accent-1', 'bg-accent-2', 'bg-secondary', 'bg-primary'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function ProfileSelect() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const { settings, setSetting } = useSettings();
    const [userProfiles, setUserProfiles] = useState<User[]>([]);

    useEffect(() => {
        invoke<User[]>('tauri_get_all_users')
            .then(setUserProfiles)
            .catch((err) => console.error('Error fetching users:', err));
    }, []);

    const profileSelected = (profile: User) => {
        setUser({ id: profile.id.toString(), username: profile.username, profile_picture: '' });
        navigate('/library');
    };

    const toggleDefault = (e: React.MouseEvent, profile: User) => {
        e.stopPropagation();
        setSetting(
            'defaultUserId',
            settings.defaultUserId === profile.id ? null : profile.id
        );
    };

    return (
        <main className="h-svh w-full flex flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-1">
                <h1 className="text-off-white text-3xl font-bold tracking-wide">Callisto</h1>
                <p className="text-secondary text-sm">Who's playing?</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 max-w-lg px-4">
                {userProfiles.map((user) => {
                    const isDefault = settings.defaultUserId === user.id;
                    return (
                        <div key={user.id} className="relative">
                            <button
                                onClick={() => profileSelected(user)}
                                className="flex flex-col items-center gap-3 p-4 w-32 rounded-xl bg-primary hover:bg-accent-2 cursor-pointer transition-colors group"
                            >
                                <div className={`${avatarColor(user.username)} w-16 h-16 rounded-full flex items-center justify-center text-off-white text-2xl font-bold select-none`}>
                                    {user.username[0].toUpperCase()}
                                </div>
                                <span className="text-off-white text-sm font-medium truncate w-full text-center">
                                    {user.username}
                                </span>
                            </button>
                            {/* Default toggle */}
                            <button
                                onClick={(e) => toggleDefault(e, user)}
                                title={isDefault ? 'Clear auto-login' : 'Set as auto-login'}
                                className="absolute top-2 right-2 p-0.5 rounded cursor-pointer"
                            >
                                {isDefault
                                    ? <StarSolid className="w-4 h-4 text-yellow-400" />
                                    : <StarIcon className="w-4 h-4 text-secondary hover:text-yellow-400 transition-colors" />
                                }
                            </button>
                        </div>
                    );
                })}

                <button
                    onClick={() => navigate('/create')}
                    className="flex flex-col items-center gap-3 p-4 w-32 rounded-xl border-2 border-dashed border-primary hover:border-accent-2 cursor-pointer transition-colors group"
                >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-secondary group-hover:text-off-white text-3xl transition-colors">
                        +
                    </div>
                    <span className="text-secondary group-hover:text-off-white text-sm transition-colors">
                        New Profile
                    </span>
                </button>
            </div>

            <button
                onClick={() => navigate('/onboard')}
                className="text-secondary hover:text-off-white text-sm cursor-pointer transition-colors mt-4"
            >
                ← Back
            </button>
        </main>
    );
}

export default ProfileSelect;
