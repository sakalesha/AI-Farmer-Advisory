import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, LogIn, UserPlus, Mail, Lock, User, Loader2, ArrowRight, Leaf, BarChart3, CloudRain, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const features = [
    { icon: Leaf, label: 'AI Crop Recommendation', desc: 'ML-powered soil analysis across 22 crops', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { icon: BarChart3, label: 'Yield & Profit Analytics', desc: 'Track performance over multiple seasons', color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
    { icon: CloudRain, label: 'Live Weather Sync', desc: 'Auto-fill from your GPS location instantly', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
];

const stats = [
    { value: '22+', label: 'Crops' },
    { value: '95%', label: 'Accuracy' },
    { value: 'Live', label: 'Markets' },
];

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const { login } = useAuth();
    const API_URL = '/api';

    const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await axios.post(`${API_URL}${endpoint}`, formData);
            const { data } = response.data;
            login(data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-base)' }}>

            {/* ── Left Brand Panel ── */}
            <div style={{
                display: 'none',
                position: 'relative',
                overflow: 'hidden',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '3rem',
                background: 'linear-gradient(160deg, #0a1628 0%, #050c1a 40%, #020815 100%)',
                borderRight: '1px solid var(--border-subtle)',
            }} className="lg:flex lg:w-[55%]">

                {/* Layered glowing orbs */}
                <div style={{
                    position: 'absolute', top: '-15%', left: '-10%', width: '70%', height: '70%', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 65%)',
                    pointerEvents: 'none', animation: 'bg-shift 15s ease-in-out infinite alternate',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '55%', height: '55%', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: '40%', right: '5%', width: '30%', height: '30%', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '1rem', flexShrink: 0,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 0 28px rgba(16,185,129,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Sprout style={{ width: 26, height: 26, color: '#fff' }} />
                    </div>
                    <div>
                        <p style={{ fontWeight: 900, fontSize: '1.125rem', color: '#f0f6ff', lineHeight: 1.2 }}>
                            Agro<span style={{ color: '#34d399' }}>Insight</span>
                        </p>
                        <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#475569', marginTop: 2 }}>
                            AGRI-AI PLATFORM
                        </p>
                    </div>
                </div>

                {/* Hero content */}
                <div style={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
                    {/* Stats chips */}
                    <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '2rem' }}>
                        {stats.map(({ value, label }) => (
                            <div key={label} style={{
                                padding: '0.4rem 0.875rem', borderRadius: 99,
                                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                            }}>
                                <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: '#34d399' }}>{value}</span>
                                <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                            </div>
                        ))}
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#f0f6ff' }}>
                        Farm smarter<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #34d399, #10b981, #6ee7b7)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>with AI.</span>
                    </h1>
                    <p style={{ fontSize: '1.0625rem', fontWeight: 400, color: '#64748b', lineHeight: 1.65, marginBottom: '2.5rem' }}>
                        Precision crop recommendations, real-time market intelligence, and yield forecasting — all in one platform.
                    </p>

                    {/* Feature cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {features.map(({ icon: Icon, label, desc, color, bg }, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
                                    borderRadius: '0.875rem', background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    transition: 'background 0.2s, border-color 0.2s',
                                }}
                                whileHover={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '0.75rem', flexShrink: 0,
                                    background: bg, border: `1px solid ${color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon style={{ width: 18, height: 18, color }} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#cbd5e1', marginBottom: 2 }}>{label}</p>
                                    <p style={{ fontSize: '0.8125rem', color: '#475569' }}>{desc}</p>
                                </div>
                                <Zap style={{ width: 14, height: 14, color, marginLeft: 'auto', opacity: 0.5 }} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p style={{ fontSize: '0.625rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.12em', position: 'relative', zIndex: 1 }}>
                    © 2026 AgroInsight • AI Engine v1.0.4
                </p>
            </div>

            {/* ── Right Form Panel ── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                    style={{ width: '100%', maxWidth: 420 }}>

                    {/* Mobile logo */}
                    <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '0.875rem',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 0 20px rgba(16,185,129,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <Sprout style={{ width: 22, height: 22, color: '#fff' }} />
                        </div>
                        <p style={{ fontWeight: 900, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                            Agro<span style={{ color: 'var(--emerald-400)' }}>Insight</span>
                        </p>
                    </div>

                    {/* Heading */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0.375rem' }}>
                            {isLogin ? 'Welcome back 👋' : 'Create account'}
                        </h2>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                            {isLogin ? 'Sign in to your farm dashboard.' : 'Start your AI-powered farming journey.'}
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div style={{
                        display: 'flex', padding: '0.25rem', borderRadius: '0.875rem', marginBottom: '1.75rem', gap: '0.25rem',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    }}>
                        {[{ val: true, label: 'Sign In', Icon: LogIn }, { val: false, label: 'Sign Up', Icon: UserPlus }].map(({ val, label, Icon }) => (
                            <button key={label} onClick={() => setIsLogin(val)} style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                                padding: '0.625rem', borderRadius: '0.625rem', cursor: 'pointer', border: 'none',
                                fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.2s',
                                background: isLogin === val ? 'rgba(16,185,129,0.12)' : 'transparent',
                                color: isLogin === val ? 'var(--emerald-400)' : 'var(--text-muted)',
                                boxShadow: isLogin === val ? 'inset 0 0 12px rgba(16,185,129,0.08)' : 'none',
                                borderColor: isLogin === val ? 'rgba(16,185,129,0.2)' : 'transparent',
                                borderWidth: 1, borderStyle: 'solid',
                            }}>
                                <Icon style={{ width: 15, height: 15 }} />{label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }} onSubmit={handleSubmit}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

                            {!isLogin && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                        Full Name
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <User style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }} />
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                                            required={!isLogin} placeholder="John Doe"
                                            className="input-glass" style={{ paddingLeft: '2.75rem' }} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }} />
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        required placeholder="farmer@example.com"
                                        className="input-glass" style={{ paddingLeft: '2.75rem' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }} />
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                                        required placeholder="••••••••"
                                        className="input-glass" style={{ paddingLeft: '2.75rem' }} />
                                </div>
                            </div>

                            {error && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        color: '#fca5a5', fontSize: '0.875rem', fontWeight: 600, padding: '0.75rem 1rem',
                                        borderRadius: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)',
                                    }}>
                                    {error}
                                </motion.p>
                            )}

                            <button type="submit" disabled={loading} className="btn-primary"
                                style={{ width: '100%', padding: '0.9375rem', borderRadius: '0.875rem', marginTop: '0.25rem', fontSize: '1rem', letterSpacing: '0.01em' }}>
                                {loading
                                    ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                                    : <>{isLogin ? 'Enter Dashboard' : 'Create Account'} <ArrowRight style={{ width: 17, height: 17 }} /></>
                                }
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                                🔒 Secure authentication powered by JWT
                            </p>
                        </motion.form>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;
