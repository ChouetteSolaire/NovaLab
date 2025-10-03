import React, { useEffect, useState } from 'react';

const PredictionHistory = ({ token, historyVersion }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/history', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Ошибка: likes ${response.statusText}`);
            }
            const data = await response.json();
            setHistory(data.history);
        } catch (eer) {
            setError(eer.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchHistory();
        } else {
            setHistory([]);
        }
    }, [token, historyVersion]);

    if (!token) {
        return <div>Please log in to see the calculation history.</div>;
    }

    return (
        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            <h3>Settlement history</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && history.length === 0 && <p>The story is empty.</p>}
            <ul>
                {history.map((item) => (
                    <li key={item.id} style={{ marginBottom: '10px' }}>
                        <b>Model:</b> {item.model_name} <br />
                        <b>Conductivity:</b> {item.conductivity_meter} <br />
                        <b>Refractometer:</b> {item.refractometr} <br />
                        <b>Concentration:</b> {item.predicted_concentration.toFixed(4)} <br />
                        <small>{new Date(item.timestamp).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PredictionHistory;