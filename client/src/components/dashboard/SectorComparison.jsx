import React from 'react';
import { motion } from 'framer-motion';
import { X, Scale, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SectorComparison = ({ items, onClose }) => {
    if (!items || items.length < 2) return null;

    const [a, b] = items;

    const renderDelta = (valA, valB, invert = false) => {
        const numA = parseFloat(valA) || 0;
        const numB = parseFloat(valB) || 0;
        if (numA === numB) return <Minus style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />;
        const diff = (numB - numA).toFixed(1);
        const isBetter = invert ? numB < numA : numB > numA;
        
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: isBetter ? 'var(--emerald-600)' : 'var(--indigo-500)', fontSize: '0.75rem', fontWeight: 800, background: isBetter ? 'var(--emerald-glow)' : 'var(--indigo-glow)', padding: '2px 6px', borderRadius: 4 }}>
                {isBetter ? <TrendingUp style={{ width: 12, height: 12 }} /> : <TrendingDown style={{ width: 12, height: 12 }} />}
                {diff > 0 ? `+${diff}` : diff}
            </div>
        );
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="card"
                style={{ width: '100%', maxWidth: 900, maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-base)' }}
            >
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'var(--emerald-glow)', padding: '0.5rem', borderRadius: '0.75rem' }}>
                            <Scale style={{ width: 24, height: 24, color: 'var(--emerald-600)' }} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>Scenario Comparison</h2>
                    </div>
                    <button onClick={onClose} style={{ padding: '0.5rem', background: 'var(--bg-hover)', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                        <X style={{ width: 20, height: 20, color: 'var(--text-secondary)' }} />
                    </button>
                </div>

                <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Comparison Cards */}
                    {[a, b].map((item, idx) => (
                        <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 900, color: idx === 0 ? 'var(--text-muted)' : 'var(--emerald-500)', lineHeight: 1 }}>
                                    {idx === 0 ? 'A' : 'B'}
                                </span>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{item.prediction.crop || item.crop}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* NPK Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                {['N', 'P', 'K'].map(nutrient => (
                                    <div key={nutrient} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center', position: 'relative' }}>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{nutrient}</p>
                                        <p style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-primary)' }}>{item.inputs?.[nutrient] || item[nutrient] || 0}</p>
                                        {idx === 1 && (
                                            <div style={{ position: 'absolute', top: -8, right: -8 }}>
                                                {renderDelta(a.inputs?.[nutrient] || a[nutrient], b.inputs?.[nutrient] || b[nutrient])}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Environmental */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-elevated)', borderRadius: '0.75rem', border: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>pH Level</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{item.inputs?.ph || item.ph || 0}</span>
                                        {idx === 1 && renderDelta(a.inputs?.ph || a.ph, b.inputs?.ph || b.ph)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-elevated)', borderRadius: '0.75rem', border: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Rainfall</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{item.inputs?.rainfall || item.rainfall || 0} mm</span>
                                        {idx === 1 && renderDelta(a.inputs?.rainfall || a.rainfall, b.inputs?.rainfall || b.rainfall)}
                                    </div>
                                </div>
                            </div>

                            {/* Outcomes */}
                            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                                {idx === 1 && <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--emerald-600)', fontWeight: 800, fontSize: '0.85rem' }}>Est. Yield</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>{item.prediction?.yield || item.yield} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>/Ha</span></span>
                                        {idx === 1 && renderDelta(a.prediction?.yield || a.yield, b.prediction?.yield || b.yield, false)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--emerald-600)', fontWeight: 800, fontSize: '0.85rem' }}>Profit Potential</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>₹{(item.prediction?.estimatedRevenue || item.estimatedRevenue || 0).toLocaleString('en-IN')}</span>
                                        {idx === 1 && renderDelta(a.prediction?.estimatedRevenue || a.estimatedRevenue, b.prediction?.estimatedRevenue || b.estimatedRevenue, false)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Insight */}
                <div style={{ padding: '0 2rem 2rem' }}>
                    <div style={{ background: 'var(--emerald-glow)', border: '1px solid var(--border-accent)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <TrendingUp style={{ color: 'var(--emerald-600)', width: 32, height: 32 }} />
                            <div>
                                <p style={{ color: 'var(--emerald-600)', fontWeight: 800, fontSize: '1rem' }}>Optimal Choice</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>Based on profit potential and yield efficiency.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.125rem', fontWeight: 700, textTransform: 'capitalize' }}>
                                {(a.prediction?.estimatedRevenue || a.estimatedRevenue) > (b.prediction?.estimatedRevenue || b.estimatedRevenue) ? (b.prediction?.crop || b.crop) : (a.prediction?.crop || a.crop)}
                            </span>
                            <ArrowRight style={{ color: 'var(--text-muted)', width: 20, height: 20 }} />
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--emerald-600)', textTransform: 'capitalize' }}>
                                {(a.prediction?.estimatedRevenue || a.estimatedRevenue) > (b.prediction?.estimatedRevenue || b.estimatedRevenue) ? (a.prediction?.crop || a.crop) : (b.prediction?.crop || b.crop)}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SectorComparison;
