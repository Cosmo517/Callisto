import { useNavigate } from 'react-router-dom';
import { usePage } from '../../common/PageContext';
import clsx from 'clsx';
import { useUser } from '../../common/UserContext';
import { useState } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const { user } = useUser();

    const { page, setPage } = usePage();
    const [open, setOpen] = useState(false);

    const navigateToPage = (selectedPage: string) => {
        if (selectedPage === 'library' && page.page != 'library') {
            navigate('/library');
            setPage({ page: 'library' });
        } else if (
            selectedPage === 'screenshots' &&
            page.page != 'screenshots'
        ) {
            navigate('/screenshots');
            setPage({ page: 'screenshots' });
        } else if (selectedPage === 'statistics' && page.page != 'statistics') {
            navigate('/statistics');
            setPage({ page: 'statistics' });
        }
    };

    const returnToProfileSelect = () => {
        navigate('/profiles');
    };

    const navigateToProfileSettings = () => {
        setPage({ page: 'profile_settings' });
        navigate('/profile_settings');
    };

    const navigateToSettings = () => {
        setPage({ page: 'settings' });
        navigate('/settings');
    };

    return (
        <div className="bg-navbar-color border-b-secondary flex h-18 w-full items-center border text-xl">
            <div className="flex flex-row gap-6">
                <button
                    className={clsx(
                        'ml-4 cursor-pointer underline-offset-8 hover:underline',
                        page.page === 'library'
                            ? 'text-accent-1 underline underline-offset-8'
                            : 'text-off-white'
                    )}
                    onClick={() => navigateToPage('library')}
                >
                    Library
                </button>
                <button
                    className={clsx(
                        'cursor-pointer underline-offset-8 hover:underline',
                        page.page === 'screenshots'
                            ? 'text-accent-1 underline underline-offset-8'
                            : 'text-off-white'
                    )}
                    onClick={() => navigateToPage('screenshots')}
                >
                    Screenshots
                </button>
                <button
                    className={clsx(
                        'cursor-pointer underline-offset-8 hover:underline',
                        page.page === 'statistics'
                            ? 'text-accent-1 underline underline-offset-8'
                            : 'text-off-white'
                    )}
                    onClick={() => navigateToPage('statistics')}
                >
                    Statistics
                </button>
            </div>
            <div className="relative ml-auto">
                <button
                    onClick={() => setOpen(!open)}
                    className="text-off-white hover:text-accent-1 mr-16 cursor-pointer"
                >
                    {user.username}
                </button>

                {open && (
                    <div className="bg-primary border-secondary absolute right-0 z-50 mt-2 w-48 rounded-md border shadow-lg">
                        <button
                            className="text-off-white hover:bg-accent-2 block w-full cursor-pointer px-4 py-2 text-left"
                            onClick={navigateToProfileSettings}
                        >
                            Profile
                        </button>
                        <button
                            className="text-off-white hover:bg-accent-2 block w-full cursor-pointer px-4 py-2 text-left"
                            onClick={navigateToSettings}
                        >
                            Settings
                        </button>
                        <button
                            className="text-off-white hover:bg-accent-2 block w-full cursor-pointer px-4 py-2 text-left"
                            onClick={returnToProfileSelect}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
