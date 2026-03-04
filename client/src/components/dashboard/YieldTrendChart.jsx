import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const YieldTrendChart = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="card" style={{ padding: '1.5rem', minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
                <div style={{ fontSize: '2.5rem' }}>📊</div>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-muted)' }}>No yield data yet</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                    Run your first crop analysis to see your yield history
                </p>
            </div>
        );
    }

    const chartData = history
        .map(item => ({
            date: new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            yield: parseFloat(item.prediction.yield) || 0,
            crop: item.prediction.crop,
        }))
        .reverse();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)',
                    borderRadius: '0.75rem', padding: '0.75rem 1rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#34d399' }}>{payload[0].value} T/Ha</p>
                    {payload[0].payload?.crop && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: 2 }}>
                            {payload[0].payload.crop}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card" style={{ padding: '1.5rem', width: '100%' }}>
            {/* Top glow */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 100,
                background: 'radial-gradient(ellipse at 30% 0%, rgba(16,185,129,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '0.625rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp style={{ width: 16, height: 16, color: '#34d399' }} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Yield Trend</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Tonnes/Ha across analyses</p>
                        </div>
                    </div>
                    <span style={{
                        padding: '0.2rem 0.625rem', borderRadius: 99, fontSize: '0.65rem', fontWeight: 800,
                        background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>Live</span>
                </div>

                <div style={{ height: 220, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="date" stroke="#334155" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} />
                            <YAxis stroke="#334155" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}T`} fontWeight={600} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 1 }} />
                            <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#yieldGrad)"
                                dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: 'var(--bg-base)' }}
                                activeDot={{ r: 6, fill: '#34d399', stroke: 'var(--bg-base)', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default YieldTrendChart;
