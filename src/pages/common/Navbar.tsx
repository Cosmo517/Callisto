import { useNavigate } from 'react-router-dom';
import { usePage } from '../../common/PageContext';
import clsx from 'clsx';

function Navbar() {
    const navigate = useNavigate();

    const { page, setPage } = usePage();

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
        <div className="w-full h-18 bg-navbar-color border border-b-secondary flex flex-row items-center text-xl gap-6">
            <button
                className={clsx(
                    'cursor-pointer ml-4 hover:underline underline-offset-8',
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
                    'cursor-pointer hover:underline underline-offset-8',
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
                    'cursor-pointer hover:underline underline-offset-8',
                    page.page === 'Statistics'
                        ? 'text-accent-1 underline underline-offset-8'
                        : 'text-off-white'
                )}
                onClick={() => navigateToPage('Statistics')}
            >
                Statistics
            </button>
        </div>
    );
}

export default Navbar;
