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
import { BarChart3, LayoutDashboard, Scale as ScaleIcon } from 'lucide-react';

const API_URL = '/api';

const Dashboard = () => {
    const { user, token, logout } = useAuth();
    const [formData, setFormData] = useState({
        N: '', P: '', K: '',
        temperature: '', humidity: '',
        ph: '', rainfall: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'analytics'
    const [compareItems, setCompareItems] = useState([]);
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${API_URL}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(response.data);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validation for decimal fields (ph, temperature)
        if (['ph', 'temperature'].includes(name)) {
            // Allow only numbers and one decimal point
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (value === '' || regex.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
            return;
        }

        // Default for numeric integer fields
        if (value === '' || /^\d*$/.test(value)) {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = Object.keys(formData).reduce((acc, key) => {
                acc[key] = parseFloat(formData[key]);
                return acc;
            }, {});

            const response = await axios.post(`${API_URL}/recommend`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult(response.data);
            fetchHistory();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get recommendation. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncWeather = async () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setWeatherLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await axios.get(`${API_URL}/weather?lat=${latitude}&lon=${longitude}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { temp, humidity, rainfall } = response.data.data;

                setFormData(prev => ({
                    ...prev,
                    temperature: temp.toFixed(1),
                    humidity: Math.round(humidity),
                    rainfall: Math.round(rainfall)
                }));

                if (response.data.mode === 'simulation') {
                    console.log("🌦️ Simulation weather data loaded");
                }
            } catch (err) {
                setError("Failed to sync live weather. Using simulation fallback or check API key.");
            } finally {
                setWeatherLoading(false);
            }
        }, (err) => {
            setError("Location access denied. Please enable location to sync weather.");
            setWeatherLoading(false);
        });
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
        <div className="min-h-screen text-slate-900 selection:bg-emerald-200">
            <Navbar user={user} logout={logout} />

            <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Side: Prediction Engine */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 w-fit">
                            <button
                                onClick={() => setView('dashboard')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${view === 'dashboard' ? 'bg-white shadow-lg text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Advisory
                            </button>
                            <button
                                onClick={() => setView('analytics')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${view === 'analytics' ? 'bg-white shadow-lg text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Analytics
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {view === 'dashboard' ? (
                                <div className="space-y-8">
                                    {result ? (
                                        <RecommendationResult result={result} setResult={setResult} />
                                    ) : (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="glass-card p-1 pb-1 rounded-[2.5rem]"
                                        >
                                            <SoilForm
                                                formData={formData}
                                                handleInputChange={handleInputChange}
                                                handleSubmit={handleSubmit}
                                                handleSyncWeather={handleSyncWeather}
                                                loading={loading}
                                                weatherLoading={weatherLoading}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            ) : (
                                <motion.div
                                    key="analytics"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <YieldTrendChart history={history} />
                                        <ProfitHeatmap history={history} />
                                    </div>
                                    <div className="glass-card p-12 text-center rounded-[2.5rem] bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 border border-emerald-500/10">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-emerald-400/50" />
                                        <h4 className="text-xl font-black text-slate-800 tracking-tight">Advanced Field Intelligence</h4>
                                        <p className="text-slate-400 text-sm font-medium mt-2 max-w-md mx-auto">
                                            Visualizing your farm's performance over time. Use the historical data to identify patterns in crop success and soil vitality.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-3xl flex items-center gap-4"
                            >
                                <div className="bg-rose-100 p-2 rounded-full">
                                    <Info className="w-5 h-5" />
                                </div>
                                <p className="font-bold text-sm tracking-tight">{error}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Side: History Log */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
                        {compareItems.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-900 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-900/20"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <ScaleIcon className="w-4 h-4 text-emerald-400" />
                                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Comparison Hub</p>
                                    </div>
                                    <span className="bg-emerald-500 text-xs font-black px-2 py-0.5 rounded-lg">{compareItems.length}/2</span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {compareItems.map(item => (
                                        <div key={item._id} className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/5">
                                            <span className="text-sm font-black capitalize">{item.prediction.crop}</span>
                                            <span className="text-[10px] text-white/40 font-mono truncate max-w-[80px]">#{item._id.slice(-6)}</span>
                                        </div>
                                    ))}
                                    {compareItems.length < 2 && (
                                        <div className="dashed-border min-h-[44px] rounded-xl flex items-center justify-center p-3 border border-dashed border-white/20">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Select another field</p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    disabled={compareItems.length < 2}
                                    onClick={() => setShowComparison(true)}
                                    className="w-full bg-white text-emerald-900 font-black py-4 rounded-2xl hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                                >
                                    Compare Scenarios
                                </button>
                                <button
                                    onClick={() => setCompareItems([])}
                                    className="w-full mt-2 text-[10px] font-black text-white/40 uppercase hover:text-white transition-colors"
                                >
                                    Clear Selection
                                </button>
                            </motion.div>
                        )}
                        <HistoryLog
                            history={history}
                            onSelect={setResult}
                            onCompareSelect={handleCompareToggle}
                            selectedItems={compareItems}
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {showComparison && (
                        <SectorComparison
                            items={compareItems}
                            onClose={() => setShowComparison(false)}
                        />
                    )}
                </AnimatePresence>
            </main>

            <footer className="max-w-7xl mx-auto p-12 text-center">
                <div className="h-[1px] w-40 bg-slate-200 mx-auto mb-8"></div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">
                    SmartBiz.Insight Platform 2026 • AI Engine v1.0.4
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
