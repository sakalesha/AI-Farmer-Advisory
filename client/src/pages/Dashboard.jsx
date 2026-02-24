import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import RecommendationResult from '../components/dashboard/RecommendationResult';
import SoilForm from '../components/dashboard/SoilForm';
import HistoryLog from '../components/dashboard/HistoryLog';

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    return (
        <div className="min-h-screen text-slate-900 selection:bg-emerald-200">
            <Navbar user={user} logout={logout} />

            <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Side: Prediction Engine */}
                    <div className="lg:col-span-8 space-y-8">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <RecommendationResult result={result} setResult={setResult} />
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
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
                    <div className="lg:col-span-4 sticky top-32">
                        <HistoryLog history={history} onSelect={setResult} />
                    </div>
                </div>
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
