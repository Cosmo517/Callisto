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
        if (selectedPage === 'Library' && page.page != 'Library') {
            navigate('/library');
            setPage({ page: 'Library' });
        } else if (
            selectedPage === 'Screenshots' &&
            page.page != 'Screenshots'
        ) {
            navigate('/screenshots');
            setPage({ page: 'Screenshots' });
        } else if (selectedPage === 'Statistics' && page.page != 'Statistics') {
            navigate('/statistics');
            setPage({ page: 'Statistics' });
        }
    };

    return (
        <div className="bg-navbar-color border-b-secondary flex h-18 w-full items-center border text-xl">
            <div className="flex flex-row gap-6">
                <button
                    className={clsx(
                        'ml-4 cursor-pointer underline-offset-8 hover:underline',
                        page.page === 'Library'
                            ? 'text-accent-1 underline underline-offset-8'
                            : 'text-off-white'
                    )}
                    onClick={() => navigateToPage('Library')}
                >
                    Library
                </button>
                <button
                    className={clsx(
                        'cursor-pointer underline-offset-8 hover:underline',
                        page.page === 'Screenshots'
                            ? 'text-accent-1 underline underline-offset-8'
                            : 'text-off-white'
                    )}
                    onClick={() => navigateToPage('Screenshots')}
                >
                    Screenshots
                </button>
                <button
                    className={clsx(
                        'cursor-pointer underline-offset-8 hover:underline',
                        page.page === 'Statistics'
                            ? 'text-accent-1 underline underline-offset-8'
                            : 'text-off-white'
                    )}
                    onClick={() => navigateToPage('Statistics')}
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
                        <button className="text-off-white hover:bg-accent-2 block w-full px-4 py-2 text-left">
                            Profile
                        </button>
                        <button className="text-off-white hover:bg-accent-2 block w-full px-4 py-2 text-left">
                            Settings
                        </button>
                        <button className="text-off-white hover:bg-accent-2 block w-full px-4 py-2 text-left">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
