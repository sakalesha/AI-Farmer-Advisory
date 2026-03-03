import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Zap, Activity, Database, ChevronRight, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const HistoryLog = ({ history, onSelect, onCompareSelect, selectedItems }) => {
    return (
        <div className="card flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <History className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-200">Audit Log</h2>
                        <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Select 2 to compare</p>
                    </div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--emerald-400)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    {history.length}
                </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {history.length > 0 ? (
                    <AnimatePresence initial={false}>
                        {history.map((item, index) => {
                            const isSelected = selectedItems.find(s => s._id === item._id);
                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    onClick={() => onSelect(item)}
                                    className={cn(
                                        "relative p-4 rounded-2xl cursor-pointer transition-all group",
                                        isSelected
                                            ? "border-emerald-500/40"
                                            : "border-transparent hover:border-emerald-500/20"
                                    )}
                                    style={{
                                        background: isSelected ? 'rgba(16,185,129,0.06)' : 'var(--bg-elevated)',
                                        border: `1px solid ${isSelected ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`,
                                        borderLeft: isSelected ? '3px solid var(--emerald-400)' : '3px solid transparent',
                                    }}
                                >
                                    {/* Compare toggle */}
                                    <div
                                        onClick={e => { e.stopPropagation(); onCompareSelect(item); }}
                                        className={cn(
                                            "absolute top-4 right-4 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                                        )}
                                        style={{
                                            background: isSelected ? 'var(--emerald-500)' : 'transparent',
                                            borderColor: isSelected ? 'var(--emerald-500)' : 'var(--border-muted)',
                                        }}
                                    >
                                        {isSelected && <Zap className="w-2.5 h-2.5 text-white fill-current" />}
                                    </div>

                                    <div className="pr-6">
                                        <p className="text-sm font-black text-slate-200 capitalize mb-2 group-hover:text-emerald-400 transition-colors">
                                            {item.prediction.crop}
                                        </p>
                                        <div className="flex items-center gap-3 text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                                            <span className="flex items-center gap-1 text-blue-400/70"><Zap className="w-2.5 h-2.5" /> N:{item.inputs.N}</span>
                                            <span className="flex items-center gap-1 text-emerald-400/70"><Activity className="w-2.5 h-2.5" /> P:{item.inputs.P}</span>
                                            <span className="flex items-center gap-1 text-purple-400/70"><Database className="w-2.5 h-2.5" /> K:{item.inputs.K}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-2.5"
                                            style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                            <span className="flex items-center gap-1 text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                                <Clock className="w-2.5 h-2.5" />
                                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-[9px] font-bold text-emerald-500/0 group-hover:text-emerald-500 transition-colors flex items-center gap-0.5">
                                                View <ChevronRight className="w-2.5 h-2.5" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                            <History className="w-6 h-6 text-slate-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-500">No history yet</p>
                        <p className="text-xs text-slate-600 mt-1">Run your first analysis above</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryLog;
