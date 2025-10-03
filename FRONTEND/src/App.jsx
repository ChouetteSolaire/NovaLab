import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AppHeader from "./components/AppHeader/AppHeader";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import Prediction from './components/Prediction/Prediction';
import LabLogPage from "./components/lablog/LabLogPage.jsx";
import API from "./api";  // Импорт axios-инстанса

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const axUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await API.get("/me");
                setUser(res.data);
            } catch (error) {
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };
        axUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <Router>
            <div className="app-container">
                <Navbar user={user} logout={logout} />
                <div className="main-content">
                    <AppHeader user={user} />
                    <main className="content">
                        <Routes>
                            <Route path="/" element={<h1>Главная страница</h1>} />
                            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
                            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
                            <Route path="/predict" element={<Prediction />} />
                            <Route path="/lablog" element={<LabLogPage />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}