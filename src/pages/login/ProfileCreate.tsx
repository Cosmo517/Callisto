import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileCreate() {
    const navigate = useNavigate();

    useEffect(() => {
        // use this to call the rust backend to grab the user profiles
        // used to prevent the user from creating a profile with an already
        // used name
    }, []);

    const createProfile = () => {
        // use this to create a profile
    };

    const returnToLogin = () => {
        navigate('/');
    };

    return (
        <main className="w-full grid justify-items-center">
            <div className="text-off-white text-xl p-5">
                Create your user profile
            </div>
            <form className="grid grid-cols-1 justify-items-center">
                <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    placeholder="Username"
                    className="bg-primary border border-r-1 border-secondary text-off-white pl-1 placeholder:text-secondary focus:outline-none focus:border-accent-1 focus:ring-0 transition-colors"
                />
                <button
                    id="profileCreation"
                    className="bg-primary w-40 text-lg rounded-md cursor-pointer mt-5 text-off-white hover:bg-accent-2"
                    onClick={() => console.log('test')}
                >
                    Create
                </button>
            </form>

            <button
                id="profileCreation"
                className="bg-primary w-40 text-lg rounded-md cursor-pointer mt-20 text-off-white hover:bg-accent-2"
                onClick={returnToLogin}
            >
                Return to login
            </button>
        </main>
    );
}

export default ProfileCreate;
