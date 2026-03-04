import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Scale as ScaleIcon, Sunrise, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import RecommendationResult from '../components/dashboard/RecommendationResult';
import SoilForm from '../components/dashboard/SoilForm';
import HistoryLog from '../components/dashboard/HistoryLog';
import YieldTrendChart from '../components/dashboard/YieldTrendChart';
import ProfitHeatmap from '../components/dashboard/ProfitHeatmap';
import SectorComparison from '../components/dashboard/SectorComparison';
import MarketPrices from '../components/dashboard/MarketPrices';

const API_URL = '/api';

const getGreeting = (name) => {
    const hour = new Date().getHours();
    const firstName = name?.split(' ')[0] || 'Farmer';
    if (hour < 12) return { text: `Good morning, ${firstName} 🌅`, Icon: Sunrise };
    if (hour < 17) return { text: `Good afternoon, ${firstName} ☀️`, Icon: Sun };
    return { text: `Good evening, ${firstName} 🌙`, Icon: Moon };
};

const viewConfig = {
    dashboard: {
        title: '🌾 Crop Advisory',
        subtitle: 'Enter your soil data — AI will recommend the best crop for your field.',
    },
    analytics: {
        title: '📊 Field Analytics',
        subtitle: 'Track your crop yield and profit trends over time to make better decisions.',
    },
    market: {
        title: '📈 Market Prices',
        subtitle: "Today's commodity prices from Agmarknet mandis across India — updated live.",
    },
};

const Dashboard = () => {
    const { user, token, logout } = useAuth();
    const [formData, setFormData] = useState({ N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [view, setView] = useState('dashboard');
    const [compareItems, setCompareItems] = useState([]);
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => { if (user) fetchHistory(); }, [user]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_URL}/history`, { headers: { Authorization: `Bearer ${token}` } });
            setHistory(Array.isArray(res.data) ? res.data : []);
        } catch { setHistory([]); }
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        if (['ph', 'temperature'].includes(name)) {
            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) setFormData({ ...formData, [name]: value });
            return;
        }
        if (value === '' || /^\d*$/.test(value)) setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true); setError(null); setResult(null);
        try {
            const payload = Object.keys(formData).reduce((acc, k) => { acc[k] = parseFloat(formData[k]); return acc; }, {});
            const res = await axios.post(`${API_URL}/recommend`, payload, { headers: { Authorization: `Bearer ${token}` } });
            setResult(res.data); fetchHistory();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get recommendation. Make sure the server is running.');
        } finally { setLoading(false); }
    };

    const handleSyncWeather = async () => {
        if (!navigator.geolocation) { setError('Geolocation not supported by your browser'); return; }
        setWeatherLoading(true); setError(null);
        navigator.geolocation.getCurrentPosition(async ({ coords: { latitude, longitude } }) => {
            try {
                const res = await axios.get(`${API_URL}/weather?lat=${latitude}&lon=${longitude}`, { headers: { Authorization: `Bearer ${token}` } });
                const { temp, humidity, rainfall } = res.data.data;
                setFormData(prev => ({ ...prev, temperature: temp.toFixed(1), humidity: Math.round(humidity), rainfall: Math.round(rainfall) }));
            } catch { setError('Failed to sync live weather. Check API key or try again.'); }
            finally { setWeatherLoading(false); }
        }, () => { setError('Location access denied. Enable location to sync weather.'); setWeatherLoading(false); });
    };

    const handleCompareToggle = item => {
        setCompareItems(prev => {
            const exists = prev.find(i => i._id === item._id);
            if (exists) return prev.filter(i => i._id !== item._id);
            if (prev.length >= 2) return [prev[1], item];
            return [...prev, item];
        });
    };

    const { text: greetingText } = getGreeting(user?.fullName);
    const vcfg = viewConfig[view];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
            <Navbar user={user} logout={logout} view={view} setView={setView} />

            <div style={{ paddingLeft: 'var(--sidebar-w)', paddingBottom: 80 }} className="lg:pl-[264px] pb-20 lg:pb-0">
                <main style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem)' }}>

                    {/* Page header */}
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: '2rem' }}>

                        {/* Greeting (only on dashboard) */}
                        {view === 'dashboard' && (
                            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                {greetingText}
                            </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                            <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                {vcfg.title}
                            </h1>
                        </div>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.375rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                            {vcfg.subtitle}
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'start' }} className="lg:grid-cols-12">

                        {/* Left: Main Content */}
                        <div className="lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <AnimatePresence mode="wait">
                                {view === 'dashboard' && (
                                    <motion.div key="dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {result
                                            ? <RecommendationResult result={result} setResult={setResult} />
                                            : <SoilForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} handleSyncWeather={handleSyncWeather} loading={loading} weatherLoading={weatherLoading} />
                                        }
                                    </motion.div>
                                )}

                                {view === 'analytics' && (
                                    <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        <YieldTrendChart history={history} />
                                        <ProfitHeatmap history={history} />
                                    </motion.div>
                                )}

                                {view === 'market' && (
                                    <motion.div key="market" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                        <MarketPrices />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error banner */}
                            {error && (
                                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.875rem 1.25rem', borderRadius: '0.875rem',
                                        color: '#fca5a5', fontSize: '0.875rem', fontWeight: 600,
                                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                    }}>
                                    <Info style={{ width: 16, height: 16, flexShrink: 0, color: '#f87171' }} />
                                    {error}
                                </motion.div>
                            )}
                        </div>

                        {/* Right: History + Compare */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Compare selection box */}
                            {compareItems.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{ borderRadius: '1rem', padding: '1.125rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)', boxShadow: '0 0 24px rgba(16,185,129,0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ScaleIcon style={{ width: 15, height: 15, color: '#34d399' }} />
                                            <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#34d399' }}>Compare</p>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 99, background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                                            {compareItems.length}/2
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.875rem' }}>
                                        {compareItems.map(item => (
                                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', background: 'var(--bg-hover)' }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                                                    {item.prediction.crop}
                                                </span>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{item._id.slice(-5)}</span>
                                            </div>
                                        ))}
                                        {compareItems.length < 2 && (
                                            <div style={{ minHeight: 40, borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-muted)' }}>
                                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Select another from history</p>
                                            </div>
                                        )}
                                    </div>

                                    <button disabled={compareItems.length < 2} onClick={() => setShowComparison(true)}
                                        className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                                        Compare Scenarios
                                    </button>
                                    <button onClick={() => setCompareItems([])}
                                        style={{ width: '100%', marginTop: '0.5rem', padding: '0.35rem', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                        Clear
                                    </button>
                                </motion.div>
                            )}

                            <HistoryLog history={history} onSelect={setResult} onCompareSelect={handleCompareToggle} selectedItems={compareItems} />
                        </div>
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {showComparison && <SectorComparison items={compareItems} onClose={() => setShowComparison(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
