import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { motion } from 'framer-motion';

const YieldTrendChart = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="card rounded-2xl p-6 h-64 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <LineChart className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-500">No yield data yet</p>
                <p className="text-xs text-slate-600">Run your first analysis to populate this chart</p>
            </div>
        );
    }

    // Format data for Recharts
    const chartData = history
        .map((item) => ({
            date: new Date(item.createdAt).toLocaleDateString(),
            yield: parseFloat(item.prediction.yield) || 0,
            crop: item.prediction.crop,
        }))
        .reverse(); // Show oldest to newest

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 w-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-black text-slate-100">Yield Trends</h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Historical yield (T/Ha)</p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--emerald-400)', border: '1px solid rgba(16,185,129,0.15)' }}>Live</span>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}T`} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: 12 }} itemStyle={{ color: '#34d399' }} />
                        <Area
                            type="monotone"
                            dataKey="yield"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorYield)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default YieldTrendChart;
