import React from 'react';
import { Activity, Loader2, CloudRain, Beaker, Thermometer, Wind, Zap, FlaskConical } from 'lucide-react';
import NutrientBar from '../ui/NutrientBar';

const fieldHelp = {
    N: { max: 140, colorClass: 'bg-blue-500', accentColor: '#3b82f6', label: 'Nitrogen (N)', placeholder: 'e.g. 90', hint: 'From soil test report (kg/ha)' },
    P: { max: 145, colorClass: 'bg-emerald-500', accentColor: '#10b981', label: 'Phosphorus (P)', placeholder: 'e.g. 42', hint: 'From soil test report (kg/ha)' },
    K: { max: 205, colorClass: 'bg-purple-500', accentColor: '#8b5cf6', label: 'Potassium (K)', placeholder: 'e.g. 43', hint: 'From soil test report (kg/ha)' },
};

const envFields = [
    { name: 'ph', label: 'Soil pH', placeholder: '6.5', Icon: Beaker, colorClass: 'bg-indigo-500', max: 14, iconColor: '#818cf8', hint: 'Ideal: 5.5 – 7.5' },
    { name: 'temperature', label: 'Temperature', placeholder: '28.4', Icon: Thermometer, colorClass: 'bg-orange-500', max: 50, iconColor: '#fb923c', hint: 'Avg temperature (°C)' },
    { name: 'humidity', label: 'Humidity %', placeholder: '82', Icon: Wind, colorClass: 'bg-blue-500', max: 100, iconColor: '#38bdf8', hint: 'Relative humidity (%)' },
    { name: 'rainfall', label: 'Rainfall (mm)', placeholder: '202', Icon: CloudRain, colorClass: 'bg-emerald-500', max: 300, iconColor: '#10b981', hint: 'Annual rainfall (mm)' },
];

const SoilForm = ({ formData, handleInputChange, handleSubmit, handleSyncWeather, loading, weatherLoading }) => {
    return (
        <div className="card" style={{ overflow: 'hidden' }}>

            {/* Top glow */}
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '80%', height: 180,
                background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{
                padding: '1.5rem 1.75rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
                position: 'relative', zIndex: 1,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: '0.875rem', flexShrink: 0,
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.08))',
                        border: '1px solid rgba(16,185,129,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 16px rgba(16,185,129,0.15)',
                    }}>
                        <FlaskConical style={{ width: 20, height: 20, color: '#34d399' }} />
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 900, fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                            Soil Analysis Form
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            Enter field parameters — AI will find the best crop for you
                        </p>
                    </div>
                </div>
                <button type="button" onClick={handleSyncWeather} disabled={weatherLoading}
                    className="btn-ghost" style={{ padding: '0.625rem 1.125rem', flexShrink: 0 }}>
                    {weatherLoading
                        ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                        : <CloudRain style={{ width: 15, height: 15 }} />
                    }
                    {weatherLoading ? 'Fetching…' : '📍 Auto-fill Weather'}
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>

                {/* NPK Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            NPK Nutrients
                        </p>
                        <span className="badge-emerald" style={{ fontSize: '0.65rem' }}>soil test report</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        {Object.entries(fieldHelp).map(([name, { max, colorClass, accentColor, label, placeholder, hint }]) => (
                            <div key={name} style={{
                                padding: '1rem 1.125rem', borderRadius: '0.875rem',
                                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                                display: 'flex', flexDirection: 'column', gap: '0.625rem',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                                onFocusCapture={e => { e.currentTarget.style.borderColor = accentColor + '50'; e.currentTarget.style.boxShadow = `0 0 16px ${accentColor}15`; }}
                                onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                {/* Nutrient bar at top */}
                                <NutrientBar label={label} value={formData[name] || 0} max={max} colorClass={colorClass} />
                                <input
                                    type="number" name={name}
                                    placeholder={placeholder}
                                    value={formData[name]} onChange={handleInputChange} required
                                    className="input-glass"
                                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-subtle)' }}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.4 }}>{hint}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="divider-gradient" />

                {/* Environmental Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            Field Conditions
                        </p>
                        <span className="badge-indigo" style={{ fontSize: '0.65rem' }}>or use auto-fill ↑</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
                        {envFields.map(({ name, label, placeholder, Icon, colorClass, max, iconColor, hint }) => (
                            <div key={name} style={{
                                padding: '0.875rem 1rem', borderRadius: '0.875rem',
                                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                                display: 'flex', flexDirection: 'column', gap: '0.5rem',
                            }}>
                                <NutrientBar label="" value={formData[name] || 0} max={max} colorClass={colorClass} />
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block' }}>
                                    {label}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Icon style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: iconColor }} />
                                    <input
                                        type="text" inputMode="decimal" name={name}
                                        value={formData[name]} onChange={handleInputChange}
                                        required placeholder={placeholder}
                                        className="input-glass"
                                        style={{ paddingLeft: '2.375rem', background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-subtle)' }}
                                    />
                                </div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{hint}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="btn-primary"
                    style={{ width: '100%', padding: '1rem 1.5rem', borderRadius: '0.875rem', fontSize: '1rem', letterSpacing: '0.01em' }}>
                    {loading ? (
                        <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Analysing your soil data…</>
                    ) : (
                        <><Zap style={{ width: 18, height: 18 }} /> Get AI Crop Recommendation</>
                    )}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    🔒 Your data is analysed securely and saved to your history automatically.
                </p>
            </form>
        </div>
    );
};

export default SoilForm;
