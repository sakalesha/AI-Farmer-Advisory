import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, LogIn, UserPlus, Mail, Lock, User, Loader2, ArrowRight, Leaf, BarChart3, CloudRain } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const features = [
    { icon: Leaf, label: 'AI Crop Recommendation', desc: 'ML-powered soil analysis across 22 crops' },
    { icon: BarChart3, label: 'Yield & Profit Analytics', desc: 'Track performance over multiple seasons' },
    { icon: CloudRain, label: 'Live Weather Sync', desc: 'Auto-fill from your GPS location' },
];

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const { login } = useAuth();
    const API_URL = '/api';

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await axios.post(`${API_URL}${endpoint}`, formData);
            const { token, data } = response.data;
            login(data.user, token);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>

            {/* ── Left Brand Panel ── */}
            <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0a1628 0%, #071013 100%)', borderRight: '1px solid var(--border-subtle)' }}>

                {/* Decorative orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--emerald-500)', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                        <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-base font-black text-slate-100 tracking-tight">Agro<span className="text-emerald-400">Insight</span></p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">AGRI-AI PLATFORM</p>
                    </div>
                </div>

                {/* Headline */}
                <div className="space-y-6 relative z-10">
                    <div>
                        <h1 className="text-5xl font-black text-slate-100 leading-[1.1] tracking-tight mb-4">
                            Farm smarter<br />
                            <span className="text-emerald-400">with AI.</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                            Precision crop recommendations, real-time market intelligence, and yield forecasting — all in one platform.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        {features.map(({ icon: Icon, label, desc }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-2xl"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
                            >
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                    <Icon className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-200">{label}</p>
                                    <p className="text-xs text-slate-500">{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold relative z-10">
                    © 2026 AgroInsight • AI Engine v1.0.4
                </p>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-8">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--emerald-500)', boxShadow: '0 0 16px rgba(16,185,129,0.4)' }}>
                            <Sprout className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-lg font-black text-slate-100">Agro<span className="text-emerald-400">Insight</span></p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                            {isLogin ? 'Welcome back' : 'Create your account'}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {isLogin ? 'Sign in to your farm dashboard.' : 'Start your AI-powered farming journey.'}
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex p-1 rounded-xl mb-8 gap-1" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        {[{ val: true, label: 'Sign In', Icon: LogIn }, { val: false, label: 'Sign Up', Icon: UserPlus }].map(({ val, label, Icon }) => (
                            <button key={label} onClick={() => setIsLogin(val)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${isLogin === val ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                                style={isLogin === val ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' } : {}}>
                                <Icon className="w-4 h-4" />{label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {!isLogin && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                                            required={!isLogin} placeholder="John Doe"
                                            className="input-glass pl-10" />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        required placeholder="farmer@example.com"
                                        className="input-glass pl-10" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                                        required placeholder="••••••••"
                                        className="input-glass pl-10" />
                                </div>
                            </div>

                            {error && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-rose-400 text-xs font-semibold px-4 py-3 rounded-xl"
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                    {error}
                                </motion.p>
                            )}

                            <button type="submit" disabled={loading}
                                className="btn-primary w-full py-4 rounded-xl text-sm mt-2">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>{isLogin ? 'Enter Dashboard' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;
