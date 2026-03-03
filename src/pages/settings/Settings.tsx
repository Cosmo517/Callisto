import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import Navbar from '../common/Navbar';
import { useSettings } from '../../common/SettingsContext';

// ── shared primitives ──────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${enabled ? 'bg-accent-1' : 'bg-primary'}`}
        >
            <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-off-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
    );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-8 py-4 border-b border-secondary/40 last:border-0">
            <div className="flex flex-col gap-0.5">
                <span className="text-off-white text-sm font-medium">{label}</span>
                {description && <span className="text-secondary text-xs">{description}</span>}
            </div>
            {children}
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-secondary text-xs font-semibold uppercase tracking-widest mb-2">{title}</h2>
            <div className="bg-navbar-color border border-secondary/60 rounded-lg px-4">{children}</div>
        </div>
    );
}

// ── steam import flow ──────────────────────────────────────────────────────

type ImportStage =
    | { stage: 'idle' }
    | { stage: 'detecting' }
    | { stage: 'detected'; path: string }
    | { stage: 'not_found' }
    | { stage: 'importing'; path: string }
    | { stage: 'done'; count: number }
    | { stage: 'error'; message: string };

function SteamImportSection() {
    const [state, setState] = useState<ImportStage>({ stage: 'idle' });

    const detect = async () => {
        setState({ stage: 'detecting' });
        const path = await invoke<string | null>('detect_steam_path');
        setState(path ? { stage: 'detected', path } : { stage: 'not_found' });
    };

    const browse = async () => {
        const result = await open({ title: 'Select your steamapps folder', multiple: false, directory: true });
        if (!result) return;
        const path = Array.isArray(result) ? result[0] : result;
        setState({ stage: 'detected', path });
    };

    const importLibrary = async (path: string) => {
        setState({ stage: 'importing', path });
        try {
            const games = await invoke<{ length: number }[]>('onboard_steam', { steamPath: path });
            setState({ stage: 'done', count: games.length });
        } catch (e) {
            setState({ stage: 'error', message: String(e) });
        }
    };

    return (
        <div className="py-4 flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
                <span className="text-off-white text-sm font-medium">Import Steam Library</span>
                <span className="text-secondary text-xs">Re-scan or import from a different steamapps folder.</span>
            </div>

            {state.stage === 'idle' && (
                <div className="flex gap-2">
                    <button onClick={detect} className="bg-primary hover:bg-accent-2 text-off-white text-sm px-4 py-1.5 rounded-md cursor-pointer transition-colors">
                        Auto-detect
                    </button>
                    <button onClick={browse} className="bg-primary hover:bg-accent-2 text-off-white text-sm px-4 py-1.5 rounded-md cursor-pointer transition-colors">
                        Browse…
                    </button>
                </div>
            )}

            {state.stage === 'detecting' && (
                <div className="flex items-center gap-2 text-secondary text-sm">
                    <div className="w-4 h-4 border-2 border-secondary border-t-accent-1 rounded-full animate-spin" />
                    Detecting…
                </div>
            )}

            {state.stage === 'detected' && (
                <div className="flex flex-col gap-2">
                    <p className="text-secondary text-xs break-all">{state.path}</p>
                    <div className="flex gap-2">
                        <button onClick={() => importLibrary(state.path)} className="bg-accent-1 hover:bg-accent-2 text-off-white text-sm px-4 py-1.5 rounded-md cursor-pointer transition-colors">
                            Import
                        </button>
                        <button onClick={browse} className="text-secondary hover:text-off-white text-sm cursor-pointer transition-colors">
                            Different folder
                        </button>
                    </div>
                </div>
            )}

            {state.stage === 'not_found' && (
                <div className="flex flex-col gap-2">
                    <p className="text-secondary text-xs">Steam library not found automatically.</p>
                    <div className="flex gap-2">
                        <button onClick={browse} className="bg-primary hover:bg-accent-2 text-off-white text-sm px-4 py-1.5 rounded-md cursor-pointer transition-colors">
                            Browse…
                        </button>
                        <button onClick={() => setState({ stage: 'idle' })} className="text-secondary hover:text-off-white text-sm cursor-pointer transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {state.stage === 'importing' && (
                <div className="flex items-center gap-2 text-secondary text-sm">
                    <div className="w-4 h-4 border-2 border-secondary border-t-accent-1 rounded-full animate-spin" />
                    Importing…
                </div>
            )}

            {state.stage === 'done' && (
                <div className="flex items-center justify-between">
                    <p className="text-off-white text-sm">{state.count} games imported.</p>
                    <button onClick={() => setState({ stage: 'idle' })} className="text-secondary hover:text-off-white text-xs cursor-pointer transition-colors">
                        Done
                    </button>
                </div>
            )}

            {state.stage === 'error' && (
                <div className="flex flex-col gap-2">
                    <p className="text-accent-1 text-xs">{state.message}</p>
                    <button onClick={() => setState({ stage: 'idle' })} className="text-secondary hover:text-off-white text-xs cursor-pointer transition-colors w-fit">
                        Try again
                    </button>
                </div>
            )}
        </div>
    );
}

// ── main settings page ─────────────────────────────────────────────────────

type User = { id: number; username: string };

function Settings() {
    const { settings, setSetting } = useSettings();
    const [defaultUser, setDefaultUser] = useState<User | null>(null);

    useEffect(() => {
        if (settings.defaultUserId === null) { setDefaultUser(null); return; }
        invoke<User[]>('tauri_get_all_users').then((users) => {
            setDefaultUser(users.find((u) => u.id === settings.defaultUserId) ?? null);
        });
    }, [settings.defaultUserId]);

    return (
        <div className="bg-background flex h-screen flex-col">
            <Navbar />
            <div className="flex-1 overflow-y-auto mt-14">
                <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-8">
                    <h1 className="text-off-white text-2xl font-bold">Settings</h1>

                    <Section title="Accounts">
                        <SettingRow
                            label="Auto-login"
                            description="Automatically sign in to this profile on launch."
                        >
                            {defaultUser ? (
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-off-white text-sm">{defaultUser.username}</span>
                                    <button
                                        onClick={() => setSetting('defaultUserId', null)}
                                        className="text-secondary hover:text-accent-1 text-xs cursor-pointer transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                            ) : (
                                <span className="text-secondary text-sm shrink-0">Not set</span>
                            )}
                        </SettingRow>
                    </Section>

                    <Section title="Library">
                        <SettingRow
                            label="Sidebar thumbnails"
                            description="Show game cover art next to each title in the sidebar."
                        >
                            <Toggle
                                enabled={settings.showSidebarThumbnails}
                                onChange={(v) => setSetting('showSidebarThumbnails', v)}
                            />
                        </SettingRow>
                        <SteamImportSection />
                    </Section>
                </div>
            </div>
        </div>
    );
}

export default Settings;
