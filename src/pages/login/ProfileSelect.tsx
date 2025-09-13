import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/UserContext';

function ProfileSelect() {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [userProfiles, setUserProfiles] = useState([
        'Cosmo',
        'Blur',
        'Kro',
        'Em',
    ]);

    useEffect(() => {
        // use this to call the rust backend to grab the user profiles
    }, []);

    const profileSelected = (profile: string, index: number) => {
        // Using hardcoded values for now
        setUser({
            id: index.toString(),
            username: profile,
            profile_picture: '',
        });

        navigate('/library');
    };

    const returnToOnboard = () => {
        navigate('/');
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
                {userProfiles.map((profile, index) => (
                    <button
                        id={profile}
                        className="bg-primary w-40 text-lg rounded-md cursor-pointer m-2 text-off-white hover:bg-accent-2"
                        onClick={() => profileSelected(profile, index)}
                    >
                        {profile}
                    </button>
                ))}
            </div>
            <div>
                <button
                    id="profileCreation"
                    className="bg-primary w-40 text-lg rounded-md cursor-pointer mt-10 m-2 text-off-white hover:bg-accent-2"
                    onClick={createProfile}
                >
                    Create a profile
                </button>
            </div>
            <div>
                <button
                    id="returnToOnboard"
                    className="bg-primary w-40 text-lg rounded-md cursor-pointer m-2 text-off-white hover:bg-accent-2"
                    onClick={returnToOnboard}
                >
                    Return to onboard
                </button>
            </div>
        </main>
    );
}

export default ProfileSelect;
