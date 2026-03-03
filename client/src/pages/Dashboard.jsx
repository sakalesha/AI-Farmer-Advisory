import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import RecommendationResult from '../components/dashboard/RecommendationResult';
import SoilForm from '../components/dashboard/SoilForm';
import HistoryLog from '../components/dashboard/HistoryLog';
import YieldTrendChart from '../components/dashboard/YieldTrendChart';
import ProfitHeatmap from '../components/dashboard/ProfitHeatmap';
import SectorComparison from '../components/dashboard/SectorComparison';
import MarketPrices from '../components/dashboard/MarketPrices';
import { Scale as ScaleIcon } from 'lucide-react';

const API_URL = '/api';

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
            const response = await axios.get(`${API_URL}/history`, { headers: { Authorization: `Bearer ${token}` } });
            setHistory(Array.isArray(response.data) ? response.data : []);
        } catch { setHistory([]); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['ph', 'temperature'].includes(name)) {
            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) setFormData({ ...formData, [name]: value });
            return;
        }
        if (value === '' || /^\d*$/.test(value)) setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null); setResult(null);
        try {
            const payload = Object.keys(formData).reduce((acc, key) => { acc[key] = parseFloat(formData[key]); return acc; }, {});
            const response = await axios.post(`${API_URL}/recommend`, payload, { headers: { Authorization: `Bearer ${token}` } });
            setResult(response.data);
            fetchHistory();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get recommendation. Make sure the server is running.');
        } finally { setLoading(false); }
    };

    const handleSyncWeather = async () => {
        if (!navigator.geolocation) { setError("Geolocation is not supported by your browser"); return; }
        setWeatherLoading(true); setError(null);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await axios.get(`${API_URL}/weather?lat=${latitude}&lon=${longitude}`, { headers: { Authorization: `Bearer ${token}` } });
                const { temp, humidity, rainfall } = response.data.data;
                setFormData(prev => ({ ...prev, temperature: temp.toFixed(1), humidity: Math.round(humidity), rainfall: Math.round(rainfall) }));
            } catch { setError("Failed to sync live weather. Check API key or try again."); }
            finally { setWeatherLoading(false); }
        }, () => { setError("Location access denied. Enable location to sync weather."); setWeatherLoading(false); });
    };

    const handleCompareToggle = (item) => {
        setCompareItems(prev => {
            const exists = prev.find(i => i._id === item._id);
            if (exists) return prev.filter(i => i._id !== item._id);
            if (prev.length >= 2) return [prev[1], item];
            return [...prev, item];
        });
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            <Navbar user={user} logout={logout} view={view} setView={setView} />

            {/* Main content — offset by sidebar width on desktop */}
            <div className="lg:pl-[260px] pb-20 lg:pb-0">
                <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                            {view === 'dashboard' && 'Crop Advisory'}
                            {view === 'analytics' && 'Field Analytics'}
                            {view === 'market' && 'Live Market'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            {view === 'dashboard' && 'Enter soil parameters to generate an AI crop recommendation.'}
                            {view === 'analytics' && 'Visual insights from your historical field analysis.'}
                            {view === 'market' && 'Real-time commodity prices from Agmarknet / Data.gov.in.'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <AnimatePresence mode="wait">
                                {view === 'dashboard' && (
                                    <motion.div key="dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                        {result ? (
                                            <RecommendationResult result={result} setResult={setResult} />
                                        ) : (
                                            <SoilForm
                                                formData={formData}
                                                handleInputChange={handleInputChange}
                                                handleSubmit={handleSubmit}
                                                handleSyncWeather={handleSyncWeather}
                                                loading={loading}
                                                weatherLoading={weatherLoading}
                                            />
                                        )}
                                    </motion.div>
                                )}

                                {view === 'analytics' && (
                                    <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <YieldTrendChart history={history} />
                                            <ProfitHeatmap history={history} />
                                        </div>
                                    </motion.div>
                                )}

                                {view === 'market' && (
                                    <motion.div key="market" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                        <MarketPrices />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {error && (
                                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 px-5 py-4 rounded-2xl text-rose-300 text-sm font-semibold"
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                    <Info className="w-4 h-4 shrink-0 text-rose-400" />
                                    {error}
                                </motion.div>
                            )}
                        </div>

                        {/* Right: History + Compare */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
                            {compareItems.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl p-5"
                                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)' }}>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <ScaleIcon className="w-4 h-4 text-emerald-400" />
                                            <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Compare</p>
                                        </div>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--emerald-400)' }}>{compareItems.length}/2</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {compareItems.map(item => (
                                            <div key={item._id} className="flex justify-between items-center px-3 py-2 rounded-xl" style={{ background: 'var(--bg-hover)' }}>
                                                <span className="text-sm font-bold text-slate-200 capitalize">{item.prediction.crop}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">#{item._id.slice(-6)}</span>
                                            </div>
                                        ))}
                                        {compareItems.length < 2 && (
                                            <div className="min-h-[40px] rounded-xl flex items-center justify-center" style={{ border: '1px dashed var(--border-muted)' }}>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Select another from history</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        disabled={compareItems.length < 2}
                                        onClick={() => setShowComparison(true)}
                                        className="btn-primary w-full py-3 rounded-xl text-sm disabled:opacity-40"
                                    >Compare Scenarios</button>
                                    <button onClick={() => setCompareItems([])} className="w-full mt-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">Clear</button>
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
