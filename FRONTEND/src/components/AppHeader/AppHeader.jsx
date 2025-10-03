import React from "react";
import Profile from "../Profile/Profile";
import "./AppHeader.css";

export default function AppHeader({ user }) {
    return (
        <header className="app-header">
                <div className="profile-info">
                    <span className="profile-name">{user?.username || "Гость"}</span>
                    <img
                        className="profile-avatar"
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.username || "Guest"
                        )}`}
                        alt="avatar"
                    />
                </div>
        </header>
    );
}