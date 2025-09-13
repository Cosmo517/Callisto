import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useNavigate } from 'react-router-dom';

function OnboardSelect() {
    const navigate = useNavigate();

    const [onboardOptions, setOnboardOption] = useState(['Steam']);

    async function selectSteamFolderAndOnboard() {
        const result = await open({
            title: 'Select your steamapps folder location',
            multiple: false,
            directory: true,
        });

        if (!result) {
            console.log('No folder selected');
            return;
        }

        // result might be an array on some platforms
        const steamPath = Array.isArray(result) ? result[0] : result;
        console.log('Selected folder:', steamPath);
        await invoke('onboard_steam', { steamPath: steamPath });
    }

    const selectProfile = () => {
        navigate('/profiles');
    };

    return (
        <main className="w-full grid justify-items-center">
            <div className="text-off-white text-xl p-5">
                Select a game library to import
            </div>
            <div className="grid grid-cols-1">
                {onboardOptions.map((option, _) => (
                    <button
                        id={option}
                        className="bg-primary w-40 text-lg rounded-md cursor-pointer m-2 text-off-white hover:bg-accent-2"
                        onClick={selectSteamFolderAndOnboard}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <div>
                <button
                    id="profileSelect"
                    className="bg-primary w-40 text-lg rounded-md cursor-pointer mt-20 text-off-white hover:bg-accent-2"
                    onClick={selectProfile}
                >
                    Login to your profile
                </button>
            </div>
        </main>
    );
}

export default OnboardSelect;
