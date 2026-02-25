import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, ArrowRight, TrendingUp } from 'lucide-react';

const SectorComparison = ({ items, onClose }) => {
    if (!items || items.length < 2) return null;

    const [a, b] = items;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-900 border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-xl">
                            <Scale className="text-emerald-400 w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Field Comparison</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="text-white/60 w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Comparison Cards */}
                    {[a, b].map((item, idx) => (
                        <div key={item._id} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className={`text-4xl font-black ${idx === 0 ? 'text-indigo-400' : 'text-emerald-400'}`}>
                                    {idx === 0 ? 'A' : 'B'}
                                </span>
                                <div>
                                    <h3 className="text-2xl font-bold text-white uppercase italic">{item.prediction.crop}</h3>
                                    <p className="text-white/40 text-sm">{new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* NPK Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                {['N', 'P', 'K'].map(nutrient => (
                                    <div key={nutrient} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                        <p className="text-xs text-white/40 uppercase font-bold">{nutrient}</p>
                                        <p className="text-lg font-mono text-white">{item.inputs[nutrient]}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Environmental */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                                    <span className="text-white/40">pH Level</span>
                                    <span className="text-white font-mono">{item.inputs.ph}</span>
                                </div>
                                <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                                    <span className="text-white/40">Rainfall</span>
                                    <span className="text-white font-mono">{item.inputs.rainfall} mm</span>
                                </div>
                            </div>

                            {/* Outcomes */}
                            <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-white/10 rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-400 font-bold">Est. Yield</span>
                                    <span className="text-2xl font-black text-white">{item.prediction.yield} T <span className="text-xs text-white/40 font-normal">/Ha</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-400 font-bold">Profit Potential</span>
                                    <span className="text-2xl font-black text-white">${item.prediction.estimatedRevenue?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Insight */}
                <div className="p-8 pt-0">
                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                        <div className="flex items-center gap-4">
                            <TrendingUp className="text-emerald-400 w-10 h-10" />
                            <div>
                                <p className="text-emerald-400 font-bold text-lg">Optimal Choice</p>
                                <p className="text-white/60">Based on profit potential and yield efficiency.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-white/40 line-through text-xl">
                                {a.prediction.estimatedRevenue > b.prediction.estimatedRevenue ? b.prediction.crop : a.prediction.crop}
                            </span>
                            <ArrowRight className="text-white/40" />
                            <span className="text-3xl font-black text-white uppercase italic">
                                {a.prediction.estimatedRevenue > b.prediction.estimatedRevenue ? a.prediction.crop : b.prediction.crop}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SectorComparison;
