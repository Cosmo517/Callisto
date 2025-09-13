mod database;
use std::fs;
use std::path::Path;

#[tauri::command]
fn onboard_steam(steam_path: String) {
    let path = Path::new(&steam_path);
    if !path.exists() {
        eprintln!("Path does not exist: {}", steam_path);
        return;
    }

    match fs::read_dir(path) {
        Ok(entries) => {
            for entry in entries.flatten() {
                let file_path = entry.path();
                if file_path.is_file() {
                    if let Some(ext) = file_path.extension() {
                        if ext == "acf" {
                            if let Ok(contents) = fs::read_to_string(&file_path) {
                                for line in contents.lines() {
                                    if line.trim_start().starts_with("\"name\"") {
                                        // line looks like: "name"  "Game Title"
                                        let parts: Vec<&str> = line.split('"').collect();
                                        if parts.len() >= 4 {
                                            println!("{}", parts[3]);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        Err(e) => eprintln!("Failed to read directory: {}", e),
    }
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
