import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const NutrientBar = ({ label, value, max, colorClass }) => (
    <div className="space-y-1">
        {label && (
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <span>{label}</span>
                <span>{value} / {max}</span>
            </div>
        )}
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value / max) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full shadow-sm", colorClass)}
            />
        </div>
    </div>
);

export default NutrientBar;
