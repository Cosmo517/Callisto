import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/UserContext';
import { useState } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-navbar-color border-b border-secondary fixed flex h-14 w-full items-center px-4 z-50">
            {/* App name / home */}
            <button
                onClick={() => navigate('/library')}
                className="text-off-white font-bold text-lg tracking-wide cursor-pointer hover:text-accent-1 transition-colors"
            >
                Callisto
            </button>

            {/* User menu */}
            <div className="relative ml-auto">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 text-off-white hover:text-accent-1 cursor-pointer transition-colors"
                >
                    <div className="bg-primary w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold select-none">
                        {user.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-sm">{user.username}</span>
                </button>

                {menuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className="bg-primary border border-secondary absolute right-0 z-50 mt-2 w-44 rounded-md shadow-lg overflow-hidden">
                            <button
                                className="text-off-white hover:bg-accent-2/40 block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors"
                                onClick={() => { setMenuOpen(false); navigate('/profile_settings'); }}
                            >
                                Profile
                            </button>
                            <button
                                className="text-off-white hover:bg-accent-2/40 block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors"
                                onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                            >
                                Settings
                            </button>
                            <div className="border-t border-secondary" />
                            <button
                                className="text-accent-1 hover:bg-accent-2/40 block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors"
                                onClick={() => { setMenuOpen(false); navigate('/profiles'); }}
                            >
                                Sign out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;
