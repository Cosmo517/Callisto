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

#[derive(Debug)]
pub struct Game {
    app_id: i32,
    name: String,
    install_dir: Option<String>,
    last_updated: Option<String>,
    last_played: Option<String>,
    last_owner: Option<String>,
    manifest: Option<String>,
    size: Option<i64>,
}

pub fn retrieve_games(user_id: i32) -> Result<Vec<Game>> {
    let conn = Connection::open("../data/data.db")?;

    let mut stmt = conn.prepare(
        "SELECT g.app_id, g.name, g.install_dir, g.last_updated, g.last_played, 
                g.last_owner, g.manifest, g.size
         FROM Game g
         JOIN User_Games ug ON g.app_id = ug.app_id
         WHERE ug.user_id = ?1"
    )?;

    let games_iter = stmt.query_map(params![user_id], |row| {
        Ok(Game {
            app_id: row.get(0)?,
            name: row.get(1)?,
            install_dir: row.get(2)?,
            last_updated: row.get(3)?,
            last_played: row.get(4)?,
            last_owner: row.get(5)?,
            manifest: row.get(6)?,
            size: row.get(7)?,
        })
    })?;

    let mut games = Vec::new();
    for game in games_iter {
        games.push(game?);
    }

    Ok(games)
}