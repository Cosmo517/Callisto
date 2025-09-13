import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileSelect from './pages/login/ProfileSelect';
import ProfileCreate from './pages/login/ProfileCreate';

function App() {
    return (
        <main className="w-full h-svh bg-background">
            <Router>
                <Routes>
                    <Route path="/" element={<ProfileSelect />} />
                    <Route path="/create" element={<ProfileCreate />} />
                </Routes>
            </Router>
        </main>
    );
}

export default App;
