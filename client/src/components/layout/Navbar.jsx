import React from 'react';
import { Sprout, LayoutDashboard, BarChart3, LineChart, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
    { id: 'dashboard', label: 'Crop Advisory', icon: LayoutDashboard },
    { id: 'analytics', label: 'My Analytics', icon: BarChart3 },
    { id: 'market', label: 'Market Prices', icon: LineChart },
];

const Navbar = ({ user, logout, view, setView }) => {
    const { theme, toggleTheme } = useTheme();

    const initials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <>
            {/* ── Desktop Sidebar ── */}
            <aside className="sidebar">

                {/* Logo */}
                <div style={{ padding: '0 0.25rem', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: 44, height: 44,
                            borderRadius: '0.875rem',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 0 20px rgba(16,185,129,0.45)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Sprout style={{ width: 22, height: 22, color: '#fff' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 900, fontSize: '1.0625rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                Agro<span style={{ color: 'var(--emerald-400)' }}>Insight</span>
                            </p>
                            <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 2 }}>
                                AI Farm Platform
                            </p>
                        </div>
                    </div>
                </div>

                {/* Live status */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.6rem 0.875rem', marginBottom: '1rem', borderRadius: '0.75rem',
                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
                }}>
                    <div className="live-dot" />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--emerald-400)' }}>
                        System Live
                    </span>
                </div>

                {/* Theme toggle */}
                <button onClick={toggleTheme} style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.6rem 0.875rem', marginBottom: '1.5rem',
                    borderRadius: '0.75rem', width: '100%', cursor: 'pointer',
                    background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)',
                    transition: 'background 0.2s, border-color 0.2s',
                }} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                    <div style={{ color: theme === 'dark' ? '#fbbf24' : '#818cf8', display: 'flex' }}>
                        {theme === 'dark' ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', flex: 1 }}>
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    {/* Toggle pill */}
                    <div style={{
                        width: 36, height: 20, borderRadius: 99, position: 'relative', flexShrink: 0,
                        background: theme === 'dark' ? 'rgba(251,191,36,0.2)' : 'rgba(129,140,248,0.2)',
                        transition: 'background 0.3s',
                    }}>
                        <div style={{
                            position: 'absolute', top: 3, width: 14, height: 14, borderRadius: '50%',
                            background: theme === 'dark' ? '#fbbf24' : '#818cf8',
                            left: theme === 'dark' ? 3 : 19,
                            transition: 'left 0.25s, background 0.25s',
                        }} />
                    </div>
                </button>

                {/* Nav label */}
                <p className="section-label" style={{ padding: '0 0.75rem', marginBottom: '0.375rem' }}>Navigation</p>

                {/* Nav items */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setView(id)}
                            className={`sidebar-nav-item ${view === id ? 'active' : ''}`}>
                            <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                            <span>{label}</span>
                            {view === id && (
                                <motion.div layoutId="nav-pill"
                                    style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald-400)', boxShadow: '0 0 8px var(--emerald-400)' }} />
                            )}
                        </button>
                    ))}
                </nav>

                {/* User card */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.5rem' }}>
                        {/* Avatar */}
                        <div style={{
                            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(99,102,241,0.25))',
                            border: '1.5px solid rgba(16,185,129,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--emerald-400)' }}>{initials}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.fullName}
                            </p>
                            <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Farmer Account</p>
                        </div>
                        <button onClick={logout} title="Sign out" style={{
                            padding: '0.375rem', borderRadius: '0.5rem', cursor: 'pointer',
                            color: 'var(--text-muted)', background: 'transparent', border: 'none',
                            display: 'flex', transition: 'color 0.2s, background 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                            <LogOut style={{ width: 15, height: 15 }} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Mobile Bottom Nav ── */}
            <nav className="bottom-nav" style={{ justifyContent: 'space-around' }}>
                {navItems.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setView(id)} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: '0.2rem', padding: '0.4rem 0.5rem', borderRadius: '0.625rem',
                        cursor: 'pointer', border: 'none', background: view === id ? 'rgba(16,185,129,0.1)' : 'transparent',
                        color: view === id ? 'var(--emerald-400)' : 'var(--text-muted)',
                        fontSize: '0.625rem', fontWeight: 700, transition: 'all 0.2s',
                    }}>
                        <Icon style={{ width: 20, height: 20 }} />
                        <span>{label.split(' ')[0]}</span>
                    </button>
                ))}
                <button onClick={toggleTheme} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '0.2rem', padding: '0.4rem 0.5rem', borderRadius: '0.625rem',
                    cursor: 'pointer', border: 'none', background: 'transparent',
                    color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 700,
                }}>
                    {theme === 'dark'
                        ? <Sun style={{ width: 20, height: 20, color: '#fbbf24' }} />
                        : <Moon style={{ width: 20, height: 20, color: '#818cf8' }} />
                    }
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
                <button onClick={logout} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '0.2rem', padding: '0.4rem 0.5rem', borderRadius: '0.625rem',
                    cursor: 'pointer', border: 'none', background: 'transparent',
                    color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 700,
                }}>
                    <LogOut style={{ width: 20, height: 20 }} />
                    <span>Out</span>
                </button>
            </nav>
        </>
    );
};

export default Navbar;
