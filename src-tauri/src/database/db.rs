use rusqlite::{params, Connection, Error as RusqliteError, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GameMetadata {
    pub app_id: i64,
    pub short_description: String,
    pub developer: String,
    pub publisher: String,
    pub release_date: String,
    pub genres: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NewsItem {
    pub gid: String,
    pub title: String,
    pub url: String,
    pub contents: String,
    pub date: i64,
}

pub fn get_cached_metadata(app_id: i64) -> Result<Option<GameMetadata>> {
    let conn = Connection::open("../data/data.db")?;
    let result = conn.query_row(
        "SELECT app_id, short_description, developer, publisher, release_date, genres
         FROM GameMetadata WHERE app_id = ?1",
        params![app_id],
        |row| Ok(GameMetadata {
            app_id: row.get(0)?,
            short_description: row.get(1)?,
            developer: row.get(2)?,
            publisher: row.get(3)?,
            release_date: row.get(4)?,
            genres: row.get(5)?,
        }),
    );
    match result {
        Ok(m) => Ok(Some(m)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e),
    }
}

pub fn save_metadata(metadata: &GameMetadata) -> Result<()> {
    let conn = Connection::open("../data/data.db")?;
    conn.execute(
        "INSERT OR REPLACE INTO GameMetadata
         (app_id, short_description, developer, publisher, release_date, genres, fetched_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, strftime('%s', 'now'))",
        params![
            metadata.app_id, metadata.short_description, metadata.developer,
            metadata.publisher, metadata.release_date, metadata.genres
        ],
    )?;
    Ok(())
}

pub fn get_cached_news(app_id: i64) -> Result<Vec<NewsItem>> {
    let conn = Connection::open("../data/data.db")?;
    let mut stmt = conn.prepare(
        "SELECT gid, title, url, contents, date FROM GameNews
         WHERE app_id = ?1 ORDER BY date DESC",
    )?;
    let iter = stmt.query_map(params![app_id], |row| {
        Ok(NewsItem {
            gid: row.get(0)?,
            title: row.get(1)?,
            url: row.get(2)?,
            contents: row.get(3)?,
            date: row.get(4)?,
        })
    })?;
    let mut items = Vec::new();
    for item in iter {
        items.push(item?);
    }
    Ok(items)
}

pub fn save_news(app_id: i64, items: &[NewsItem]) -> Result<()> {
    let conn = Connection::open("../data/data.db")?;
    for item in items {
        conn.execute(
            "INSERT OR REPLACE INTO GameNews (gid, app_id, title, url, contents, date)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![item.gid, app_id, item.title, item.url, item.contents, item.date],
        )?;
    }
    Ok(())
}


pub fn init_db() -> Result<()> {
    std::fs::create_dir_all("../data").ok();
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

    // GameMetadata — cached from Steam Store API
    conn.execute(
        "CREATE TABLE IF NOT EXISTS GameMetadata (
            app_id INTEGER PRIMARY KEY,
            short_description TEXT NOT NULL DEFAULT '',
            developer TEXT NOT NULL DEFAULT '',
            publisher TEXT NOT NULL DEFAULT '',
            release_date TEXT NOT NULL DEFAULT '',
            genres TEXT NOT NULL DEFAULT '',
            fetched_at INTEGER NOT NULL DEFAULT 0
        )",
        (),
    )?;

    // GameNews — cached from Steam News API
    conn.execute(
        "CREATE TABLE IF NOT EXISTS GameNews (
            gid TEXT PRIMARY KEY,
            app_id INTEGER NOT NULL,
            title TEXT NOT NULL DEFAULT '',
            url TEXT NOT NULL DEFAULT '',
            contents TEXT NOT NULL DEFAULT '',
            date INTEGER NOT NULL DEFAULT 0
        )",
        (),
    )?;

    // Migrate User_Games to add per-user flags (safe to run on existing DBs)
    let _ = conn.execute("ALTER TABLE User_Games ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0", ());
    let _ = conn.execute("ALTER TABLE User_Games ADD COLUMN is_hidden INTEGER NOT NULL DEFAULT 0", ());

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
    pub is_favorite: bool,
    pub is_hidden: bool,
}


pub fn retrieve_games(user_id: i32) -> Result<Vec<Game>> {
    let conn = Connection::open("../data/data.db")?;

    let mut stmt = conn.prepare(
        "SELECT g.app_id, g.name, g.install_dir, g.last_updated, g.last_played,
                g.last_owner, g.manifest, g.size, ug.is_favorite, ug.is_hidden
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
            is_favorite: row.get::<_, i32>(8)? != 0,
            is_hidden: row.get::<_, i32>(9)? != 0,
        })
    })?;

    let mut games = Vec::new();
    for game in games_iter {
        games.push(game?);
    }

    Ok(games)
}

pub fn toggle_favorite(user_id: i32, app_id: i64) -> Result<bool> {
    let conn = Connection::open("../data/data.db")?;
    conn.execute(
        "UPDATE User_Games SET is_favorite = CASE WHEN is_favorite = 0 THEN 1 ELSE 0 END
         WHERE user_id = ?1 AND app_id = ?2",
        params![user_id, app_id],
    )?;
    let new_val: i32 = conn.query_row(
        "SELECT is_favorite FROM User_Games WHERE user_id = ?1 AND app_id = ?2",
        params![user_id, app_id],
        |row| row.get(0),
    )?;
    Ok(new_val != 0)
}

pub fn toggle_hidden(user_id: i32, app_id: i64) -> Result<bool> {
    let conn = Connection::open("../data/data.db")?;
    conn.execute(
        "UPDATE User_Games SET is_hidden = CASE WHEN is_hidden = 0 THEN 1 ELSE 0 END
         WHERE user_id = ?1 AND app_id = ?2",
        params![user_id, app_id],
    )?;
    let new_val: i32 = conn.query_row(
        "SELECT is_hidden FROM User_Games WHERE user_id = ?1 AND app_id = ?2",
        params![user_id, app_id],
        |row| row.get(0),
    )?;
    Ok(new_val != 0)
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
    pub profile_picture: Option<String>,
}

pub fn get_all_users() -> Result<Vec<User>> {
    let conn = Connection::open("../data/data.db")?;

    let mut result = conn.prepare(
        "SELECT * from User"
    )?;

    
    let user_iter = result.query_map([], |row| {
        Ok(User {
            id: row.get(0)?,
            username: row.get(1)?,
            profile_picture: row.get::<_, Option<String>>(2)?,
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
            is_favorite: false,
            is_hidden: false,
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