import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Zap, Activity, Database, Info, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const HistoryLog = ({ history }) => {
    return (
        <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col max-h-[calc(100vh-160px)]">
            <div className="p-8 border-b border-emerald-500/10 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <History className="text-emerald-500 w-6 h-6" />
                    Audit Log
                </h2>
                <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-md">
                    {history.length}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {history.length > 0 ? (
                    <AnimatePresence initial={false}>
                        {history.map((item, index) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={item._id}
                                className="bg-white/50 hover:bg-white p-5 rounded-3xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-default group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-black text-lg text-emerald-900 capitalize group-hover:text-emerald-600 transition-colors">
                                        {item.prediction.crop}
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-[0.1em]",
                                        item.prediction.irrigation === 'High' ? "bg-rose-50 text-rose-600" :
                                            item.prediction.irrigation === 'Medium' ? "bg-amber-50 text-amber-600" :
                                                "bg-emerald-50 text-emerald-600"
                                    )}>
                                        {item.prediction.irrigation} Water
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                                    <span className="flex items-center gap-1 text-blue-500/70"><Zap className="w-3 h-3" /> N:{item.inputs.N}</span>
                                    <span className="flex items-center gap-1 text-emerald-500/70"><Activity className="w-3 h-3" /> P:{item.inputs.P}</span>
                                    <span className="flex items-center gap-1 text-purple-500/70"><Database className="w-3 h-3" /> K:{item.inputs.K}</span>
                                </div>

                                {item.fertilizer && item.fertilizer.N !== 'Optimal' && (
                                    <div className="mt-2 text-[8px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                                        <Info className="w-2.5 h-2.5" /> Actionable Advice Available
                                    </div>
                                )}

                                <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                                    <div className="text-[10px] text-slate-300 font-medium">
                                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-20">
                        <History className="w-16 h-16 mx-auto mb-4 text-emerald-100" />
                        <p className="text-slate-400 font-bold text-sm">No analysis history found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryLog;
