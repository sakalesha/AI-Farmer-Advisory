import React from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

const ProfitHeatmap = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="card rounded-2xl p-6 h-64 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <ScatterChart className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-500">No profit data yet</p>
                <p className="text-xs text-slate-600">Analyse more crops to see correlations</p>
            </div>
        );
    }

    // Format data for Scatter Chart (Yield vs Revenue)
    const data = history.map((item) => ({
        yield: parseFloat(item.prediction.yield) || 0,
        revenue: item.prediction.estimatedRevenue || 0,
        crop: item.prediction.crop,
        z: item.prediction.estimatedRevenue / (parseFloat(item.prediction.yield) || 1) // Profit density
    }));

    const getColor = (revenue) => {
        if (revenue > 50000) return '#10b981'; // Emerald
        if (revenue > 20000) return '#34d399'; // Green
        if (revenue > 10000) return '#fbbf24'; // Amber
        return '#f87171'; // Red
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 w-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-black text-slate-100">Profit Analysis</h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Yield vs. Revenue correlation</p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.08)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.15)' }}>Financials</span>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis type="number" dataKey="yield" name="Yield" unit="T" stroke="#475569" fontSize={11} />
                        <YAxis type="number" dataKey="revenue" name="Revenue" unit="$" stroke="#475569" fontSize={11} />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: 12 }} />
                        <Scatter name="Crops" data={data}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.revenue)} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {[['#10b981', 'High Profit'], ['#fbbf24', 'Moderate'], ['#f87171', 'Low/Loss']].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />{label}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProfitHeatmap;
