import React from 'react';
import { Sprout, Activity, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = ({ user, logout }) => {
    return (
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
    );
};

export default Navbar;
