import React from 'react';
import { Sprout, LayoutDashboard, BarChart3, LineChart, LogOut, User as UserIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { id: 'dashboard', label: 'Advisory', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'market', label: 'Live Market', icon: LineChart },
];

const Navbar = ({ user, logout, view, setView }) => {
    return (
        <>
            {/* ── Desktop Sidebar ── */}
            <aside className="sidebar">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 16px rgba(16,185,129,0.4)' }}>
                        <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-100 tracking-tight leading-none">Agro<span className="text-emerald-400">Insight</span></p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">AGRI-AI PLATFORM</p>
                    </div>
                </div>

                {/* Live indicator */}
                <div className="flex items-center gap-2 px-3 py-2 mb-6 bg-emerald-500/8 rounded-xl border border-emerald-500/15">
                    <span className="live-dot" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">System Live</span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setView(id)}
                            className={`sidebar-nav-item ${view === id ? 'active' : ''}`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                            {view === id && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* User section */}
                <div className="mt-auto border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-200 truncate">{user?.fullName}</p>
                            <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Farmer Account</p>
                        </div>
                        <button
                            onClick={logout}
                            title="Sign out"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Mobile Bottom Nav ── */}
            <nav className="bottom-nav justify-around">
                {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setView(id)}
                        className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider ${view === id
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                            }`}
                    >
                        <Icon className={`w-5 h-5 ${view === id ? 'text-emerald-400' : 'text-slate-500'}`} />
                        {label}
                    </button>
                ))}
                <button
                    onClick={logout}
                    className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-wider"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </nav>
        </>
    );
};

export default Navbar;
