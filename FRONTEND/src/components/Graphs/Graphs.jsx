import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import API from './../../api';
import './Graphs.css';

export default function Ref({ modelName, userPoint, resetTrigger }) {
    const [datasets, setDatasets] = useState(null);
    const [conductivityData, setConductivityData] = useState([]);
    const [refractometerData, setRefractometerData] = useState([]);

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                const res = await API.get(`/datasets/${modelName}`);
                setDatasets(res.data);
                // Подготовка данных для графиков
                setConductivityData(res.data.map(d => ({ ...d, name: d.conductivity_meter })));
                setRefractometerData(res.data.map(d => ({ ...d, name: d.refractometr })));
            } catch (err) {
                console.error('Error fetching dataset:', err);
            }
        };
        if (modelName) fetchDataset();
    }, [modelName, resetTrigger]);

    return (
        <div className="graphs-container">
            <div className="graph-wrapper">
                <h3 className="graph-title">Conductivity vs Concentration</h3>
                <ScatterChart width={400} height={300}>
                    <XAxis type="number" dataKey="conductivity_meter" name="Conductivity" />
                    <YAxis type="number" dataKey="concentration" name="Concentration" />
                    <Scatter name="Training Data" data={conductivityData} fill="#8884d8" />
                    <Scatter name="Your Point" data={userPoint ? [userPoint] : []} fill="#ff7300" />
                    <Tooltip />
                </ScatterChart>
            </div>
        </div>
    );
}