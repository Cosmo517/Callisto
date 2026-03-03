import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileSelect from './pages/login/ProfileSelect';
import ProfileCreate from './pages/login/ProfileCreate';
import { UserProvider } from './common/UserContext';
import Library from './pages/library/Library';
import OnboardSelect from './pages/onboard/OnboardSelect';
import Startup from './pages/Startup';
import { PageProvider } from './common/PageContext';
import ProfileSettings from './pages/profile/ProfileSettings';
import Settings from './pages/settings/Settings';
import { SettingsProvider } from './common/SettingsContext';

function App() {
    return (
        <SettingsProvider>
            <UserProvider>
                <PageProvider>
                    <main className="bg-background h-svh w-full">
                        <Router>
                            <Routes>
                                <Route path="/" element={<Startup />} />
                                <Route path="/onboard" element={<OnboardSelect />} />
                                <Route path="/profiles" element={<ProfileSelect />} />
                                <Route path="/create" element={<ProfileCreate />} />
                                <Route path="/library" element={<Library />} />
                                <Route path="/profile_settings" element={<ProfileSettings />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </Router>
                    </main>
                </PageProvider>
            </UserProvider>
        </SettingsProvider>
    );
}

export default App;
