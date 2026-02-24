import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, Droplets, History, Send, Loader2,
  Thermometer, Wind, Beaker, CloudRain,
  Info, ChevronRight, Activity, Database,
  ArrowRight, ShieldCheck, Zap, LogOut, User as UserIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const API_URL = '/api';

const NutrientBar = ({ label, value, max, colorClass }) => (
  <div className="space-y-1">
    {label && (
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
    )}
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn("h-full rounded-full shadow-sm", colorClass)}
      />
    </div>
  </div>
);

function App() {
  const { user, token, logout, loading: authLoading } = useAuth();
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen text-slate-900 selection:bg-emerald-200">
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 glass-card border-b border-emerald-500/10 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200">
              <Sprout className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                SmartBiz<span className="text-emerald-600">.</span>Insight
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AGRI-AI PLATFORM</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 mr-4">
              <span className="flex items-center gap-2 text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                <Activity className="w-3 h-3" /> System Live
              </span>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Welcome back,</p>
                <p className="text-xs font-black text-slate-800 tracking-tight leading-none">{user.fullName}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group relative">
                <UserIcon className="w-5 h-5" />
                <button
                  onClick={logout}
                  className="absolute -bottom-12 right-0 bg-white border border-slate-200 shadow-xl rounded-xl px-4 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
                >
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Side: Prediction Engine */}
          <div className="lg:col-span-8 space-y-8">

            {/* Hero Result Section */}
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card-dark rounded-[2.5rem] overflow-hidden group border border-emerald-500/20"
                >
                  <div className="p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Decorative Gradient Blob */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mb-8 relative z-10"
                    >
                      <span className="bg-white/50 backdrop-blur-md text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-emerald-500/20 shadow-sm">
                        AI Recommendation Generated
                      </span>
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20">
                      <div className="space-y-2">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Target Crop</p>
                        <h2 className="text-6xl md:text-8xl font-black text-emerald-950 capitalize tracking-tighter">
                          {result.crop}
                        </h2>
                      </div>

                      <div className="h-16 w-[1px] bg-emerald-500/20 hidden md:block"></div>

                      <div className="space-y-4">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest text-center md:text-left">Irrigation Index</p>
                        <div className={cn(
                          "px-8 py-4 rounded-3xl font-black text-2xl flex items-center gap-3 shadow-xl",
                          result.irrigation === 'High' ? "bg-rose-50 text-white shadow-rose-200" :
                            result.irrigation === 'Medium' ? "bg-amber-50 text-white shadow-amber-200" :
                              "bg-emerald-50 text-white shadow-emerald-200"
                        )}>
                          <Droplets className="w-8 h-8" />
                          {result.irrigation}
                        </div>
                      </div>
                    </div>

                    {/* Fertilizer Advisory Section */}
                    {result.fertilizer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-10 pt-10 border-t border-emerald-500/10"
                      >
                        <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                          <Beaker className="text-emerald-600 w-5 h-5" />
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Fertilizer Advisory</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { label: 'Nitrogen', value: result.fertilizer.N, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Phosphorus', value: result.fertilizer.P, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Potassium', value: result.fertilizer.K, icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' }
                          ].map((item, i) => (
                            <div key={i} className={cn("p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-all flex items-center gap-4", item.bg)}>
                              <div className={cn("p-2 rounded-xl bg-white shadow-sm", item.color)}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</p>
                                <p className={cn("text-xs font-black", item.value === 'Optimal' ? 'text-emerald-600' : 'text-slate-700')}>
                                  {item.value}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 p-4 rounded-2xl bg-white/50 border border-slate-100 text-left">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Info className="w-3 h-3 text-emerald-500" /> Improvement Summary
                          </p>
                          <ul className="space-y-1">
                            {result.fertilizer.summary.map((note, i) => (
                              <li key={i} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 text-emerald-400" /> {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-12 flex justify-center gap-4">
                      <button onClick={() => setResult(null)} className="text-emerald-700 text-xs font-bold flex items-center gap-2 hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all">
                        Reset Analysis <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-1 pb-1 rounded-[2.5rem]"
                >
                  <div className="bg-white p-8 md:p-12 rounded-[2.3rem] shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                      <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                          <Activity className="text-emerald-500 w-8 h-8" />
                          Soil Vitality Analysis
                        </h2>
                        <p className="text-slate-400 font-medium mt-1">Enter your parameters for real-time AI cross-referencing.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSyncWeather}
                        disabled={weatherLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all disabled:opacity-50"
                      >
                        {weatherLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CloudRain className="w-4 h-4" />
                        )}
                        {weatherLoading ? 'Syncing...' : 'Sync Live Weather'}
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <NutrientBar label="Nitrogen (N)" value={formData.N || 0} max={140} colorClass="bg-blue-500" />
                          <input type="number" name="N" placeholder="N Value" value={formData.N} onChange={handleInputChange} required className="input-glass w-full rounded-2xl p-4 font-bold" />
                        </div>
                        <div className="space-y-4">
                          <NutrientBar label="Phosphorus (P)" value={formData.P || 0} max={145} colorClass="bg-emerald-500" />
                          <input type="number" name="P" placeholder="P Value" value={formData.P} onChange={handleInputChange} required className="input-glass w-full rounded-2xl p-4 font-bold" />
                        </div>
                        <div className="space-y-4">
                          <NutrientBar label="Potassium (K)" value={formData.K || 0} max={205} colorClass="bg-purple-500" />
                          <input type="number" name="K" placeholder="K Value" value={formData.K} onChange={handleInputChange} required className="input-glass w-full rounded-2xl p-4 font-bold" />
                        </div>
                      </div>

                      <div className="h-[1px] w-full bg-slate-100"></div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">pH Level</label>
                            <NutrientBar label="" value={formData.ph || 0} max={14} colorClass="bg-indigo-500" />
                          </div>
                          <div className="relative">
                            <Beaker className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />
                            <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleInputChange} required placeholder="6.5" className="input-glass w-full rounded-xl p-4 pl-12 font-bold" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Temp (°C)</label>
                            <NutrientBar label="" value={formData.temperature || 0} max={50} colorClass="bg-orange-500" />
                          </div>
                          <div className="relative">
                            <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4" />
                            <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleInputChange} required placeholder="28.4" className="input-glass w-full rounded-xl p-4 pl-12 font-bold" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Humidity (%)</label>
                            <NutrientBar label="" value={formData.humidity || 0} max={100} colorClass="bg-blue-500" />
                          </div>
                          <div className="relative">
                            <Wind className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
                            <input type="number" name="humidity" value={formData.humidity} onChange={handleInputChange} required placeholder="82" className="input-glass w-full rounded-xl p-4 pl-12 font-bold" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Rainfall (mm)</label>
                            <NutrientBar label="" value={formData.rainfall || 0} max={300} colorClass="bg-emerald-500" />
                          </div>
                          <div className="relative">
                            <CloudRain className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                            <input type="number" name="rainfall" value={formData.rainfall} onChange={handleInputChange} required placeholder="202" className="input-glass w-full rounded-xl p-4 pl-12 font-bold" />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg py-5 rounded-[1.5rem] shadow-2xl shadow-emerald-200 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" />
                            <span className="animate-pulse">PROCESSING AI MODEL...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-6 h-6" />
                            RUN PREDICTIVE ENGINE
                          </>
                        )}
                      </button>
                    </form>
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
          <div className="lg:col-span-4 sticky top-32">
            <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col max-h-[calc(100vh-160px)]">
              <div className="p-8 border-b border-emerald-500/10 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <History className="text-emerald-500 w-6 h-6" />
                  Audit Log
                </h2>
                <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-md">
                  {history.length}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {history.length > 0 ? (
                  <AnimatePresence initial={false}>
                    {history.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={item._id}
                        className="bg-white/50 hover:bg-white p-5 rounded-3xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-default group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-black text-lg text-emerald-900 capitalize group-hover:text-emerald-600 transition-colors">
                            {item.prediction.crop}
                          </div>
                          <span className={cn(
                            "text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-[0.1em]",
                            item.prediction.irrigation === 'High' ? "bg-rose-50 text-rose-600" :
                              item.prediction.irrigation === 'Medium' ? "bg-amber-50 text-amber-600" :
                                "bg-emerald-50 text-emerald-600"
                          )}>
                            {item.prediction.irrigation} Water
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                          <span className="flex items-center gap-1 text-blue-500/70"><Zap className="w-3 h-3" /> N:{item.inputs.N}</span>
                          <span className="flex items-center gap-1 text-emerald-500/70"><Activity className="w-3 h-3" /> P:{item.inputs.P}</span>
                          <span className="flex items-center gap-1 text-purple-500/70"><Database className="w-3 h-3" /> K:{item.inputs.K}</span>
                        </div>

                        {item.fertilizer && item.fertilizer.N !== 'Optimal' && (
                          <div className="mt-2 text-[8px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                            <Info className="w-2.5 h-2.5" /> Actionable Advice Available
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                          <div className="text-[10px] text-slate-300 font-medium">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <ChevronRight className="w-3 h-3 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-20">
                    <History className="w-16 h-16 mx-auto mb-4 text-emerald-100" />
                    <p className="text-slate-400 font-bold text-sm">No analysis history found.</p>
                  </div>
                )}
              </div>
            </div>
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
}

export default App;
