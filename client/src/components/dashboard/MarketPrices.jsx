import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle } from 'lucide-react';

const API_URL = '/api';

const MarketPrices = () => {
    const { token } = useAuth();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastSync, setLastSync] = useState(null);

    const fetchPrices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/market/prices/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') {
                setPrices(response.data.data);
                setLastSync(new Date());
            } else {
                setError('Failed to load market prices.');
            }
        } catch (err) {
            console.error('Error fetching market prices:', err);
            setError('Unable to connect to market service. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, [token]);

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'Up': return <TrendingUp className="w-5 h-5 text-emerald-500" />;
            case 'Down': return <TrendingDown className="w-5 h-5 text-rose-500" />;
            default: return <Minus className="w-5 h-5 text-slate-400" />;
        }
    };

    const getTrendColor = (trend) => {
        switch (trend) {
            case 'Up': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Down': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center glass-card p-6 rounded-[2rem] bg-gradient-to-r from-emerald-900 via-emerald-800 to-indigo-900 shadow-xl relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-20" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20" />

                <div className="relative z-10 text-white">
                    <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
                        Live Market Intelligence
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Real-time Data.gov</span>
                    </h2>
                    <p className="text-emerald-100/70 text-sm font-medium">Monitoring all supported commodities across national mandis via Agmarknet.</p>
                </div>

                <button
                    onClick={fetchPrices}
                    disabled={loading}
                    className="relative z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all border border-white/20 px-6 py-3 rounded-2xl text-white font-bold text-sm tracking-wide disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Syncing...' : 'Sync Prices'}
                </button>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-3xl flex items-center gap-4">
                    <div className="bg-rose-100 p-2 rounded-full">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-sm tracking-tight">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && prices.length === 0 ? (
                    // Skeleton Loaders
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="glass-card p-6 rounded-[2rem] h-48 animate-pulse flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="h-6 w-24 bg-slate-200 rounded-md" />
                                <div className="h-8 w-8 bg-slate-200 rounded-full" />
                            </div>
                            <div>
                                <div className="h-4 w-16 bg-slate-200 rounded-md mb-2" />
                                <div className="h-8 w-32 bg-slate-200 rounded-md" />
                            </div>
                        </div>
                    ))
                ) : (
                    prices.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-6 rounded-[2rem] hover:shadow-xl transition-all hover:-translate-y-1 relative group bg-white hover:bg-slate-50 border border-slate-100"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 capitalize tracking-tight">{item.crop}</h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border mt-2 inline-block ${getTrendColor(item.trend)}`}>
                                        {item.trend} Trend
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                                    {getTrendIcon(item.trend)}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Reference Price</p>
                                <div className="flex items-end gap-2">
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">
                                        ${item.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h4>
                                    <span className="text-sm font-bold text-slate-500 mb-1">/ Ton</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                                    <span className="text-xs font-medium text-slate-500">Predicted AI Forecast:</span>
                                    <span className="text-xs font-black text-slate-700">${item.predicted_price.toFixed(2)} / Ton</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {!loading && lastSync && (
                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
                    Last synchronised: {lastSync.toLocaleTimeString()}
                </p>
            )}
        </motion.div>
    );
};

export default MarketPrices;
