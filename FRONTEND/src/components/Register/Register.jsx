import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './../../api';  // Путь к api.jsx
import './Register.css';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await API.post('/register', form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка регистрации');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Регистрация</h2>

            <div className="form-group">
                <label htmlFor="username">Имя пользователя</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                />
            </div>

            <button type="submit">Зарегистрироваться</button>

            {error && <p className="error">{error}</p>}
        </form>
    );
}