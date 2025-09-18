import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileSelect from './pages/login/ProfileSelect';
import ProfileCreate from './pages/login/ProfileCreate';
import { UserProvider } from './common/UserContext';
import Library from './pages/library/Library';
import OnboardSelect from './pages/onboard/OnboardSelect';
import { PageProvider } from './common/PageContext';
import Screenshots from './pages/screenshots/Screenshots';
import Statistics from './pages/statistics/Statistics';
import ProfileSettings from './pages/profile/ProfileSettings';
import Settings from './pages/settings/Settings';

function App() {
    return (
        <UserProvider>
            <PageProvider>
                <main className="bg-background h-svh w-full">
                    <Router>
                        <Routes>
                            <Route path="/" element={<OnboardSelect />} />
                            <Route
                                path="/profiles"
                                element={<ProfileSelect />}
                            />
                            <Route path="/create" element={<ProfileCreate />} />
                            <Route path="/library" element={<Library />} />
                            <Route
                                path="/screenshots"
                                element={<Screenshots />}
                            />
                            <Route
                                path="/statistics"
                                element={<Statistics />}
                            />
                            <Route
                                path="/profile_settings"
                                element={<ProfileSettings />}
                            />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </Router>
                </main>
            </PageProvider>
        </UserProvider>
    );
}

export default App;
