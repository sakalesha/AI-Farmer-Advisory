import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Beaker, Zap, Activity, Database, Info, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const RecommendationResult = ({ result, setResult }) => {
    if (!result) return null;

    return (
        <motion.div
            key="result"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card-dark rounded-[2.5rem] overflow-hidden group border border-emerald-500/20"
        >
            <div className="p-8 md:p-12 text-center relative overflow-hidden">
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

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="space-y-4">
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest text-center md:text-left">Irrigation Index</p>
                            <div className={cn(
                                "px-8 py-4 rounded-3xl font-black text-2xl flex items-center gap-3 shadow-xl",
                                result.irrigation === 'High' ? "bg-rose-500 text-white shadow-rose-200" :
                                    result.irrigation === 'Medium' ? "bg-amber-500 text-white shadow-amber-200" :
                                        "bg-emerald-500 text-white shadow-emerald-200"
                            )}>
                                <Droplets className="w-8 h-8" />
                                {result.irrigation}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest text-center md:text-left">Est. Yield</p>
                            <div className="px-8 py-4 rounded-3xl font-black text-2xl flex items-center gap-3 bg-blue-600 text-white shadow-xl shadow-blue-100">
                                <Activity className="w-8 h-8" />
                                {result.yield} <span className="text-xs opacity-70">T/Ha</span>
                            </div>
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
    );
};

export default RecommendationResult;
