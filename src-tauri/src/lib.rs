mod database;
use std::fs;
use std::path::Path;
use serde::Serialize;

#[derive(Serialize)]
#[derive(Debug)]
struct Game {
    app_id: String,
    name: String,
    install_dir: String,
    last_updated: String,
    last_played: String,
    last_owner: String,
    manifest: Option<String>,
    size: String,
}

#[tauri::command]
fn onboard_steam(steam_path: String) -> Result<Vec<Game>, String> {
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
                                let mut app_id = String::new();
                                let mut name = String::new();
                                let mut install_dir = String::new();
                                let mut last_updated = String::new();
                                let mut last_played = String::new();
                                let mut last_owner = String::new();
                                let mut size = String::new();

                                for line in contents.lines() {
                                    let line = line.trim_start();
                                    if line.starts_with("\"appid\"") {
                                        app_id = line.split('"').nth(3).unwrap_or_default().to_string();
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
                                        size = line.split('"').nth(3).unwrap_or_default().to_string();
                                    }
                                }

                                if !name.is_empty() {
                                    let game = Game {
                                        app_id,
                                        name,
                                        install_dir,
                                        last_updated,
                                        last_played,
                                        last_owner,
                                        manifest: Some(file_path.to_string_lossy().to_string()),
                                        size,
                                    };
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_conn = database::db::init_db().expect("failed to init database");

    tauri::Builder::default()
    .manage(db_conn)
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![onboard_steam])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
