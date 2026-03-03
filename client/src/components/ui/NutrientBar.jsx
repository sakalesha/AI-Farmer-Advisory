import React from 'react';
import { motion } from 'framer-motion';

const colorMap = {
    'bg-blue-500': { fill: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },
    'bg-emerald-500': { fill: '#10b981', glow: 'rgba(16,185,129,0.4)' },
    'bg-purple-500': { fill: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
    'bg-indigo-500': { fill: '#6366f1', glow: 'rgba(99,102,241,0.4)' },
    'bg-orange-500': { fill: '#f97316', glow: 'rgba(249,115,22,0.4)' },
};

const NutrientBar = ({ label, value, max, colorClass }) => {
    const pct = Math.min((value / max) * 100, 100);
    const colors = colorMap[colorClass] || { fill: '#10b981', glow: 'rgba(16,185,129,0.4)' };

    return (
        <div className="space-y-1.5">
            {label && (
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    <span>{label}</span>
                    <span style={{ color: colors.fill }}>{value} / {max}</span>
                </div>
            )}
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: colors.fill, boxShadow: `0 0 8px ${colors.glow}` }}
                />
            </div>
        </div>
    );
};

export default NutrientBar;
