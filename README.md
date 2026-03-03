# Callisto

Your entire game collection, one place. Callisto pulls in your Steam library and gives you a clean, fast interface to browse your games, track what you've been playing, and keep things organized — without ever opening Steam.

## Features

- **One-click import** — auto-detects your Steam library or let you point to it manually
- **Rich game details** — descriptions, genres, developer info, and release dates fetched automatically
- **Patch history** — recent updates for each game pulled straight from Steam
- **Favorites & hidden games** — surface the games you love, tuck away the ones you don't
- **Multiple profiles** — switch between accounts with optional auto-login
- **Works offline** — everything is cached locally after the first load

## Prerequisites

### Windows

1. **Node.js** (v18+) — https://nodejs.org
2. **Rust** — https://rustup.rs
3. **WebView2** — pre-installed on Windows 10/11. If missing: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### Linux

1. **Node.js** (v18+) — https://nodejs.org or your package manager
2. **Rust:**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source "$HOME/.cargo/env"
   ```
3. **System dependencies:**
   - **Arch / CachyOS / Manjaro:** `sudo pacman -S webkit2gtk-4.1 gtk3 librsvg base-devel`
   - **Ubuntu / Debian:** `sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev librsvg2-dev build-essential`
   - **Fedora:** `sudo dnf install webkit2gtk4.1-devel gtk3-devel librsvg2-devel`

## Getting Started

```bash
git clone https://github.com/Cosmo517/Callisto.git
cd Callisto
npm install
npm run tauri dev
```

The first run compiles the Rust backend and may take a few minutes. Subsequent starts are fast.

## Building

```bash
npm run tauri build
```

Installer and binary output to `src-tauri/target/release/`.

## Contributing

Pull requests are welcome. For larger changes, open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)
