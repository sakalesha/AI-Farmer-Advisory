import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const SoilTrendChart = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="card" style={{ padding: '1.5rem', minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
                <div style={{ fontSize: '2.5rem' }}>🌱</div>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-muted)' }}>No soil data yet</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                    Run your first crop analysis to see your soil health over time
                </p>
            </div>
        );
    }

    const chartData = history
        .map(item => ({
            date: new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            N: item.inputs.N,
            P: item.inputs.P,
            K: item.inputs.K,
            pH: item.inputs.ph,
            name: item.fieldName || 'Field'
        }))
        .reverse();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card" style={{ padding: '1.5rem', width: '100%' }}>
            
            {/* Top glow */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 100,
                background: 'radial-gradient(ellipse at 70% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '0.625rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity style={{ width: 16, height: 16, color: '#3b82f6' }} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Soil Health Trends</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>N, P, K & pH levels across history</p>
                    </div>
                </div>

                <div style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="date" stroke="#334155" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} />
                            
                            <YAxis yAxisId="left" stroke="#334155" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} tickFormatter={(v) => `${v}`} />
                            <YAxis yAxisId="right" orientation="right" stroke="#334155" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} domain={[0, 14]} />
                            
                            <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} itemStyle={{ fontWeight: 800 }} />
                            <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '1rem', fontWeight: 600, color: 'var(--text-muted)' }} />
                            
                            <Line yAxisId="left" type="monotone" dataKey="N" name="Nitrogen (N)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', stroke: 'var(--bg-base)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line yAxisId="left" type="monotone" dataKey="P" name="Phosphorus (P)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', stroke: 'var(--bg-base)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line yAxisId="left" type="monotone" dataKey="K" name="Potassium (K)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', stroke: 'var(--bg-base)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line yAxisId="right" type="monotone" dataKey="pH" name="Soil pH" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#f59e0b', stroke: 'var(--bg-base)', strokeWidth: 1 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default SoilTrendChart;
