use serde::Serialize;
use crate::database::db::{self, GameMetadata, NewsItem};

#[derive(Debug, Serialize)]
pub struct GameDetails {
    pub metadata: Option<GameMetadata>,
    pub news: Vec<NewsItem>,
}

/// Strip HTML/BBCode tags from a string for plain text display.
fn strip_tags(s: &str) -> String {
    let mut out = String::new();
    let mut in_tag = false;
    for c in s.chars() {
        match c {
            '<' | '[' => in_tag = true,
            '>' | ']' => in_tag = false,
            _ if !in_tag => out.push(c),
            _ => {}
        }
    }
    // Collapse whitespace
    out.split_whitespace().collect::<Vec<_>>().join(" ")
}

pub async fn fetch_details(app_id: i64) -> Result<GameDetails, String> {
    let metadata = fetch_metadata(app_id).await.ok();
    let news = fetch_news(app_id).await.unwrap_or_default();
    Ok(GameDetails { metadata, news })
}

async fn fetch_metadata(app_id: i64) -> Result<GameMetadata, String> {
    if let Ok(Some(cached)) = db::get_cached_metadata(app_id) {
        return Ok(cached);
    }

    let url = format!(
        "https://store.steampowered.com/api/appdetails?appids={}&l=english",
        app_id
    );

    let json: serde_json::Value = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    let entry = &json[app_id.to_string()];
    if !entry["success"].as_bool().unwrap_or(false) {
        return Err(format!("No store data for app {}", app_id));
    }

    let d = &entry["data"];
    let metadata = GameMetadata {
        app_id,
        short_description: d["short_description"].as_str().unwrap_or("").to_string(),
        developer: d["developers"]
            .as_array()
            .and_then(|a| a.first())
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        publisher: d["publishers"]
            .as_array()
            .and_then(|a| a.first())
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        release_date: d["release_date"]["date"].as_str().unwrap_or("").to_string(),
        genres: d["genres"]
            .as_array()
            .map(|arr| {
                arr.iter()
                    .filter_map(|g| g["description"].as_str())
                    .collect::<Vec<_>>()
                    .join(", ")
            })
            .unwrap_or_default(),
    };

    let _ = db::save_metadata(&metadata);
    Ok(metadata)
}

async fn fetch_news(app_id: i64) -> Result<Vec<NewsItem>, String> {
    if let Ok(items) = db::get_cached_news(app_id) {
        if !items.is_empty() {
            return Ok(items);
        }
    }

    let url = format!(
        "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid={}&count=5&maxlength=600",
        app_id
    );

    let json: serde_json::Value = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    let items: Vec<NewsItem> = json["appnews"]["newsitems"]
        .as_array()
        .unwrap_or(&vec![])
        .iter()
        .map(|item| NewsItem {
            gid: item["gid"].as_str().unwrap_or("").to_string(),
            title: item["title"].as_str().unwrap_or("").to_string(),
            url: item["url"].as_str().unwrap_or("").to_string(),
            contents: strip_tags(item["contents"].as_str().unwrap_or("")),
            date: item["date"].as_i64().unwrap_or(0),
        })
        .collect();

    let _ = db::save_news(app_id, &items);
    Ok(items)
}
