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
            <div className="p-8 md:p-12 relative overflow-hidden flex flex-col items-center">
                {/* Background Blur */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />

                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-10 relative z-10"
                >
                    <span className="bg-white/50 backdrop-blur-md text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-emerald-500/20 shadow-sm">
                        AI Recommendation Generated
                    </span>
                </motion.div>

                {/* Main Identity Segment */}
                <div className="w-full text-center space-y-4 mb-10">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Predicted Target Crop</p>
                    <h2 className="text-6xl md:text-8xl font-black text-emerald-950 capitalize tracking-tighter break-words">
                        {result.prediction?.crop || result.crop}
                    </h2>
                </div>

                {/* Separator */}
                <div className="h-px w-full max-w-2xl bg-emerald-500/10 mb-10"></div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto px-4">
                    {/* Irrigation Index card */}
                    <div className="space-y-4 flex flex-col items-center">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center truncate w-full">Irrigation Index</p>
                        <div className={cn(
                            "w-full max-w-[200px] px-6 py-4 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-xl",
                            (result.prediction?.irrigation || result.irrigation) === 'High' ? "bg-rose-500 text-white shadow-rose-200" :
                                (result.prediction?.irrigation || result.irrigation) === 'Medium' ? "bg-amber-500 text-white shadow-amber-200" :
                                    "bg-emerald-500 text-white shadow-emerald-200"
                        )}>
                            <Droplets className="w-5 h-5 shrink-0" />
                            {result.prediction?.irrigation || result.irrigation}
                        </div>
                    </div>

                    {/* Yield card */}
                    <div className="space-y-4 flex flex-col items-center">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center truncate w-full">Est. Yield</p>
                        <div className="w-full max-w-[200px] px-6 py-4 rounded-3xl font-black text-lg flex items-center justify-center gap-3 bg-blue-600 text-white shadow-xl shadow-blue-100">
                            <Activity className="w-5 h-5 shrink-0" />
                            {result.prediction?.yield || result.yield} <span className="text-[10px] opacity-70">T/Ha</span>
                        </div>
                    </div>

                    {/* Market Price card */}
                    {(result.market || result.prediction?.marketPrice) && (
                        <>
                            <div className="space-y-4 flex flex-col items-center">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center truncate w-full">Market Value</p>
                                <div className="w-full max-w-[200px] px-6 py-4 rounded-3xl font-black text-lg flex items-center justify-center gap-3 bg-purple-600 text-white shadow-xl shadow-purple-100 relative">
                                    <Zap className="w-5 h-5 shrink-0" />
                                    ${result.market?.pricePerTon || result.prediction?.marketPrice}
                                    <div className={cn(
                                        "absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-white text-[10px] font-black shadow-sm",
                                        (result.market?.trend || result.prediction?.marketTrend) === 'Up' ? "bg-emerald-500" : (result.market?.trend || result.prediction?.marketTrend) === 'Down' ? "bg-rose-500" : "bg-slate-400"
                                    )}>
                                        {(result.market?.trend || result.prediction?.marketTrend) === 'Up' ? '↑' : (result.market?.trend || result.prediction?.marketTrend) === 'Down' ? '↓' : '→'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 flex flex-col items-center">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center truncate w-full">Profit Potential</p>
                                <div className="w-full max-w-[200px] px-6 py-4 rounded-3xl font-black text-lg flex items-center justify-center gap-3 bg-emerald-600 text-white shadow-xl shadow-emerald-100">
                                    <Beaker className="w-5 h-5 shrink-0" />
                                    ${(result.market?.estimatedRevenue || result.prediction?.estimatedRevenue)?.toLocaleString()}
                                </div>
                            </div>
                        </>
                    )}
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
