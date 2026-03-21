import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Loader2, CloudRain, Beaker, Thermometer, Wind, Zap, FlaskConical, Info, Mic, MicOff } from 'lucide-react';
import NutrientBar from '../ui/NutrientBar';

const fieldHelp = {
    N: { tKey: 'nitrogen', max: 140, colorClass: 'bg-blue-500', accentColor: '#3b82f6', label: 'Nitrogen (N)', placeholder: 'e.g. 90', hint: 'Amount of nitrogen (kg/ha). Ideal: 40–120' },
    P: { tKey: 'phosphorus', max: 145, colorClass: 'bg-emerald-500', accentColor: '#10b981', label: 'Phosphorus (P)', placeholder: 'e.g. 42', hint: 'Amount of phosphorus (kg/ha). Ideal: 10–40' },
    K: { tKey: 'potassium', max: 205, colorClass: 'bg-purple-500', accentColor: '#8b5cf6', label: 'Potassium (K)', placeholder: 'e.g. 43', hint: 'Amount of potassium (kg/ha). Ideal: 10–50' },
};

const envFields = [
    { name: 'ph', tKey: 'ph', label: 'Soil pH', placeholder: '6.5', Icon: Beaker, colorClass: 'bg-indigo-500', max: 14, iconColor: '#818cf8', hint: 'Soil acidity (0-14). Ideal: 5.5–7.5' },
    { name: 'temperature', tKey: 'temperature', label: 'Temperature', placeholder: '28.4', Icon: Thermometer, colorClass: 'bg-orange-500', max: 50, iconColor: '#fb923c', hint: 'Avg temperature (°C)' },
    { name: 'humidity', tKey: 'humidity', label: 'Humidity %', placeholder: '82', Icon: Wind, colorClass: 'bg-blue-500', max: 100, iconColor: '#38bdf8', hint: 'Relative humidity (%)' },
    { name: 'rainfall', tKey: 'rainfall', label: 'Rainfall (mm)', placeholder: '202', Icon: CloudRain, colorClass: 'bg-emerald-500', max: 300, iconColor: '#10b981', hint: 'Annual rainfall (mm)' },
];

const Tooltip = ({ text }) => (
    <div className="group relative inline-block ml-2 cursor-help">
        <Info style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
        <div style={{
            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
            marginBottom: '0.5rem', width: 'max-content', maxWidth: 220,
            background: 'var(--text-primary)', color: 'var(--bg-base)',
            fontSize: '0.68rem', padding: '0.4rem 0.6rem', borderRadius: 6,
            opacity: 0, visibility: 'hidden', transition: 'all 0.2s', zIndex: 10
        }} className="group-hover:opacity-100 group-hover:visible shadow-lg">
            {text}
            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '5px solid transparent', borderTopColor: 'var(--text-primary)' }} />
        </div>
    </div>
);

