import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useNavigate } from 'react-router-dom';

type OnboardState =
    | { stage: 'idle' }
    | { stage: 'detecting' }
    | { stage: 'detected'; path: string }
    | { stage: 'not_found' }
    | { stage: 'importing'; path: string }
    | { stage: 'error'; message: string };

function OnboardSelect() {
    const navigate = useNavigate();
    const [state, setState] = useState<OnboardState>({ stage: 'idle' });

    async function handleSteamClick() {
        setState({ stage: 'detecting' });
        const path = await invoke<string | null>('detect_steam_path');
        if (path) {
            setState({ stage: 'detected', path });
        } else {
            setState({ stage: 'not_found' });
        }
    }

    async function browseForFolder() {
        const result = await open({
            title: 'Select your steamapps folder',
            multiple: false,
            directory: true,
        });
        if (!result) return;
        const path = Array.isArray(result) ? result[0] : result;
        setState({ stage: 'detected', path });
    }

    async function importLibrary(path: string) {
        setState({ stage: 'importing', path });
        try {
            await invoke('onboard_steam', { steamPath: path });
            navigate('/profiles');
        } catch (e) {
            setState({ stage: 'error', message: String(e) });
        }
    }

    return (
        <main className="h-svh w-full flex flex-col items-center justify-center gap-6">
            <h1 className="text-off-white text-3xl font-bold tracking-wide">
                Callisto
            </h1>
            <p className="text-secondary text-sm">Your game library, one place.</p>

            {state.stage === 'idle' && (
                <div className="flex flex-col items-center gap-4 mt-4">
                    <p className="text-off-white text-base">
                        Select a game library to import
                    </p>
                    <button
                        onClick={handleSteamClick}
                        className="bg-primary hover:bg-accent-2 text-off-white text-lg font-medium w-48 py-2 rounded-md cursor-pointer transition-colors"
                    >
                        Steam
                    </button>
                    <button
                        onClick={() => navigate('/profiles')}
                        className="text-secondary hover:text-off-white text-sm mt-6 cursor-pointer transition-colors"
                    >
                        Already have a profile? Sign in →
                    </button>
                </div>
            )}

            {state.stage === 'detecting' && (
                <div className="flex flex-col items-center gap-3 mt-4">
                    <div className="w-8 h-8 border-4 border-secondary border-t-accent-1 rounded-full animate-spin" />
                    <p className="text-secondary text-sm">
                        Looking for your Steam library…
                    </p>
                </div>
            )}

            {state.stage === 'detected' && (
                <div className="flex flex-col items-center gap-4 mt-4 max-w-md w-full px-4">
                    <p className="text-off-white text-base">Steam library found:</p>
                    <div className="bg-primary rounded-md px-4 py-2 w-full text-center">
                        <span className="text-secondary text-sm break-all">
                            {state.path}
                        </span>
                    </div>
                    <button
                        onClick={() => importLibrary(state.path)}
                        className="bg-accent-1 hover:bg-accent-2 text-off-white text-lg font-medium w-48 py-2 rounded-md cursor-pointer transition-colors"
                    >
                        Import Library
                    </button>
                    <button
                        onClick={browseForFolder}
                        className="text-secondary hover:text-off-white text-sm cursor-pointer transition-colors"
                    >
                        Choose a different folder
                    </button>
                </div>
            )}

            {state.stage === 'not_found' && (
                <div className="flex flex-col items-center gap-4 mt-4">
                    <p className="text-off-white text-base">
                        Couldn't auto-detect your Steam library.
                    </p>
                    <p className="text-secondary text-sm">
                        Please select your <code className="text-off-white">steamapps</code> folder manually.
                    </p>
                    <button
                        onClick={browseForFolder}
                        className="bg-primary hover:bg-accent-2 text-off-white text-lg font-medium w-48 py-2 rounded-md cursor-pointer transition-colors"
                    >
                        Browse…
                    </button>
                    <button
                        onClick={() => setState({ stage: 'idle' })}
                        className="text-secondary hover:text-off-white text-sm cursor-pointer transition-colors"
                    >
                        ← Back
                    </button>
                </div>
            )}

            {state.stage === 'importing' && (
                <div className="flex flex-col items-center gap-3 mt-4">
                    <div className="w-8 h-8 border-4 border-secondary border-t-accent-1 rounded-full animate-spin" />
                    <p className="text-off-white text-base">Importing your Steam library…</p>
                    <p className="text-secondary text-sm break-all max-w-md text-center px-4">
                        {state.path}
                    </p>
                </div>
            )}

            {state.stage === 'error' && (
                <div className="flex flex-col items-center gap-4 mt-4">
                    <p className="text-off-white text-base">Something went wrong.</p>
                    <p className="text-secondary text-sm max-w-md text-center px-4">
                        {state.message}
                    </p>
                    <button
                        onClick={() => setState({ stage: 'idle' })}
                        className="bg-primary hover:bg-accent-2 text-off-white text-base w-48 py-2 rounded-md cursor-pointer transition-colors"
                    >
                        Try again
                    </button>
                </div>
            )}
        </main>
    );
}

export default OnboardSelect;
