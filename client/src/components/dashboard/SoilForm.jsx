import React from 'react';
import { Activity, Loader2, CloudRain, Beaker, Thermometer, Wind, ShieldCheck } from 'lucide-react';
import NutrientBar from '../ui/NutrientBar';

const SoilForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleSyncWeather,
    loading,
    weatherLoading
}) => {
    return (
        <div className="bg-white p-8 md:p-12 rounded-[2.3rem] shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Activity className="text-emerald-500 w-8 h-8" />
                        Soil Vitality Analysis
                    </h2>
                    <p className="text-slate-400 font-medium mt-1">Enter your parameters for real-time AI cross-referencing.</p>
                </div>

                <button
                    type="button"
                    onClick={handleSyncWeather}
                    disabled={weatherLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all disabled:opacity-50"
                >
                    {weatherLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <CloudRain className="w-4 h-4" />
                    )}
                    {weatherLoading ? 'Syncing...' : 'Sync Live Weather'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <NutrientBar label="Nitrogen (N)" value={formData.N || 0} max={140} colorClass="bg-blue-500" />
                        <input type="number" name="N" placeholder="N Value" value={formData.N} onChange={handleInputChange} required className="input-glass w-full rounded-2xl p-4 font-bold" />
                    </div>
                    <div className="space-y-4">
                        <NutrientBar label="Phosphorus (P)" value={formData.P || 0} max={145} colorClass="bg-emerald-500" />
                        <input type="number" name="P" placeholder="P Value" value={formData.P} onChange={handleInputChange} required className="input-glass w-full rounded-2xl p-4 font-bold" />
                    </div>
                    <div className="space-y-4">
                        <NutrientBar label="Potassium (K)" value={formData.K || 0} max={205} colorClass="bg-purple-500" />
                        <input type="number" name="K" placeholder="K Value" value={formData.K} onChange={handleInputChange} required className="input-glass w-full rounded-2xl p-4 font-bold" />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-slate-100"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">pH Level</label>
                            <NutrientBar label="" value={formData.ph || 0} max={14} colorClass="bg-indigo-500" />
                        </div>
                        <div className="relative">
                            <Beaker className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />
                            <input
                                type="text"
                                inputMode="decimal"
                                name="ph"
                                value={formData.ph}
                                onChange={handleInputChange}
                                required
                                placeholder="6.5"
                                className="input-glass w-full rounded-xl p-4 pl-12 font-bold"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Temp (°C)</label>
                            <NutrientBar label="" value={formData.temperature || 0} max={50} colorClass="bg-orange-500" />
                        </div>
                        <div className="relative">
                            <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4" />
                            <input
                                type="text"
                                inputMode="decimal"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleInputChange}
                                required
                                placeholder="28.4"
                                className="input-glass w-full rounded-xl p-4 pl-12 font-bold"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Humidity (%)</label>
                            <NutrientBar label="" value={formData.humidity || 0} max={100} colorClass="bg-blue-500" />
                        </div>
                        <div className="relative">
                            <Wind className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
                            <input type="number" name="humidity" value={formData.humidity} onChange={handleInputChange} required placeholder="82" className="input-glass w-full rounded-xl p-4 pl-12 font-bold" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Rainfall (mm)</label>
                            <NutrientBar label="" value={formData.rainfall || 0} max={300} colorClass="bg-emerald-500" />
                        </div>
                        <div className="relative">
                            <CloudRain className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                            <input type="number" name="rainfall" value={formData.rainfall} onChange={handleInputChange} required placeholder="202" className="input-glass w-full rounded-xl p-4 pl-12 font-bold" />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg py-5 rounded-[1.5rem] shadow-2xl shadow-emerald-200 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            <span className="animate-pulse">PROCESSING AI MODEL...</span>
                        </>
                    ) : (
                        <>
                            <ShieldCheck className="w-6 h-6" />
                            RUN PREDICTIVE ENGINE
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SoilForm;