const SoilForm = ({ formData, handleInputChange, handleSubmit, handleSyncWeather, loading, weatherLoading, fieldErrors, setFormData, setFieldErrors }) => {
    const { t } = useTranslation();
    const [listening, setListening] = useState(false);
    const [activeVoiceField, setActiveVoiceField] = useState(null);
    const [voiceError, setVoiceError] = useState('');
    const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

    const startVoiceInput = (fieldName) => {
        setVoiceError('');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceError('Speech recognition is not supported in this browser.');
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setListening(true);
            setActiveVoiceField(fieldName);
        };

        recognition.onresult = (event) => {
            let transcript = event.results[0][0].transcript.trim();
            // Try to extract a number from the transcript
            const numMatch = transcript.match(/\d+(\.\d+)?/);
            if (numMatch) {
                const val = numMatch[0];
                setFormData(prev => ({ ...prev, [fieldName]: val }));
                setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
            } else {
                setVoiceError(`Could not understand number from: "${transcript}". Please type it instead.`);
            }
        };

        recognition.onerror = (event) => {
            setVoiceError(`Microphone error: ${event.error}. Please type the value manually.`);
            setListening(false);
            setActiveVoiceField(null);
        };

        recognition.onend = () => {
            setListening(false);
            setActiveVoiceField(null);
        };

        recognition.start();
    };

    const isFormValid = Object.values(fieldErrors).every(err => !err) && 
                       Object.keys(formData).every(key => key === 'fieldName' || formData[key] !== '');

    return (
        <div className="card" style={{ overflow: 'hidden' }}>

            {/* Top glow */}
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '80%', height: 180,
                background: 'radial-gradient(ellipse, rgba(45,107,48,0.08) 0%, transparent 70%)',
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
                        background: 'linear-gradient(135deg, rgba(45,107,48,0.2), rgba(45,107,48,0.08))',
                        border: '1px solid rgba(45,107,48,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 16px rgba(45,107,48,0.15)',
                    }}>
                        <FlaskConical style={{ width: 20, height: 20, color: 'var(--emerald-500)' }} />
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

            <form onSubmit={(e) => { e.preventDefault(); if (isFormValid) handleSubmit(e); }} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>

                {voiceError && (
                    <div style={{ padding: '0.875rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.875rem', fontWeight: 600 }}>
                        ⚠️ {voiceError}
                    </div>
                )}
                
                {listening && (
                    <div style={{ padding: '0.875rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5rem', color: 'var(--emerald-500)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mic style={{ width: 16, height: 16, animation: 'pulse 1.5s infinite' }} /> Listening for {activeVoiceField}...
                    </div>
                )}

                {/* Field Details */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            Field Profile
                        </p>
                    </div>
                    <div>
                        <input
                            type="text" name="fieldName"
                            placeholder={t('form.fieldName', 'e.g. North Plot (Optional)')}
                            value={formData.fieldName || ''} onChange={handleInputChange}
                            className="input-glass"
                            style={{ 
                                background: 'var(--bg-surface)', 
                                borderColor: 'var(--border-subtle)',
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '0.875rem'
                            }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="divider-gradient" />

                {/* NPK Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            NPK Nutrients
                        </p>
                        <span className="badge-emerald" style={{ fontSize: '0.65rem', background: 'var(--emerald-glow)', color: 'var(--emerald-500)', borderColor: 'var(--border-accent)' }}>soil test report</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        {Object.entries(fieldHelp).map(([name, { tKey, max, colorClass, label, placeholder, hint }]) => {
                            const error = fieldErrors[name];
                            const hasValue = formData[name] !== '';
                            const isValid = hasValue && !error;
                            
                            return (
                            <div key={name} style={{
                                padding: '1rem 1.125rem', borderRadius: '0.875rem',
                                background: 'var(--bg-elevated)', border: `1px solid ${error ? 'var(--indigo-500)' : (isValid ? 'var(--emerald-400)' : 'var(--border-subtle)')}`,
                                display: 'flex', flexDirection: 'column', gap: '0.625rem',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}>
                                <NutrientBar label="" value={formData[name] || 0} max={max} colorClass={colorClass} />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                        {t(`form.${tKey}`, label)}
                                    </label>
                                    <Tooltip text={hint} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text" inputMode="decimal" name={name}
                                        placeholder={placeholder}
                                        value={formData[name]} onChange={handleInputChange} required
                                        className="input-glass"
                                        style={{ 
                                            background: 'var(--bg-surface)', 
                                            borderColor: error ? 'var(--indigo-500)' : 'var(--border-subtle)',
                                            paddingRight: '2.5rem'
                                        }}
                                    />
                                    {hasSpeechRecognition && (
                                        <button 
                                            type="button" 
                                            onClick={() => startVoiceInput(name)}
                                            style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                                            title="Dictate number"
                                        >
                                            {listening && activeVoiceField === name ? <Mic style={{width: 16, height: 16, color: 'var(--emerald-500)', animation: 'pulse 1.5s infinite'}} /> : <MicOff style={{width: 16, height: 16, color: 'var(--text-muted)'}} />}
                                        </button>
                                    )}
                                </div>
                                {error && <p style={{ fontSize: '0.7rem', color: 'var(--indigo-500)', fontWeight: 600, animation: 'slide-up 0.2s ease' }}>{error}</p>}
                            </div>
                        )})}
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
                        {envFields.map(({ name, tKey, label, placeholder, Icon, colorClass, max, iconColor, hint }) => {
                            const error = fieldErrors[name];
                            const hasValue = formData[name] !== '';
                            const isValid = hasValue && !error;

                            return (
                            <div key={name} style={{
                                padding: '0.875rem 1rem', borderRadius: '0.875rem',
                                background: 'var(--bg-elevated)', border: `1px solid ${error ? 'var(--indigo-500)' : (isValid ? 'var(--emerald-400)' : 'var(--border-subtle)')}`,
                                display: 'flex', flexDirection: 'column', gap: '0.5rem',
                                transition: 'border-color 0.2s',
                            }}>
                                <NutrientBar label="" value={formData[name] || 0} max={max} colorClass={colorClass} />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                        {t(`form.${tKey}`, label)}
                                    </label>
                                    <Tooltip text={hint} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Icon style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: iconColor }} />
                                    <input
                                        type="text" inputMode="decimal" name={name}
                                        value={formData[name]} onChange={handleInputChange}
                                        required placeholder={placeholder}
                                        className="input-glass"
                                        style={{ 
                                            paddingLeft: '2.375rem', paddingRight: '2.5rem',
                                            background: 'var(--bg-surface)', borderColor: error ? 'var(--indigo-500)' : 'var(--border-subtle)' 
                                        }}
                                    />
                                    {hasSpeechRecognition && (
                                        <button 
                                            type="button" 
                                            onClick={() => startVoiceInput(name)}
                                            style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                                            title="Dictate number"
                                        >
                                            {listening && activeVoiceField === name ? <Mic style={{width: 16, height: 16, color: 'var(--emerald-500)', animation: 'pulse 1.5s infinite'}} /> : <MicOff style={{width: 16, height: 16, color: 'var(--text-muted)'}} />}
                                        </button>
                                    )}
                                </div>
                                {error && <p style={{ fontSize: '0.7rem', color: 'var(--indigo-500)', fontWeight: 600, animation: 'slide-up 0.2s ease' }}>{error}</p>}
                            </div>
                        )})}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading || !isFormValid} className="btn-primary"
                    style={{ width: '100%', padding: '1rem 1.5rem', borderRadius: '0.875rem', fontSize: '1rem', letterSpacing: '0.01em', background: !isFormValid ? 'var(--bg-hover)' : undefined, color: !isFormValid ? 'var(--text-muted)' : undefined }}>
                    {loading ? (
                        <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> {t('form.analyzing', 'Analysing your soil data…')}</>
                    ) : (
                        <><Zap style={{ width: 18, height: 18 }} /> {t('form.submit', 'Get AI Crop Recommendation')}</>
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
