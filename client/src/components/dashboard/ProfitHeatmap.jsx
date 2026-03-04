import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, IndianRupee } from 'lucide-react';

const ProfitHeatmap = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="card rounded-2xl p-6 h-64 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <TrendingUp className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-500">No revenue data yet</p>
                <p className="text-xs text-slate-600">Run your first analysis to see profit potential</p>
            </div>
        );
    }

    // Group by crop and take the best revenue estimate per crop
    const cropMap = {};
    history.forEach(item => {
        const crop = item.prediction?.crop;
        const revenue = item.prediction?.estimatedRevenue || 0;
        const yieldVal = parseFloat(item.prediction?.yield) || 0;
        if (!cropMap[crop] || revenue > cropMap[crop].revenue) {
            cropMap[crop] = { crop, revenue, yield: yieldVal };
        }
    });

    const data = Object.values(cropMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 7); // Show top 7 crops max

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

    const getBarColor = (revenue) => {
        const pct = revenue / maxRevenue;
        if (pct > 0.75) return '#10b981'; // emerald — high
        if (pct > 0.45) return '#34d399'; // light emerald — medium-high
        if (pct > 0.25) return '#fbbf24'; // amber — medium
        return '#f87171';                  // rose — low
    };

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        const d = payload[0].payload;
        return (
            <div className="px-4 py-3 rounded-xl text-xs shadow-xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', color: 'var(--text-primary)' }}>
                <p className="font-black capitalize mb-1">{d.crop}</p>
                <p style={{ color: 'var(--text-muted)' }}>Revenue: <span className="font-bold text-emerald-400">${d.revenue?.toLocaleString()}</span></p>
                <p style={{ color: 'var(--text-muted)' }}>Yield: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{d.yield} T/Ha</span></p>
            </div>
        );
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-black text-slate-100">Revenue by Crop</h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Estimated profit potential from your analyses
                    </p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                    Profit View
                </span>
            </div>

            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                        <XAxis
                            type="number"
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
                        />
                        <YAxis
                            type="category"
                            dataKey="crop"
                            stroke="#475569"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            width={70}
                            tick={{ textTransform: 'capitalize', fontWeight: 700 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={getBarColor(entry.revenue)} />
                            ))}
                            <LabelList
                                dataKey="revenue"
                                position="right"
                                formatter={v => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`}
                                style={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 700 }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}>
                {[['#10b981', 'High'], ['#fbbf24', 'Medium'], ['#f87171', 'Low']].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                        {label}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProfitHeatmap;
