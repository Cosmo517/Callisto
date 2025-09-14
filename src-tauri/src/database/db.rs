use rusqlite::{params, Connection, Result};

pub fn init_db() -> Result<()> {
    let conn = Connection::open("../data/data.db")?;
    
    // User
    conn.execute(
        "CREATE TABLE IF NOT EXISTS User (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            profile_picture TEXT
        )",
        (),
    )?;

    // Game
    conn.execute(
        "CREATE TABLE IF NOT EXISTS Game (
            app_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            install_dir TEXT,
            last_updated TEXT,
            last_played TEXT,
            last_owner TEXT,
            manifest TEXT,
            size INTEGER
        )",
        (),
    )?;

    // User_Games
    conn.execute(
        "CREATE TABLE IF NOT EXISTS User_Games (
            user_id INTEGER NOT NULL,
            app_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, app_id),
            FOREIGN KEY (user_id) REFERENCES User(id),
            FOREIGN KEY (app_id) REFERENCES Game(app_id)
        )",
        (),
    )?;

    Ok(())
}

pub fn insert_game(
    app_id: &str,
    name: &str,
    install_dir: &str,
    last_updated: &str,
    last_played: &str,
    last_owner: &str,
    manifest: &str,
    size: &str,
) -> Result<()> {
    let conn = Connection::open("../data/data.db")?;

    conn.execute(
        "INSERT OR REPLACE INTO Game (
            app_id, name, install_dir, last_updated, last_played, last_owner, manifest, size
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![app_id, name, install_dir, last_updated, last_played, last_owner, manifest, size],
    )?;
    Ok(())
}