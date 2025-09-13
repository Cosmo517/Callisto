import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/UserContext';
import Navbar from '../common/Navbar';

function Library() {
    const navigate = useNavigate();
    const { user } = useUser();

    const returnToProfileSelect = () => {
        navigate('/profiles');
    };

    return (
        <div className="w-full h-full">
            <Navbar />
            <div className="text-accent-1">
                Welcome {user.username} to your library
            </div>
            <button
                id="returnToProfileSelect"
                className="bg-primary w-40 text-lg rounded-md cursor-pointer m-2 text-off-white hover:bg-accent-2"
                onClick={returnToProfileSelect}
            >
                Return to Profile Select
            </button>
        </div>
    );
}

export default Library;
