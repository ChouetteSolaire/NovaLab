import React, { useState } from 'react';
import API from './../../api'; // путь к твоему api.jsx, поправь если нужно
import PredictionHistory from '../PredictionHistory/PredictionHistory.jsx';
import Graphs from '../Graphs/Graphs.jsx'; // Новый компонент для графиков
import Ref from '../Graphs/Ref.jsx';
import './Prediction.css';

export default function Prediction() {
    const [model_name, setModelName] = useState('NaCl');
    const [conductivity_meter, setConductivity] = useState('');
    const [refractometr, setRefractometr] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [qualityScore, setQualityScore] = useState(null);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [historyVersion, setHistoryVersion] = useState(0);

    const validateForm = () => {
        const errors = {};
        if (!conductivity_meter || isNaN(conductivity_meter) || parseFloat(conductivity_meter) <= 0) {
            errors.conductivity_meter = 'Enter a valid number > 0';
        }
        if (!refractometr || isNaN(refractometr) || parseFloat(refractometr) <= 0) {
            errors.refractometr = 'Enter a valid number > 0';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const res = await API.post('/predict', {
                model_name,
                conductivity_meter: parseFloat(conductivity_meter),
                refractometr: parseFloat(refractometr),
            });
            setPrediction(res.data.predicted_concentration);
            setQualityScore(res.data.quality_score || null);
            setError('');
            setFieldErrors({});
            setHistoryVersion((v) => v + 1);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || err.response.data.message || 'Server error');
            } else {
                setError(`Network error: ${err.message}`);
            }
            setPrediction(null);
            setQualityScore(null);
        } finally {
            setIsLoading(false);
        }
    };

    const token = localStorage.getItem('token');

    return (
        <div className="page-container">
            {/* Левый блок — форма + графики */}
            <div className="main-content">
                {/* Форма расчёта (с выравниванием чуть выше центра за счёт margin-top) */}
                <div className="prediction">
                    <h2>Calculation of concentration</h2>
                    <form onSubmit={handleSubmit} noValidate>
                        <select
                            value={model_name}
                            onChange={(e) => setModelName(e.target.value)}
                        >
                            <option key="NaCl" value="NaCl">NaCl</option>
                            <option key="KCl" value="KCl">KCl</option>
                            <option key="Na2SO4" value="Na2SO4">Na2SO4</option>
                            <option key="KCrSO4" value="KCrSO4">KCrSO4</option>
                            <option key="CaCl2" value="CaCl2">CaCl2</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Conductivity Meter"
                            value={conductivity_meter}
                            onChange={(e) => setConductivity(e.target.value)}
                            required
                            aria-describedby="conductivityError"
                            aria-invalid={!!fieldErrors.conductivity_meter}
                        />
                        {fieldErrors.conductivity_meter && (
                            <p id="conductivityError" className="field-error">
                                {fieldErrors.conductivity_meter}
                            </p>
                        )}
                        <input
                            type="number"
                            step="0.000001"
                            placeholder="Refractometer"
                            value={refractometr}
                            onChange={(e) => setRefractometr(e.target.value)}
                            required
                            aria-describedby="refractometerError"
                            aria-invalid={!!fieldErrors.refractometr}
                        />
                        {fieldErrors.refractometr && (
                            <p id="refractometerError" className="field-error">
                                {fieldErrors.refractometr}
                            </p>
                        )}
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Calculate...' : 'Calculate'}
                        </button>
                    </form>

                    {prediction !== null && (
                        <div className="result">
                            <p>Calculated Concentration: {prediction.toFixed(4)}</p>
                            {qualityScore !== null && (
                                <p
                                    style={{
                                        color:
                                            qualityScore > 80
                                                ? 'green'
                                                : qualityScore > 50
                                                    ? 'orange'
                                                    : 'red',
                                    }}
                                >
                                    Quality Score: {qualityScore}%
                                    {qualityScore > 80
                                        ? ' (High)'
                                        : qualityScore > 50
                                            ? ' (Medium)'
                                            : ' (Low)'}
                                </p>
                            )}
                        </div>
                    )}

                    {error && <p className="error">{error}</p>}
                </div>
            </div>

            {/* Правый блок — история с фиксированной шириной */}
            <div className="history-sidebar">
                <PredictionHistory token={token} historyVersion={historyVersion} />
            </div>
            <Graphs
                modelName={model_name}
                userPoint={
                    prediction
                        ? {
                            conductivity_meter: parseFloat(conductivity_meter),
                            refractometr: parseFloat(refractometr),
                            concentration: prediction,
                        }
                        : null
                }
            />
            <Ref
                modelName={model_name}
                userPoint={
                    prediction
                        ? {
                            conductivity_meter: parseFloat(conductivity_meter),
                            refractometr: parseFloat(refractometr),
                            concentration: prediction,
                        }
                        : null
                }
            />
        </div>
        
    );
}