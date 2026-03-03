import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Beaker, Zap, Activity, Database, Info, ChevronRight, RotateCcw, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';

const RecommendationResult = ({ result, setResult }) => {
    if (!result) return null;

    const crop = result.prediction?.crop || result.crop;
    const irrigation = result.prediction?.irrigation || result.irrigation;
    const yieldVal = result.prediction?.yield || result.yield;
    const market = result.market || result.prediction?.marketPrice;

    const irrigationConfig = {
        High: { color: '#f87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
        Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)' },
        Low: { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)' },
    };
    const irr = irrigationConfig[irrigation] || irrigationConfig.Medium;

    const statCards = [
        { label: 'Irrigation', value: irrigation, icon: Droplets, bg: irr.bg, border: irr.border, textColor: irr.color },
        { label: 'Est. Yield', value: yieldVal ? `${yieldVal} T/Ha` : '—', icon: Activity, bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', textColor: '#a5b4fc' },
    ];

    if (market) {
        statCards.push(
            { label: 'Market $/Ton', value: `$${market.pricePerTon || market}`, icon: TrendingUp, bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.25)', textColor: '#34d399' },
            { label: 'Revenue Est.', value: market.estimatedRevenue ? `$${market.estimatedRevenue.toLocaleString()}` : '—', icon: Beaker, bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.25)', textColor: '#fbbf24' },
        );
    }

    const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
    const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

    return (
        <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="card overflow-hidden"
        >
            {/* Glow accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)' }} />

            <div className="relative z-10 p-8 md:p-12">
                {/* Badge */}
                <div className="flex justify-center mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
                        AI Recommendation Generated
                    </span>
                </div>

                {/* Crop name */}
                <div className="text-center mb-10">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Predicted Target Crop</p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="font-black capitalize tracking-tighter text-slate-100"
                        style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', lineHeight: 1, textShadow: '0 0 60px rgba(16,185,129,0.2)' }}
                    >
                        {crop}
                    </motion.h2>
                </div>

                {/* Stat cards */}
                <motion.div variants={container} initial="hidden" animate="show"
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {statCards.map(({ label, value, icon: Icon, bg, border, textColor }) => (
                        <motion.div key={label} variants={item}
                            className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center"
                            style={{ background: bg, border: `1px solid ${border}` }}>
                            <Icon className="w-4 h-4" style={{ color: textColor }} />
                            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</p>
                            <p className="text-sm font-black" style={{ color: textColor }}>{value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Fertilizer advisory */}
                {result.fertilizer && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="pt-8 mt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Beaker className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Fertilizer Advisory</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[
                                { label: 'Nitrogen', value: result.fertilizer.N, icon: Zap, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
                                { label: 'Phosphorus', value: result.fertilizer.P, icon: Activity, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                                { label: 'Potassium', value: result.fertilizer.K, icon: Database, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
                            ].map(({ label, value, icon: Icon, color, bg }) => (
                                <div key={label} className="p-3 rounded-2xl flex items-center gap-3"
                                    style={{ background: bg, border: `1px solid ${color}25` }}>
                                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                                    <div>
                                        <p className="text-[9px] font-black uppercase" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                        <p className="text-xs font-black mt-0.5" style={{ color: value === 'Optimal' ? '#34d399' : 'var(--text-primary)' }}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {result.fertilizer.summary?.length > 0 && (
                            <div className="rounded-xl p-4 space-y-1.5"
                                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                                    <Info className="w-3 h-3 text-emerald-500" /> Improvement Notes
                                </p>
                                {result.fertilizer.summary.map((note, i) => (
                                    <p key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                        <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />{note}
                                    </p>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Reset */}
                <div className="flex justify-center mt-8">
                    <button onClick={() => setResult(null)}
                        className="btn-ghost text-xs px-5 py-2.5 flex items-center gap-2 rounded-xl">
                        <RotateCcw className="w-3.5 h-3.5" /> New Analysis
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default RecommendationResult;
