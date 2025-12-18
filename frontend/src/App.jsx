import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import OutagesPage from './pages/OutagesPage';
import StatisticsPage from './pages/StatisticsPage';
import SubscribePage from './pages/SubscribePage';
import UnsubscribePage from './pages/UnsubscribePage';
import VerifyPage from './pages/VerifyPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/outages" element={<OutagesPage />} />
                        <Route path="/statistics" element={<StatisticsPage />} />
                        <Route path="/subscribe" element={<SubscribePage />} />
                        <Route path="/unsubscribe" element={<UnsubscribePage />} />
                        <Route path="/verify" element={<VerifyPage />} />
                    </Routes>
                </main>
                <Footer />
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        </Router>
    );
}

export default App;
