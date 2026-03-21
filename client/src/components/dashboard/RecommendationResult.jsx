import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Droplets, Beaker, Zap, Activity, Database, Info, ChevronRight, RotateCcw, TrendingUp, Sparkles, FileText, Send, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const RecommendationResult = ({ result, setResult }) => {
    const { t } = useTranslation();
    const [hectares, setHectares] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const reportRef = useRef(null);

    const exportPDF = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`AI_Advisory_${result.prediction?.crop || 'Report'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF', error);
        } finally {
            setIsExporting(false);
        }
    };

    if (!result) return null;

    const crop = result.prediction?.crop || result.crop;
    const confidence = result.prediction?.confidence || null;
    const irrigation = result.prediction?.irrigation || result.irrigation;
    const yieldVal = result.prediction?.yield || result.yield;
    const yieldInterval = result.prediction?.yieldInterval || result.yieldInterval;
    const market = result.market || result.prediction?.marketPrice;

    const pricePerTon = market?.pricePerTon || 0;
    const projectedRevenue = yieldVal && pricePerTon ? Math.round(yieldVal * pricePerTon * hectares) : null;

    const irrigationConfig = {
        High: { color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
        Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
        Low: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
    };
    const irr = irrigationConfig[irrigation] || irrigationConfig.Medium;

    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
    const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

    return (
        <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }} className="card" style={{ overflow: 'hidden' }} ref={reportRef}>

            {/* Top glow layer */}
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '100%', height: 280,
                background: 'radial-gradient(ellipse at 50% 0%, rgba(45,107,48,0.08) 0%, transparent 65%)',
                pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
                
                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                            Field Advisor Report
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={exportPDF} disabled={isExporting} className="btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem' }}>
                            {isExporting ? <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} /> : <FileText style={{ width: 14, height: 14 }} />} PDF
                        </button>
                        <a href={`https://wa.me/?text=My field is recommended for ${crop}. Estimated yield: ${yieldVal} T/Ha.`} target="_blank" rel="noreferrer" 
                           className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', background: '#25D366' }}>
                            <Send style={{ width: 14, height: 14 }} /> Share
                        </a>
                    </div>
                </div>

                {/* Section A: Hero & Confidence */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <motion.span initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1.25rem', borderRadius: 99,
                            background: 'var(--emerald-glow)', border: '1px solid var(--border-accent)',
                            color: 'var(--emerald-600)', fontWeight: 800, fontSize: '0.875rem',
                        }}>
                        <Sparkles style={{ width: 14, height: 14 }} /> Recommended Crop
                    </motion.span>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="heading-display"
                        style={{
                            fontWeight: 700, textTransform: 'capitalize',
                            fontSize: 'clamp(3rem, 10vw, 5.5rem)', lineHeight: 1,
                            color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '1.5rem'
                        }}>
                        🌾 {t(`crops.${crop.toLowerCase()}`, crop)}
                    </motion.h2>

                    {/* Confidence Score (Conditional) */}
                    {confidence && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ maxWidth: 400, margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Model Confidence</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: confidence > 85 ? 'var(--emerald-500)' : 'var(--gold-500)' }}>{confidence}%</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                                <motion.div 
                                    initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                                    style={{ height: '100%', background: confidence > 85 ? 'var(--emerald-500)' : 'var(--gold-500)' }} 
                                />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Grid container for Sections B, C, D */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                
                    {/* Section C: Field Conditions & Yield */}
                    <motion.div variants={item} initial="hidden" animate="show" style={{ background: 'var(--bg-elevated)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity style={{ width: 16, height: 16, color: 'var(--indigo-500)' }} /> Field Intelligence
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border-muted)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('results.irrigation', 'Irrigation Need')}</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: irr.color, background: irr.bg, padding: '0.2rem 0.6rem', borderRadius: 4 }}>{irrigation || '—'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border-muted)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('results.yield', 'Estimated Yield')}</span>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{yieldVal ? `${yieldVal} T/Ha` : '—'}</span>
                                    {yieldInterval && (
                                        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
                                            Range: {yieldInterval[0]}–{yieldInterval[1]}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('results.price', 'Market Price')}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--emerald-600)' }}>{pricePerTon ? `₹${Number(pricePerTon).toLocaleString('en-IN')}/T` : '—'}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Section D: Projected Revenue */}
                    <motion.div variants={item} initial="hidden" animate="show" style={{ background: 'var(--bg-elevated)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: 'radial-gradient(circle, rgba(196,98,45,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp style={{ width: 16, height: 16, color: 'var(--indigo-400)' }} /> Projected Revenue
                        </h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Farm Size:</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-muted)', borderRadius: 6, overflow: 'hidden' }}>
                                <input type="number" min="0.1" step="0.1" value={hectares} onChange={e => setHectares(parseFloat(e.target.value) || 0)} 
                                       style={{ width: 60, padding: '0.3rem 0.5rem', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontWeight: 700, outline: 'none', textAlign: 'right' }} />
                                <span style={{ padding: '0.3rem 0.5rem', background: 'var(--bg-hover)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderLeft: '1px solid var(--border-muted)' }}>Hectares</span>
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('results.revenue', 'Estimated Total Value')}</p>
                            <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--indigo-500)', fontFamily: 'Fraunces, serif' }}>
                                {projectedRevenue ? `₹${projectedRevenue.toLocaleString('en-IN')}` : '—'}
                            </p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Yield × Price × Hectares</p>
                        </div>
                    </motion.div>
                </div>

                {/* Section B: Fertilizer Plan */}
                {result.fertilizer && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        style={{ paddingTop: '2rem', marginTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '0.625rem', background: 'var(--emerald-glow)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Beaker style={{ width: 15, height: 15, color: 'var(--emerald-600)' }} />
                            </div>
                            <h3 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                                Fertilizer Recommendation
                            </h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            {[ 
                                { label: 'Nitrogen (N) Action', value: result.fertilizer.N, icon: Zap, color: '#3b82f6' },
                                { label: 'Phosphorus (P) Action', value: result.fertilizer.P, icon: Activity, color: '#10b981' },
                                { label: 'Potassium (K) Action', value: result.fertilizer.K, icon: Database, color: '#8b5cf6' },
                            ].map(({ label, value, icon: Icon, color }) => (
                                <div key={label} style={{
                                    padding: '1.25rem', borderRadius: '0.875rem', background: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                                }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon style={{ width: 16, height: 16, color }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
                                        <p style={{ fontWeight: 800, fontSize: '1rem', color: value === 'Optimal' || value.includes('Optimal') ? 'var(--emerald-600)' : 'var(--text-primary)' }}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {result.fertilizer.summary?.length > 0 && (
                            <div style={{ borderRadius: '0.875rem', padding: '1.25rem', background: 'var(--bg-hover)', border: '1px dashed var(--border-muted)' }}>
                                <p style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info style={{ width: 16, height: 16, color: 'var(--emerald-600)' }} /> Actionable Next Steps
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {result.fertilizer.summary.map((note, i) => (
                                        <p key={i} style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5, fontWeight: 500 }}>
                                            <ChevronRight style={{ width: 16, height: 16, color: 'var(--emerald-500)', marginTop: 3, flexShrink: 0 }} />
                                            {note}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Reset */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
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
