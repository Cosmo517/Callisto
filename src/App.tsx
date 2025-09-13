import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileSelect from './pages/login/ProfileSelect';
import ProfileCreate from './pages/login/ProfileCreate';
import { UserProvider } from './common/UserContext';
import Library from './pages/library/Library';

function App() {
    return (
        <UserProvider>
            <main className="w-full h-svh bg-background">
                <Router>
                    <Routes>
                        <Route path="/" element={<ProfileSelect />} />
                        <Route path="/create" element={<ProfileCreate />} />
                        <Route path="/library" element={<Library />} />
                    </Routes>
                </Router>
            </main>
        </UserProvider>
    );
}

export default App;
