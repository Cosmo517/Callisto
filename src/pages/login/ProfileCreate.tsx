import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileCreate() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const createProfile = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const success = await invoke<boolean>('tauri_create_user', {
                username,
                profilePicture: undefined,
            });
            if (success) {
                navigate('/profiles');
            } else {
                setError('That username is already taken.');
            }
        } catch (e) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="h-svh w-full flex flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-1">
                <h1 className="text-off-white text-3xl font-bold tracking-wide">
                    Callisto
                </h1>
                <p className="text-secondary text-sm">Create a profile</p>
            </div>

            <form
                onSubmit={createProfile}
                className="flex flex-col items-center gap-4 w-72"
            >
                {/* Avatar preview */}
                <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center text-off-white text-3xl font-bold select-none">
                    {username ? username[0].toUpperCase() : '?'}
                </div>

                <div className="w-full flex flex-col gap-1">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter a username"
                        required
                        autoFocus
                        className="w-full bg-primary border border-secondary text-off-white placeholder:text-secondary px-4 py-2 rounded-md focus:outline-none focus:border-accent-1 transition-colors"
                    />
                    {error && (
                        <p className="text-accent-1 text-xs px-1">{error}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting || !username.trim()}
                    className="w-full bg-accent-1 hover:bg-accent-2 disabled:opacity-40 disabled:cursor-not-allowed text-off-white font-medium py-2 rounded-md cursor-pointer transition-colors"
                >
                    {submitting ? 'Creating…' : 'Create Profile'}
                </button>
            </form>

            <button
                onClick={() => navigate('/profiles')}
                className="text-secondary hover:text-off-white text-sm cursor-pointer transition-colors"
            >
                ← Back
            </button>
        </main>
    );
}

export default ProfileCreate;
