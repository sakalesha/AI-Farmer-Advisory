import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, LogIn, UserPlus, Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const { login } = useAuth();
    const API_URL = '/api';

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await axios.post(`${API_URL}${endpoint}`, formData);

            const { token, data } = response.data;
            login(data.user, token);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-fixed bg-cover bg-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 radial-gradient-custom"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#10b98120_1px,transparent_1px)] [background-size:32px_32px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative"
            >
                {/* Floating Accents */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-200/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="glass-card p-1 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    {/* Top Branding Section */}
                    <div className="bg-emerald-950/5 p-8 rounded-t-[2.3rem] text-center space-y-4 border-b border-emerald-500/10">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto text-emerald-600 border border-emerald-500/10"
                        >
                            <Sprout className="w-8 h-8" />
                        </motion.div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">SmartBiz Insight</h1>
                            <p className="text-sm text-slate-500 font-medium">Empowering Farmers with Precision AI</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-b-[2.3rem]">
                        {/* Animated Tab Switcher */}
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-200/50">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${isLogin ? 'bg-white text-emerald-600 shadow-md ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LogIn className="w-4 h-4" /> Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${!isLogin ? 'bg-white text-emerald-600 shadow-md ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <UserPlus className="w-4 h-4" /> Signup
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.form
                                key={isLogin ? 'login' : 'signup'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required={!isLogin}
                                                placeholder="John Doe"
                                                className="input-glass w-full rounded-2xl p-4 pl-12 font-bold"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="farmer@smartbiz.com"
                                            className="input-glass w-full rounded-2xl p-4 pl-12 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Secret Key</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="••••••••"
                                            className="input-glass w-full rounded-2xl p-4 pl-12 font-bold"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold leading-relaxed"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? 'Enter Dashboard' : 'Create My Account'}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        </AnimatePresence>

                        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit AES Encryption</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
