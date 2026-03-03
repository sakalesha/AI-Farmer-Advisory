import React from 'react';
import { Activity, Loader2, CloudRain, Beaker, Thermometer, Wind, ShieldCheck, Zap } from 'lucide-react';
import NutrientBar from '../ui/NutrientBar';

const SoilForm = ({ formData, handleInputChange, handleSubmit, handleSyncWeather, loading, weatherLoading }) => {
    const environmentFields = [
        { name: 'ph', label: 'pH Level', placeholder: '6.5', Icon: Beaker, color: 'bg-indigo-500', max: 14, iconColor: '#6366f1' },
        { name: 'temperature', label: 'Temp (°C)', placeholder: '28.4', Icon: Thermometer, color: 'bg-orange-500', max: 50, iconColor: '#f97316' },
        { name: 'humidity', label: 'Humidity (%)', placeholder: '82', Icon: Wind, color: 'bg-blue-500', max: 100, iconColor: '#3b82f6' },
        { name: 'rainfall', label: 'Rainfall (mm)', placeholder: '202', Icon: CloudRain, color: 'bg-emerald-500', max: 300, iconColor: '#10b981' },
    ];

    const nutrientFields = [
        { name: 'N', label: 'Nitrogen (N)', colorClass: 'bg-blue-500', max: 140 },
        { name: 'P', label: 'Phosphorus (P)', colorClass: 'bg-emerald-500', max: 145 },
        { name: 'K', label: 'Potassium (K)', colorClass: 'bg-purple-500', max: 205 },
    ];

    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <Activity className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-black text-slate-100 tracking-tight">Soil Vitality Analysis</h2>
                    </div>
                    <p className="text-xs font-medium ml-11" style={{ color: 'var(--text-muted)' }}>Enter your field parameters for AI cross-referencing.</p>
                </div>

                <button type="button" onClick={handleSyncWeather} disabled={weatherLoading}
                    className="btn-ghost text-xs px-4 py-2.5 shrink-0"
                    style={{ fontSize: '0.75rem' }}>
                    {weatherLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudRain className="w-3.5 h-3.5" />}
                    {weatherLoading ? 'Syncing...' : 'Sync Weather'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Nutrients section */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                        NPK Nutrients
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {nutrientFields.map(({ name, label, colorClass, max }) => (
                            <div key={name} className="space-y-3">
                                <NutrientBar label={label} value={formData[name] || 0} max={max} colorClass={colorClass} />
                                <input type="number" name={name} placeholder={`${name} Value`}
                                    value={formData[name]} onChange={handleInputChange} required
                                    className="input-glass text-sm" />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

                {/* Environmental section */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                        Environmental Conditions
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {environmentFields.map(({ name, label, placeholder, Icon, color, max, iconColor }) => (
                            <div key={name} className="space-y-2">
                                <NutrientBar label="" value={formData[name] || 0} max={max} colorClass={color} />
                                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</label>
                                <div className="relative">
                                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: iconColor }} />
                                    <input type="text" inputMode="decimal" name={name}
                                        value={formData[name]} onChange={handleInputChange} required
                                        placeholder={placeholder}
                                        className="input-glass text-sm pl-9" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                    className="btn-primary w-full py-4 rounded-xl text-sm font-black tracking-wide"
                    style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing AI Model...</>
                    ) : (
                        <><Zap className="w-4 h-4" /> Run Predictive Engine</>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SoilForm;
