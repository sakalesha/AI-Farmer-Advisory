import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Beaker, Zap, Activity, Database, Info, ChevronRight, RotateCcw, TrendingUp, Sparkles } from 'lucide-react';

const RecommendationResult = ({ result, setResult }) => {
    if (!result) return null;

    const crop = result.prediction?.crop || result.crop;
    const irrigation = result.prediction?.irrigation || result.irrigation;
    const yieldVal = result.prediction?.yield || result.yield;
    const market = result.market || result.prediction?.marketPrice;

    const irrigationConfig = {
        High: { color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', glow: 'rgba(239,68,68,0.15)' },
        Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', glow: 'rgba(251,191,36,0.12)' },
        Low: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', glow: 'rgba(52,211,153,0.15)' },
    };
    const irr = irrigationConfig[irrigation] || irrigationConfig.Medium;

    const statCards = [
        { label: 'Irrigation Need', value: irrigation || '—', icon: Droplets, bg: irr.bg, border: irr.border, textColor: irr.color, glow: irr.glow },
        { label: 'Estimated Yield', value: yieldVal ? `${yieldVal} T/Ha` : '—', icon: Activity, bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', textColor: '#a5b4fc', glow: 'rgba(99,102,241,0.12)' },
    ];
    if (market) {
        statCards.push(
            { label: 'Market Price', value: `₹${Number(market.pricePerTon || market).toLocaleString('en-IN')}/T`, icon: TrendingUp, bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', textColor: '#34d399', glow: 'rgba(16,185,129,0.15)' },
            { label: 'Est. Revenue', value: market.estimatedRevenue ? `₹${Number(market.estimatedRevenue).toLocaleString('en-IN')}` : '—', icon: Beaker, bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', textColor: '#fbbf24', glow: 'rgba(251,191,36,0.12)' },
        );
    }

    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
    const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

    return (
        <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }} className="card" style={{ overflow: 'hidden' }}>

            {/* Top glow layer */}
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '100%', height: 280,
                background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 65%)',
                pointerEvents: 'none',
            }} />

            {/* Subtle grid pattern */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.03,
                backgroundImage: 'linear-gradient(var(--border-muted) 1px, transparent 1px), linear-gradient(90deg, var(--border-muted) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(1.5rem, 5vw, 3rem)' }}>

                {/* Success badge */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <motion.span initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1.25rem', borderRadius: 99,
                            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                            color: '#34d399', fontWeight: 700, fontSize: '0.875rem',
                            boxShadow: '0 0 20px rgba(16,185,129,0.15)',
                        }}>
                        <Sparkles style={{ width: 14, height: 14 }} />
                        AI Recommendation Ready
                    </motion.span>
                </div>

                {/* Crop name hero */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <p className="section-label" style={{ marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                        Best Crop For Your Field
                    </p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        style={{
                            fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'capitalize',
                            fontSize: 'clamp(3rem, 10vw, 5.5rem)', lineHeight: 1,
                            background: 'linear-gradient(135deg, #f0f6ff 0%, #34d399 50%, #6ee7b7 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 32px rgba(16,185,129,0.3))',
                        }}>
                        {crop}
                    </motion.h2>
                </div>

                {/* Stat cards */}
                <motion.div variants={stagger} initial="hidden" animate="show"
                    style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(statCards.length, 4)}, 1fr)`, gap: '0.875rem', marginBottom: '2.5rem' }}>
                    {statCards.map(({ label, value, icon: Icon, bg, border, textColor, glow }) => (
                        <motion.div key={label} variants={item}
                            style={{
                                borderRadius: '1rem', padding: '1.125rem', textAlign: 'center',
                                background: bg, border: `1px solid ${border}`,
                                boxShadow: `0 0 20px ${glow}`,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem',
                            }}>
                            <div style={{ width: 32, height: 32, borderRadius: '0.625rem', background: `${textColor}1A`, border: `1px solid ${textColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                                <Icon style={{ width: 15, height: 15, color: textColor }} />
                            </div>
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
                            <p style={{ fontWeight: 900, fontSize: '1rem', color: textColor, lineHeight: 1.2 }}>{value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Fertilizer advisory */}
                {result.fertilizer && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        style={{ paddingTop: '1.75rem', borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '0.625rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Beaker style={{ width: 15, height: 15, color: 'var(--emerald-400)' }} />
                            </div>
                            <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-secondary)' }}>
                                Fertilizer Recommendation
                            </h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                            {[
                                { label: 'Nitrogen (N)', value: result.fertilizer.N, icon: Zap, color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
                                { label: 'Phosphorus (P)', value: result.fertilizer.P, icon: Activity, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
                                { label: 'Potassium (K)', value: result.fertilizer.K, icon: Database, color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)' },
                            ].map(({ label, value, icon: Icon, color, bg, border }) => (
                                <div key={label} style={{
                                    padding: '1rem', borderRadius: '0.875rem', background: bg,
                                    border: `1px solid ${border}`, display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
                                }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '0.5rem', background: `${color}18`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon style={{ width: 13, height: 13, color }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
                                        <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: value === 'Optimal' ? '#34d399' : 'var(--text-primary)' }}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {result.fertilizer.summary?.length > 0 && (
                            <div style={{ borderRadius: '0.875rem', padding: '1rem 1.25rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                                <p style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Info style={{ width: 14, height: 14, color: '#34d399' }} /> Improvement Notes
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                    {result.fertilizer.summary.map((note, i) => (
                                        <p key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                                            <ChevronRight style={{ width: 14, height: 14, color: '#34d399', marginTop: 3, flexShrink: 0 }} />{note}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Reset */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <button onClick={() => setResult(null)} className="btn-ghost"
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '0.875rem' }}>
                        <RotateCcw style={{ width: 15, height: 15 }} /> Analyse Another Field
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default RecommendationResult;
