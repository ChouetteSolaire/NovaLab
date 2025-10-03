import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './../../api';  // Путь к api.jsx
import './Login.css';

export default function Login({ setUser }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await API.post('/login', form);
            localStorage.setItem('token', res.data.access_token);
            const userRes = await API.get('/me', {
                headers: { Authorization: `Bearer ${res.data.access_token}` }
            });
            setUser(userRes.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка входа');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Вход</h2>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="username"
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
                    autoComplete="current-password"
                />
            </div>

            <button type="submit">Войти</button>

            {error && <p className="error">{error}</p>}
        </form>
    );
}