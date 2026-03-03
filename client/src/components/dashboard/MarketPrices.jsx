import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle, Wifi } from 'lucide-react';

const API_URL = '/api';

const MarketPrices = () => {
    const { token } = useAuth();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastSync, setLastSync] = useState(null);

    const fetchPrices = async () => {
        setLoading(true); setError(null);
        try {
            const response = await axios.get(`${API_URL}/market/prices/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') {
                setPrices(response.data.data);
                setLastSync(new Date());
            } else {
                setError('Failed to load market data.');
            }
        } catch (err) {
            console.error('Error fetching market prices:', err);
            setError('Unable to connect to market service. Please try again later.');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchPrices(); }, [token]);

    const trendConfig = {
        Up: { icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', accent: 'rgba(52,211,153,1)', label: 'Up', cls: 'trend-up' },
        Down: { icon: TrendingDown, color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', accent: 'rgba(248,113,113,1)', label: 'Down', cls: 'trend-down' },
        Stable: { icon: Minus, color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.1)', accent: 'rgba(148,163,184,1)', label: 'Stable', cls: 'trend-flat' },
    };

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Hero header */}
            <div className="card overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.07) 0%, transparent 60%)' }} />
                <div className="relative z-10 flex items-center justify-between p-6 flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="live-dot" />
                            <h2 className="text-lg font-black text-slate-100 tracking-tight">Live Market Intelligence</h2>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--emerald-400)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                Data.gov.in
                            </span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {lastSync ? `Last synced: ${lastSync.toLocaleTimeString()}` : 'Fetching commodity prices from Agmarknet…'}
                        </p>
                    </div>
                    <button onClick={fetchPrices} disabled={loading}
                        className="btn-ghost text-xs px-4 py-2 flex items-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Syncing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 px-5 py-4 rounded-2xl text-rose-400 text-sm font-semibold"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading && prices.length === 0
                    ? [...Array(9)].map((_, i) => (
                        <div key={i} className="rounded-2xl p-5 h-36 skeleton" style={{ background: 'var(--bg-surface)' }} />
                    ))
                    : prices.map((item, index) => {
                        const cfg = trendConfig[item.trend] || trendConfig.Stable;
                        const TrendIcon = cfg.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="rounded-2xl p-5 relative overflow-hidden group cursor-default"
                                style={{
                                    background: 'var(--bg-surface)',
                                    border: `1px solid var(--border-subtle)`,
                                    borderLeft: `3px solid ${cfg.accent}`,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                whileHover={{ y: -2 }}
                            >
                                {/* Subtle glow on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                                    style={{ background: `radial-gradient(ellipse at top right, ${cfg.bg}, transparent 70%)` }} />

                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-base font-black text-slate-100 capitalize tracking-tight">{item.crop}</h3>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1.5 inline-flex items-center gap-1 ${cfg.cls}`}>
                                            <TrendIcon className="w-2.5 h-2.5" /> {cfg.label}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                        <TrendIcon className="w-4 h-4" style={{ color: cfg.color }} />
                                    </div>
                                </div>

                                <div className="relative z-10 mt-4">
                                    <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Live Reference Price</p>
                                    <div className="flex items-end gap-1">
                                        <span className="text-2xl font-black text-slate-100 tracking-tighter">
                                            ${item.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        <span className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>/Ton</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                }
            </div>
        </motion.div>
    );
};

export default MarketPrices;
