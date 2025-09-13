use rusqlite::{Connection, Result};

pub fn init_db() -> Result<()> {
    let conn = Connection::open("./src/data/data.db")?;
    
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