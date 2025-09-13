import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileSelect() {
    const navigate = useNavigate();

    const [userProfiles, setUserProfiles] = useState([
        'Cosmo',
        'Blur',
        'Kro',
        'Em',
    ]);

    useEffect(() => {
        // use this to call the rust backend to grab the user profiles
    }, []);

    const profileSelected = () => {
        // use this when a profile is selected
    };

    const createProfile = () => {
        // use this to create a profile
        navigate('/create');
    };

    return (
        <main className="w-full grid justify-items-center">
            <div className="text-off-white text-xl p-5">
                Select a User Profile
            </div>
            <div className="grid grid-cols-1">
                {userProfiles.map((profile, _) => (
                    <button
                        id={profile}
                        className="bg-primary w-40 text-lg rounded-md cursor-pointer m-2 text-off-white hover:bg-accent-2"
                        onClick={() => console.log('test')}
                    >
                        {profile}
                    </button>
                ))}
            </div>
            <div>
                <button
                    id="profileCreation"
                    className="bg-primary w-40 text-lg rounded-md cursor-pointer mt-20 text-off-white hover:bg-accent-2"
                    onClick={createProfile}
                >
                    Create a profile
                </button>
            </div>
        </main>
    );
}

export default ProfileSelect;
