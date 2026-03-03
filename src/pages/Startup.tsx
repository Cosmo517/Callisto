import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { useUser } from '../common/UserContext';
import { useSettings } from '../common/SettingsContext';

type User = { id: number; username: string; profile_picture?: string };

export default function Startup() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const { settings } = useSettings();

    useEffect(() => {
        invoke<User[]>('tauri_get_all_users').then((users) => {
            if (users.length === 0) {
                // First launch — no profiles yet
                navigate('/onboard');
                return;
            }

            // Try auto-login with the stored default
            if (settings.defaultUserId !== null) {
                const defaultUser = users.find((u) => u.id === settings.defaultUserId);
                if (defaultUser) {
                    setUser({
                        id: defaultUser.id.toString(),
                        username: defaultUser.username,
                        profile_picture: '',
                    });
                    navigate('/library');
                    return;
                }
            }

            navigate('/profiles');
        });
    }, []);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className="w-8 h-8 border-4 border-secondary border-t-accent-1 rounded-full animate-spin" />
        </div>
    );
}
