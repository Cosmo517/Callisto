use rusqlite::{params, Connection, Error as RusqliteError, Result};
use serde::Serialize;


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
    app_id: i64,
    name: &str,
    install_dir: &str,
    last_updated: &str,
    last_played: &str,
    last_owner: &str,
    manifest: &str,
    size: i64,
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

#[derive(Debug, Serialize)]
pub struct Game {
    pub app_id: i64,
    pub name: String,
    pub install_dir: String,
    pub last_updated: String,
    pub last_played: String,
    pub last_owner: String,
    pub manifest: String,
    pub size: i64,
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


pub fn create_user(username: &str, profile_picture: Option<&str>) -> Result<bool> {
    let conn = Connection::open("../data/data.db")?;

    let result = conn.execute(
        "INSERT INTO User (username, profile_picture) VALUES (?1, ?2)",
        params![username, profile_picture],
    );

    match result {
        Ok(rows_inserted) if rows_inserted > 0 => Ok(true), // user created
        Ok(_) => Ok(false), // no row inserted (rare case)
        Err(RusqliteError::SqliteFailure(err, _))
            if err.code == rusqlite::ErrorCode::ConstraintViolation =>
        {
            Ok(false) // username already exists
        }
        Err(e) => Err(e), // propagate any other error
    }
}

#[derive(Debug, Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub profile_picture: String,
}

pub fn get_all_users() -> Result<Vec<User>> {
    let conn = Connection::open("../data/data.db")?;

    let mut result = conn.prepare(
        "SELECT * from User"
    )?;

    
    let user_iter = result.query_map([],|row| {
        Ok(User {
            id: row.get(0)?,
            username: row.get(1)?,
            profile_picture: row.get(2)?,
        })
    })?;

    let mut users = Vec::new();
    for user in user_iter {
        users.push(user?);
    }

    Ok(users)
}

pub fn get_all_games() -> Result<Vec<Game>> {
    let conn = Connection::open("../data/data.db")?;

    let mut result = conn.prepare(
        "SELECT * from Game"
    )?;

    
    let game_iter = result.query_map([],|row| {
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
    for game in game_iter {
        games.push(game?);
    }

    Ok(games)
}

pub fn add_user_games(user_id: i32, game_ids: &[i32]) -> Result<()> {
    let mut conn = Connection::open("../data/data.db")?;

    let tx = conn.transaction()?;

    for app_id in game_ids {
        tx.execute(
            "INSERT OR IGNORE INTO User_Games (user_id, app_id) VALUES (?1, ?2)",
            params![user_id, app_id],
        )?;
    }

    tx.commit()?;
    Ok(())
}