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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-64 flex items-center justify-center">
                <p className="text-white/60">No data available for profit analysis.</p>
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
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Profit Analysis</h3>
                    <p className="text-white/60 text-sm">Yield vs. Estimated Revenue Correlation</p>
                </div>
                <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-xs font-semibold">Financials</span>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            type="number"
                            dataKey="yield"
                            name="Yield"
                            unit="T"
                            stroke="#ffffff60"
                            fontSize={12}
                        />
                        <YAxis
                            type="number"
                            dataKey="revenue"
                            name="Revenue"
                            unit="$"
                            stroke="#ffffff60"
                            fontSize={12}
                        />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #ffffff20',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Scatter name="Crops" data={data}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.revenue)} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-[10px] text-white/40">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> High Profit
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div> Moderate
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Low/Loss
                </div>
            </div>
        </motion.div>
    );
};

export default ProfitHeatmap;
