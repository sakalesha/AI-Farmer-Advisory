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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-64 flex items-center justify-center">
                <p className="text-white/60">No historical data available for trends.</p>
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
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Yield Trends</h3>
                    <p className="text-white/60 text-sm">Historical yield performance (T/Ha)</p>
                </div>
                <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                    <span className="text-emerald-400 text-xs font-semibold">Live Data</span>
                </div>
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#ffffff60"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#ffffff60"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}T`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #ffffff20',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#10b981' }}
                        />
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
