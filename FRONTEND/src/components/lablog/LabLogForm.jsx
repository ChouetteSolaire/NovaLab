import React, { useEffect, useState } from 'react';

export default function LabLogForm({ entry, onSave, onCancel }) {
    const [form, setForm] = useState({
        date: '',
        solution_name: '',
        volume_ml: '',
        notes: '',
    });

    useEffect(() => {
        if (entry) {
            setForm({
                date: entry.date ? entry.date.slice(0, 16) : '',
                solution_name: entry.solution_name || '',
                volume_ml: entry.volume_ml || '',
                notes: entry.notes || '',
            });
        } else {
            setForm({ date: '', solution_name: '', volume_ml: '', notes: '' });
        }
    }, [entry]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSave({
            ...form,
            volume_ml: parseFloat(form.volume_ml),
            date: new Date(form.date).toISOString(),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Дата и время:
                <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
            </label>
            <label>
                Название раствора:
                <input type="text" name="solution_name" value={form.solution_name} onChange={handleChange} required />
            </label>
            <label>
                Объём (мл):
                <input type="number" name="volume_ml" value={form.volume_ml} min="0" step="0.01" onChange={handleChange} required />
            </label>
            <label>
                Комментарии:
                <textarea name="notes" value={form.notes} onChange={handleChange} />
            </label>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onCancel}>Отмена</button>
        </form>
    );
}