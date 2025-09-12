import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

function App() {
    const [greetMsg, setGreetMsg] = useState('');
    const [name, setName] = useState('');

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke('greet', { name }));
    }

    return <main className="w-full h-dvh bg-slate-800"></main>;
}

export default App;
