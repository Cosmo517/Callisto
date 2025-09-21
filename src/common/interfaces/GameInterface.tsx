export interface Game {
    app_id: string;
    name: string;
    install_dir?: string;
    last_updated?: string;
    last_played?: string;
    last_owner?: string;
    manifest?: string;
    size?: number;
}
