mod database;
use std::fs;
use std::path::Path;
use rusqlite::{Result};
use crate::database::db::add_user_games;

#[tauri::command]
fn onboard_steam(steam_path: String) -> Result<Vec<database::db::Game>, String> {
    let path = Path::new(&steam_path);
    if !path.exists() {
        return Err(format!("Path does not exist: {}", steam_path));
    }

    let mut games = Vec::new();

    match fs::read_dir(path) {
        Ok(entries) => {
            for entry in entries.flatten() {
                let file_path = entry.path();
                if file_path.is_file() {
                    if let Some(ext) = file_path.extension() {
                        if ext == "acf" {
                            if let Ok(contents) = fs::read_to_string(&file_path) {
                                let mut app_id_str = String::new();
                                let mut name = String::new();
                                let mut install_dir = String::new();
                                let mut last_updated = String::new();
                                let mut last_played = String::new();
                                let mut last_owner = String::new();
                                let mut size_str = String::new();
                                let mut manifest = String::new();

                                for line in contents.lines() {
                                    let line = line.trim_start();
                                    if line.starts_with("\"appid\"") {
                                        app_id_str = line.split('"').nth(3).unwrap_or_default().to_string();
                                    }
                                    if line.starts_with("\"name\"") {
                                        name = line.split('"').nth(3).unwrap_or_default().to_string();
                                    }
                                    if line.starts_with("\"installdir\"") {
                                        install_dir = line.split('"').nth(3).unwrap_or_default().to_string();
                                    }
                                    if line.starts_with("\"LastUpdated\"") {
                                        last_updated = line.split('"').nth(3).unwrap_or_default().to_string();
                                    }
                                    if line.starts_with("\"LastPlayed\"") {
                                        last_played = line.split('"').nth(3).unwrap_or_default().to_string();
                                    }
                                    if line.starts_with("\"LastOwner\"") {
                                        last_owner = line.split('"').nth(3).unwrap_or_default().to_string();
                                    }
                                    if line.starts_with("\"SizeOnDisk\"") {
                                        size_str = line.split('"').nth(3).unwrap_or_default().to_string();
                                    }
                                }

                                manifest = "test".to_string();

                                if !name.is_empty() {
                                    let app_id: i64 = app_id_str.parse::<i64>().unwrap_or(0);
                                    let size: i64 = size_str.parse::<i64>().unwrap_or(0);

                                    let game = database::db::Game {
                                        app_id,
                                        name,
                                        install_dir,
                                        last_updated,
                                        last_played,
                                        last_owner,
                                        manifest,
                                        size,
                                    };

                                    database::db::insert_game(
                                        game.app_id,
                                        &game.name,
                                        &game.install_dir,
                                        &game.last_updated,
                                        &game.last_played,
                                        &game.last_owner,
                                        &game.manifest,
                                        game.size,
                                    ).map_err(|e| e.to_string())?;

                                    println!("{:?}", game);
                                    games.push(game);
                                }
                            }
                        }
                    }
                }
            }
        }
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    }

    Ok(games)
}

#[tauri::command]
fn tauri_create_user(username: String, profile_picture: Option<String>) -> Result<bool, String> {
    database::db::create_user(&username, profile_picture.as_deref())
        .map_err(|e| format!("Database error: {}", e))
}

#[tauri::command]
fn tauri_get_all_users() -> Result<Vec<database::db::User>, String> {
    database::db::get_all_users().map_err(|e| e.to_string())
}

#[tauri::command]
fn tauri_retrieve_user_games(user_id: i32) -> Result<Vec<crate::database::db::Game>, String> {
    match crate::database::db::retrieve_games(user_id) {
        Ok(games) => Ok(games),
        Err(e) => Err(format!("Failed to retrieve games: {}", e)),
    }
}

#[tauri::command]
fn tauri_retrieve_all_games() -> Result<Vec<crate::database::db::Game>, String> {
    match crate::database::db::get_all_games() {
        Ok(games) => Ok(games),
        Err(e) => Err(format!("Failed to retrieve games: {}", e)),
    }
}

#[tauri::command]
fn tauri_add_user_games(user_id: i32, game_ids: Vec<i32>) -> Result<(), String> {
    crate::database::db::add_user_games(user_id, &game_ids)
        .map_err(|e| format!("Failed to insert user games: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_conn = database::db::init_db().expect("failed to init database");

    tauri::Builder::default()
    .manage(db_conn)
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![onboard_steam, tauri_create_user, tauri_get_all_users, tauri_retrieve_user_games, tauri_retrieve_all_games, tauri_add_user_games])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
