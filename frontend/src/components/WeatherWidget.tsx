import React from 'react';
import { motion } from 'motion/react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudRain,
  Sun,
  CloudLightning,
  Cloud
} from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/weather?lat=30.9000&lon=75.8500')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success' && result.data) {
          setWeatherData(result.data);
        }
      })
      .catch(console.error);
  }, []);

  const temp = weatherData ? Math.round(weatherData.temp) : 32;
  const humidity = weatherData ? Math.round(weatherData.humidity) : 45;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="premium-card bg-gradient-to-br from-agro-card to-blue-900/20 border-blue-500/10"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Current Weather</p>
          <h3 className="text-3xl font-display font-bold text-white">Ludhiana, PB</h3>
        </div>
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
          <Sun className="w-6 h-6 text-yellow-400 animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <span className="text-6xl font-display font-bold text-white">{temp}°</span>
        <div className="space-y-1">
          <p className="text-zinc-300 font-medium">Mostly Sunny</p>
          <p className="text-zinc-500 text-xs">H: 34° L: 26°</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
          <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-2" />
          <p className="text-xs text-zinc-500">Humidity</p>
          <p className="text-sm font-bold text-white">{humidity}%</p>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
          <Wind className="w-4 h-4 text-teal-400 mx-auto mb-2" />
          <p className="text-xs text-zinc-500">Wind</p>
          <p className="text-sm font-bold text-white">12 km/h</p>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
          <Thermometer className="w-4 h-4 text-orange-400 mx-auto mb-2" />
          <p className="text-xs text-zinc-500">UV Index</p>
          <p className="text-sm font-bold text-white">High</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">4-Day Forecast</p>
        <div className="space-y-3">
          {[
            { day: 'Mon', icon: CloudLightning, temp: '33°', color: 'text-yellow-400' },
            { day: 'Tue', icon: Sun, temp: '31°', color: 'text-zinc-400' },
            { day: 'Wed', icon: Wind, temp: '28°', color: 'text-blue-400' },
            { day: 'Thu', icon: CloudRain, temp: '34°', color: 'text-yellow-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm font-medium text-zinc-300 w-8">{item.day}</span>
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-bold text-white">{item.temp}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
