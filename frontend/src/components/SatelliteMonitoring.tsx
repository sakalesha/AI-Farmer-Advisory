import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Satellite, 
  Maximize2, 
  Layers, 
  Info, 
  AlertCircle, 
  Calendar,
  Download,
  Share2,
  RefreshCw,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const SatelliteMonitoring: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'moisture' | 'thermal'>('ndvi');
  const [isScanning, setIsScanning] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number, value: number } | null>(null);

  const layers = [
    { id: 'ndvi', label: 'NDVI (Health)', color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 'moisture', label: 'Soil Moisture', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'thermal', label: 'Thermal Stress', color: 'text-red-400', bg: 'bg-red-400/10' }
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Satellite Monitoring</h2>
          <p className="text-zinc-500 mt-1">Real-time precision farming data via high-resolution satellite imagery.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-white"
          >
            {isScanning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Satellite className="w-5 h-5" />}
            Refresh Scan
          </button>
          <button className="bg-agro-neon text-agro-dark p-3 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-agro-neon/20">
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map View */}
        <div className="lg:col-span-8">
          <div className="premium-card p-0 overflow-hidden relative aspect-video bg-zinc-900 border-white/5">
            {/* Mock Map Image */}
            <img 
              src="https://picsum.photos/seed/farm-satellite/1200/800" 
              alt="Satellite View" 
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />

            {/* Simulated Heatmap Overlay */}
            {showHeatmap && (
              <div className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                activeLayer === 'ndvi' ? "bg-green-500/20 mix-blend-overlay" :
                activeLayer === 'moisture' ? "bg-blue-500/20 mix-blend-overlay" :
                "bg-red-500/20 mix-blend-overlay"
              )}>
                {/* Random Heatmap Blobs */}
                <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-green-400/40 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-red-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-400/40 rounded-full blur-3xl animate-pulse" />
              </div>
            )}

            {/* Scanning Line */}
            {isScanning && (
              <motion.div 
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-agro-neon shadow-[0_0_20px_rgba(0,255,136,0.8)] z-10"
              />
            )}

            {/* UI Controls on Map */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className="bg-agro-dark/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white hover:bg-agro-dark transition-all"
              >
                {showHeatmap ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button className="bg-agro-dark/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white hover:bg-agro-dark transition-all">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 bg-agro-dark/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Stressed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-agro-neon" /> Data Layers
            </h3>
            <div className="space-y-3">
              {layers.map(layer => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                    activeLayer === layer.id 
                      ? "bg-agro-neon/10 border-agro-neon/30" 
                      : "bg-white/5 border-white/5 hover:border-white/10"
                  )}
                >
                  <span className={cn("font-bold text-sm", activeLayer === layer.id ? "text-agro-neon" : "text-zinc-500")}>
                    {layer.label}
                  </span>
                  <div className={cn("w-2 h-2 rounded-full", layer.color.replace('text-', 'bg-'))} />
                </button>
              ))}
            </div>
          </div>

          <div className="premium-card bg-gradient-to-br from-agro-card to-agro-neon/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-agro-neon/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-agro-neon" />
              </div>
              <h3 className="font-bold text-white">Precision Insights</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Average NDVI</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-bold text-white">0.78</span>
                  <span className="text-xs text-green-400 font-bold">+4% vs last week</span>
                </div>
              </div>

              <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Anomalies Detected</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  High thermal stress detected in Sector B-4. Possible irrigation failure or pest infestation.
                </p>
              </div>

              <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> View Historical Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
