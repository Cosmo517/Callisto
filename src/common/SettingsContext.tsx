import { useState, useContext, createContext, useEffect } from 'react';

type Settings = {
    showSidebarThumbnails: boolean;
    defaultUserId: number | null;
};

const defaults: Settings = {
    showSidebarThumbnails: false,
    defaultUserId: null,
};

type SettingsContextType = {
    settings: Settings;
    setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const stored = localStorage.getItem('callisto_settings');
            return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
        } catch {
            return defaults;
        }
    });

    useEffect(() => {
        localStorage.setItem('callisto_settings', JSON.stringify(settings));
    }, [settings]);

    const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <SettingsContext.Provider value={{ settings, setSetting }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
    return ctx;
}
