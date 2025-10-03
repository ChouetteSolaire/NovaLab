import { Link, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faKey, faPenNib, faMagic } from '@fortawesome/free-solid-svg-icons'; // Добавил иконку для Logout
import './Navbar.css';

export default function Navbar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    // Проверяем, авторизован ли пользователь (по токену)
    const isAuthenticated = localStorage.getItem('token') !== null;

    return (
        <nav className="navbar">
            <div className="navbar-header">
                <h2 className="navbar-logo">NovaLab V4</h2>
            </div>
            <ul className="navbar-list">
                <li className={isActive('/') ? 'active' : ''}>
                    <Link to="/">
                        <FontAwesomeIcon icon={faHome} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Home
                    </Link>
                </li>
                <li className={isActive('/profile') ? 'active' : ''}>
                    <Link to="/profile">
                        <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Profile
                    </Link>
                </li>
                {/* Показывать только если НЕ авторизован */}
                {!isAuthenticated && (
                    <>
                        <li className={isActive('/login') ? 'active' : ''}>
                            <Link to="/login">
                                <FontAwesomeIcon icon={faKey} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                Login
                            </Link>
                        </li>
                        <li className={isActive('/register') ? 'active' : ''}>
                            <Link to="/register">
                                <FontAwesomeIcon icon={faPenNib} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                Register
                            </Link>
                        </li>
                    </>
                )}
                <li className={isActive('/predict') ? 'active' : ''}>
                    <Link to="/predict">
                        <FontAwesomeIcon icon={faMagic} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Solution
                    </Link>
                </li>
                <li className={isActive('/lablog') ? 'active' : ''}>
                    <Link to="/lablog">
                        <FontAwesomeIcon icon={faMagic} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Lablog
                    </Link>
                </li>
            </ul>
        </nav>
    );
}