import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle, MapPin, DollarSign, Activity } from 'lucide-react';

const API_URL = '/api';

const MarketPrices = () => {
    const [prices, setPrices]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [lastSync, setLastSync] = useState(null);

    const fetchPrices = async () => {
        setLoading(true); setError(null);
        try {
            const response = await axios.get(`${API_URL}/market/prices/all`);
            if (response.data.status === 'success') {
                setPrices(response.data.data);
                setLastSync(new Date());
            } else { setError('Failed to load market data.'); }
        } catch {
            setError('Unable to connect to market service. Please try again.');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchPrices(); }, []);

    const trendConfig = {
        Up:     { icon: TrendingUp,   color: 'var(--emerald-600)', bg: 'var(--emerald-glow)', border: 'var(--border-accent)', label: 'Rising Trend' },
        Down:   { icon: TrendingDown, color: 'var(--indigo-500)', bg: 'var(--indigo-glow)', border: 'rgba(196, 98, 45, 0.25)', label: 'Falling Trend' },
        Stable: { icon: Minus,        color: 'var(--text-muted)', bg: 'var(--bg-hover)', border: 'var(--border-muted)', label: 'Stable' },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardItem = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Premium Header Banner */}
            <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--emerald-400), var(--indigo-400))' }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'radial-gradient(circle at 100% 0%, var(--emerald-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 200, height: 200, background: 'radial-gradient(circle at 0% 100%, var(--indigo-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ maxWidth: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '12px', background: 'var(--emerald-glow)', border: '1px solid var(--border-accent)' }}>
                                <Activity style={{ width: 20, height: 20, color: 'var(--emerald-600)' }} />
                            </div>
                            <div>
                                <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                                    Commodity Exchange
                                </h2>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--emerald-600)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.25rem' }}>Live Indian Mandi Rates</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: 99, background: 'var(--bg-hover)', border: '1px solid var(--border-muted)' }}>
                                <MapPin style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>National Average</span>
                            </div>
                            
                            {prices.length > 0 && prices[0].usd_to_inr && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: 99, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                                    <DollarSign style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                        1 USD = ₹{prices[0].usd_to_inr.toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                {lastSync ? `Updated: ${lastSync.toLocaleTimeString()}` : 'Syncing data...'}
                            </span>
                        </div>
                    </div>

                    <button onClick={fetchPrices} disabled={loading} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
                        background: 'var(--bg-base)', border: '1px solid var(--border-muted)', borderRadius: '99px',
                        color: 'var(--text-primary)', fontSize: '0.8125rem', fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                        boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', flexShrink: 0
                    }}
                    onMouseEnter={e => { if(!loading) e.currentTarget.style.background = 'var(--bg-hover)' }}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-base)'}>
                        <RefreshCw style={{ width: 16, height: 16, color: 'var(--emerald-600)', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Refreshing...' : 'Refresh Feed'}
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem',
                    borderRadius: '1rem', color: 'var(--indigo-500)', fontSize: '0.875rem', fontWeight: 700,
                    background: 'var(--indigo-glow)', border: '1px solid rgba(196, 98, 45, 0.2)',
                }}>
                    <AlertCircle style={{ width: 20, height: 20, flexShrink: 0 }} />
                    <p>{error}</p>
                </div>
            )}

            {/* Premium Editorial Grid */}
            {loading && prices.length === 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: 180, borderRadius: '1.25rem' }} />
                    ))}
                </div>
            ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="show"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {prices.map((item, index) => {
                        const cfg = trendConfig[item.trend] || trendConfig.Stable;
                        const TIcon = cfg.icon;

                        return (
                            <motion.variants key={index} variants={cardItem}>
                                <div style={{
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '1.25rem',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: 180,
                                    position: 'relative',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-muted)' }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
                                    
                                    {/* Top Row: Crop Name & Icon */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed var(--border-soft)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                        <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', textTransform: 'capitalize', margin: 0, lineHeight: 1.2 }}>
                                            {item.crop}
                                        </h3>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.625rem', borderRadius: 99,
                                            background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color
                                        }}>
                                            <TIcon style={{ width: 14, height: 14 }} />
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Price Info */}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                            Current Metric
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                                            <span style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                                <span style={{ fontSize: '1.25rem', marginRight: 2, color: 'var(--text-muted)' }}>₹</span>
                                                {item.inr_per_quintal.toLocaleString('en-IN')}
                                            </span>
                                            <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/ Qtl</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.variants>
                        );
                    })}
                </motion.div>
            )}
        </motion.div>
    );
};

export default MarketPrices;
