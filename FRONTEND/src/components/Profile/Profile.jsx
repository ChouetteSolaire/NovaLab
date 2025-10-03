import React, { useState } from "react";
import "./Profile.css";
import "../Navbar/Navbar.css"
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import API from './../../api';

export default function Profile({ user, onHistoryCleared }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    };

    const handleClearHistory = async () => {
        console.log("handleClearHistory вызван");
        if (!window.confirm("Are you sure you want to clear your settlement history?")) {
            console.log("The user has canceled the cleanup");
            return;
        }

        setLoading(true);
        try {
            console.log("Отправляем запрос на очистку");
            await API.delete("/history");
            console.log("История очищена успешно");
            alert("История успешно очищена");
            if (onHistoryCleared) onHistoryCleared();
        } catch (error) {
            console.error("Ошибка при очистке истории:", error);
            alert("Ошибка при очистке истории");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-info">
                <span className="profile-name">{user?.username || "Гость"}</span>
                <img
                    className="profile-avatar"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "Guest")}`}
                    alt="avatar"
                />
            </div>

            <button
                onClick={handleLogout}
                className="action-button logout-button"
                title="Log out"
                disabled={loading}
            >
                <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Log out
            </button>

            <button
                onClick={handleClearHistory}
                className="action-button logout-button"
                title="Clear calculation history"
                disabled={loading}
            >
                <FontAwesomeIcon icon={faTrashAlt} ClassName="navbar-list a" />
                {loading ? "Clear..." : "Clear calculation history"}
            </button>
        </div>
    );
}