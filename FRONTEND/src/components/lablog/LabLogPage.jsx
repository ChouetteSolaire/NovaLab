import React, { useEffect, useState } from 'react';
import LabLogList from './LabLogList';
import LabLogForm from './LabLogForm';
import { getLabLog, createLabLogEntry, updateLabLogEntry, deleteLabLogEntry } from './lablogAPI.jsx';

export default function LabLogPage() {
    const [entries, setEntries] = useState([]);
    const [editingEntry, setEditingEntry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        setLoading(true);
        try {
            const res = await getLabLog();
            setEntries(res.data);
        } catch (error) {
            alert('Ошибка загрузки журнала');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        try {
            if (editingEntry) {
                await updateLabLogEntry(editingEntry.id, data);
            } else {
                await createLabLogEntry(data);
            }
            setEditingEntry(null);
            loadEntries();
        } catch {
            alert('Ошибка сохранения записи');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить запись?')) {
            try {
                await deleteLabLogEntry(id);
                loadEntries();
            } catch {
                alert('Ошибка удаления записи');
            }
        }
    };

    return (
        <div>
            <h2>Лабораторный журнал</h2>
            <LabLogForm
                entry={editingEntry}
                onSave={handleSave}
                onCancel={() => setEditingEntry(null)}
            />
            {loading ? <p>Загрузка...</p> : <LabLogList entries={entries} onEdit={setEditingEntry} onDelete={handleDelete} />}
        </div>
    );
}