import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Beaker, Droplets, FlaskConical, Wind, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { SoilMetrics } from '@/src/types';

interface SoilInputFormProps {
  onSubmit: (metrics: SoilMetrics) => void;
}

export const SoilInputForm: React.FC<SoilInputFormProps> = ({ onSubmit }) => {
  const [metrics, setMetrics] = useState<SoilMetrics>({
    n: 30,
    p: 100,
    k: 100,
    temperature: 20.8,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 202.9
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  const aiValidate = (metrics: SoilMetrics) => {
    // Simulated AI validation logic
    if (metrics.ph < 4 || metrics.ph > 9) {
      return "The pH level seems extremely high or low for standard crop growth. Please verify your soil test results.";
    }
    if (metrics.temperature > 50 || metrics.temperature < 0) {
      return "The temperature value is outside the typical range for agricultural land. Please double-check.";
    }
    if (metrics.rainfall > 500) {
      return "The rainfall value indicates extreme conditions. Ensure this is the correct seasonal average.";
    }
    return null;
  };

  const validate = (name: keyof SoilMetrics, value: number) => {
    let error = '';
    if (value < 0) error = 'Value cannot be negative';
    
    // Specific range validations
    if (name === 'ph' && (value < 0 || value > 14)) error = 'pH must be between 0 and 14';
    if (name === 'humidity' && (value < 0 || value > 100)) error = 'Humidity must be between 0 and 100%';
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (name: keyof SoilMetrics, value: number) => {
    const val = isNaN(value) ? 0 : value;
    const updatedMetrics = { ...metrics, [name]: val };
    setMetrics(updatedMetrics);
    validate(name, val);
    
    const warning = aiValidate(updatedMetrics);
    setAiWarning(warning);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) return;
    onSubmit(metrics);
  };

  const InputField = ({ label, name, value, step = 1 }: { label: string, name: keyof SoilMetrics, value: number, step?: number }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => handleChange(name, parseFloat(e.target.value))}
          className={cn(
            "w-full bg-white/5 border rounded-2xl px-5 py-4 text-[var(--text-main)] font-display text-lg outline-none transition-all duration-300 group-hover:border-agro-neon/30",
            errors[name] ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20" : "border-[var(--border-color)] focus:ring-2 focus:ring-agro-neon/20 focus:border-agro-neon"
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          <button 
            type="button"
            onClick={() => handleChange(name, value + step)}
            className="p-1 hover:text-agro-neon text-zinc-500 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => handleChange(name, Math.max(0, value - step))}
            className="p-1 hover:text-agro-neon text-zinc-500 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      {errors[name] && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest ml-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Nitrogen (N)" name="n" value={metrics.n} />
        <InputField label="Phosphorus (P)" name="p" value={metrics.p} />
        <InputField label="Potassium (K)" name="k" value={metrics.k} />
        <InputField label="pH Level" name="ph" value={metrics.ph} step={0.1} />
        <InputField label="Temperature (°C)" name="temperature" value={metrics.temperature} step={0.1} />
        <InputField label="Humidity (%)" name="humidity" value={metrics.humidity} step={0.1} />
        <InputField label="Rainfall (mm)" name="rainfall" value={metrics.rainfall} step={0.1} />
      </div>

      {aiWarning && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3"
        >
          <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-500/80 leading-relaxed font-medium">
            {aiWarning}
          </p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 255, 136, 0.3)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-agro-neon text-agro-dark font-bold py-5 rounded-2xl shadow-lg shadow-agro-neon/20 flex items-center justify-center gap-3 hover:bg-agro-neon/90 transition-all duration-300 text-lg uppercase tracking-wider"
      >
        <Sparkles className="w-5 h-5" /> Generate Advisory
      </motion.button>
    </form>
  );
};

import { cn } from '@/src/lib/utils';
