import React from 'react';

export default function LabLogList({ entries, onEdit, onDelete }) {
    if (!entries.length) return <div>Нет записей</div>;

    return (
        <table>
            <thead>
            <tr>
                <th>Дата</th>
                <th>Раствор</th>
                <th>Объём (мл)</th>
                <th>Комментарии</th>
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            {entries.map(entry => (
                <tr key={entry.id}>
                    <td>{new Date(entry.date).toLocaleString()}</td>
                    <td>{entry.solution_name}</td>
                    <td>{entry.volume_ml}</td>
                    <td>{entry.notes}</td>
                    <td>
                        <button onClick={() => onEdit(entry)}>✏️</button>
                        <button onClick={() => onDelete(entry.id)}>🗑️</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}