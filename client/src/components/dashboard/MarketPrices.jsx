import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle, MapPin, DollarSign } from 'lucide-react';

const API_URL = '/api';

const MarketPrices = () => {
    const { token } = useAuth();
    const [prices, setPrices]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [lastSync, setLastSync] = useState(null);

    const fetchPrices = async () => {
        setLoading(true); setError(null);
        try {
            const response = await axios.get(`${API_URL}/market/prices/all`, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.status === 'success') {
                setPrices(response.data.data);
                setLastSync(new Date());
            } else { setError('Failed to load market data.'); }
        } catch {
            setError('Unable to connect to market service. Please try again.');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchPrices(); }, [token]);

    const trendConfig = {
        Up:     { icon: TrendingUp,   color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  leftBorder: '#34d399', glow: 'rgba(52,211,153,0.12)',  label: '↑ Rising',  cls: 'trend-up' },
        Down:   { icon: TrendingDown, color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', leftBorder: '#f87171', glow: 'rgba(248,113,113,0.1)', label: '↓ Falling', cls: 'trend-down' },
        Stable: { icon: Minus,        color: '#94a3b8', bg: 'rgba(148,163,184,0.08)',border: 'rgba(148,163,184,0.15)',leftBorder: '#475569', glow: 'rgba(148,163,184,0.06)',label: '→ Stable',  cls: 'trend-flat' },
    };

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header */}
            <div className="card" style={{ overflow: 'hidden' }}>
                {/* Subtle gradient bg */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '1.5rem 1.75rem', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div className="live-dot" />
                            <h2 style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                                Live Commodity Prices
                            </h2>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.75rem' }}>
                            {lastSync
                                ? `Synced at ${lastSync.toLocaleTimeString()} — Agmarknet / Data.gov.in`
                                : 'Fetching latest mandi prices from across India…'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <MapPin style={{ width: 13, height: 13, color: 'var(--text-muted)' }} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                    INR/Quintal · updated every market day
                                </span>
                            </div>
                            {prices.length > 0 && prices[0].usd_to_inr && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.75rem', borderRadius: 99, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                                    <DollarSign style={{ width: 12, height: 12, color: '#34d399' }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>
                                        1 USD = ₹{prices[0].usd_to_inr.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={fetchPrices} disabled={loading} className="btn-ghost"
                        style={{ padding: '0.625rem 1.25rem', flexShrink: 0 }}>
                        <RefreshCw style={{ width: 15, height: 15, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Syncing…' : 'Refresh Prices'}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem',
                    borderRadius: '0.875rem', color: '#fca5a5', fontSize: '0.875rem', fontWeight: 600,
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                }}>
                    <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
                    {error}
                </div>
            )}

            {/* Price Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
                {loading && prices.length === 0
                    ? [...Array(9)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: 140, borderRadius: '1rem' }} />
                    ))
                    : prices.map((item, index) => {
                        const cfg = trendConfig[item.trend] || trendConfig.Stable;
                        const TIcon = cfg.icon;
                        return (
                            <motion.div key={index}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.025 }}
                                whileHover={{ y: -3, boxShadow: `0 8px 32px ${cfg.glow}, 0 0 0 1px ${cfg.border}` }}
                                style={{
                                    borderRadius: '1rem', padding: '1.25rem', position: 'relative', overflow: 'hidden',
                                    background: 'var(--bg-card)',
                                    backdropFilter: 'blur(16px)',
                                    border: `1px solid var(--border-subtle)`,
                                    borderLeft: `3px solid ${cfg.leftBorder}`,
                                    boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 24px ${cfg.glow}`,
                                    cursor: 'default',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}>

                                {/* Hover glow */}
                                <div style={{
                                    position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none', borderRadius: 'inherit',
                                    background: `radial-gradient(ellipse at top right, ${cfg.bg}, transparent 70%)`,
                                }} />

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    {/* Header row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', textTransform: 'capitalize', lineHeight: 1.2 }}>
                                            {item.crop}
                                        </h3>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: '0.625rem', flexShrink: 0,
                                            background: cfg.bg, border: `1px solid ${cfg.border}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <TIcon style={{ width: 15, height: 15, color: cfg.color }} />
                                        </div>
                                    </div>

                                    {/* Trend badge */}
                                    <span className={`${cfg.cls}`}
                                        style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: 99, display: 'inline-block', marginBottom: '0.875rem' }}>
                                        {cfg.label}
                                    </span>

                                    {/* Price */}
                                    <div>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                                            Current Price
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                            <span style={{ fontWeight: 900, fontSize: '1.4375rem', color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                                                ₹{item.inr_per_quintal.toLocaleString('en-IN')}
                                            </span>
                                            <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/Qtl</span>
                                        </div>
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
