import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Zap, Activity, Database, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const cropEmojis = {
    rice: '🌾', wheat: '🌿', maize: '🌽', cotton: '🪴', sugarcane: '🎋',
    jute: '🌱', lentil: '🫘', mungbean: '🫛', blackgram: '⚫', kidneybeans: '🫘',
    pigeonpeas: '🟡', mothbeans: '🫘', muskmelon: '🍈', watermelon: '🍉',
    grapes: '🍇', mango: '🥭', banana: '🍌', pomegranate: '🍎', lemon: '🍋',
    orange: '🍊', papaya: '🍈', coconut: '🥥', apple: '🍎', coffee: '☕',
};

const HistoryLog = ({ history, onSelect, onCompareSelect, selectedItems }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 180px)', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.125rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '0.625rem', flexShrink: 0,
                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <History style={{ width: 16, height: 16, color: '#34d399' }} />
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Analysis History</h2>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Select 2 entries to compare</p>
                    </div>
                </div>
                <span style={{
                    minWidth: 32, padding: '0.2rem 0.625rem', textAlign: 'center',
                    fontSize: '0.75rem', fontWeight: 800, borderRadius: 99,
                    background: 'rgba(16,185,129,0.1)', color: 'var(--emerald-400)', border: '1px solid rgba(16,185,129,0.2)',
                }}>
                    {history.length}
                </span>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
                {history.length > 0 ? (
                    <AnimatePresence initial={false}>
                        {history.map((item, index) => {
                            const isSelected = selectedItems.find(s => s._id === item._id);
                            const emoji = cropEmojis[item.prediction.crop?.toLowerCase()] || '🌱';
                            return (
                                <motion.div key={item._id}
                                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => onSelect(item)}
                                    style={{
                                        position: 'relative', padding: '0.875rem 1rem', borderRadius: '0.875rem',
                                        cursor: 'pointer', marginBottom: '0.5rem',
                                        background: isSelected ? 'rgba(16,185,129,0.07)' : 'var(--bg-elevated)',
                                        border: `1px solid ${isSelected ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`,
                                        borderLeft: `3px solid ${isSelected ? 'var(--emerald-400)' : 'transparent'}`,
                                        boxShadow: isSelected ? '0 0 20px rgba(16,185,129,0.1)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--border-muted)'; } }}
                                    onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; } }}>

                                    {/* Compare toggle */}
                                    <div onClick={e => { e.stopPropagation(); onCompareSelect(item); }}
                                        style={{
                                            position: 'absolute', top: '0.875rem', right: '0.875rem',
                                            width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: isSelected ? 'var(--emerald-500)' : 'transparent',
                                            border: `2px solid ${isSelected ? 'var(--emerald-500)' : 'var(--border-muted)'}`,
                                            transition: 'all 0.2s',
                                            boxShadow: isSelected ? '0 0 10px rgba(16,185,129,0.4)' : 'none',
                                        }}>
                                        {isSelected && <CheckCircle2 style={{ width: 13, height: 13, color: '#fff' }} />}
                                    </div>

                                    <div style={{ paddingRight: '1.75rem' }}>
                                        {/* Crop name with emoji */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '1.125rem' }}>{emoji}</span>
                                            <p style={{
                                                fontWeight: 800, fontSize: '0.9375rem', textTransform: 'capitalize',
                                                color: isSelected ? 'var(--emerald-400)' : 'var(--text-primary)',
                                                transition: 'color 0.2s',
                                            }}>
                                                {item.fieldName && item.fieldName !== 'Unnamed Field' ? `${item.fieldName} (${item.prediction.crop})` : item.prediction.crop}
                                            </p>
                                        </div>

                                        {/* NPK chips */}
                                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                                            <span style={{ padding: '0.15rem 0.5rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                                                N:{item.inputs.N}
                                            </span>
                                            <span style={{ padding: '0.15rem 0.5rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                                                P:{item.inputs.P}
                                            </span>
                                            <span style={{ padding: '0.15rem 0.5rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, background: 'rgba(139,92,246,0.12)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.2)' }}>
                                                K:{item.inputs.K}
                                            </span>
                                        </div>

                                        {/* Bottom row */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                                                <Clock style={{ width: 11, height: 11 }} />
                                                {new Date(item.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--emerald-400)', display: 'flex', alignItems: 'center', gap: '0.15rem', opacity: 0.7 }}>
                                                View <ChevronRight style={{ width: 11, height: 11 }} />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
                        <div style={{
                            width: 60, height: 60, borderRadius: '1rem', marginBottom: '1rem',
                            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.75rem',
                        }}>
                            🌱
                        </div>
                        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>No analyses yet</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            Submit the form to get your first crop recommendation
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryLog;
