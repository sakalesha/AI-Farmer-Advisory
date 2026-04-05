import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  User, 
  ChevronRight, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  Sprout,
  LayoutDashboard,
  Droplets,
  TrendingUp,
  Settings,
  HelpCircle,
  Zap,
  BarChart3,
  Satellite,
  Sun,
  Moon,
  CloudSun,
  AlertCircle
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { WeatherWidget } from './components/WeatherWidget';
import { SoilInputForm } from './components/SoilInputForm';
import { RecommendationCard } from './components/RecommendationCard';
import { MarketInsights } from './components/MarketInsights';
import { CommunityFeed } from './components/CommunityFeed';
import { AuthPage } from './components/AuthPage';
import { FinancialLedger } from './components/FinancialLedger';
import { DiseaseDetection } from './components/DiseaseDetection';
import { UserProfile } from './components/UserProfile';
import { NotificationCenter } from './components/NotificationCenter';
import { AgriCalendar } from './components/AgriCalendar';
import { InventoryManager } from './components/InventoryManager';
import { MachineryMarketplace } from './components/MachineryMarketplace';
import { SatelliteMonitoring } from './components/SatelliteMonitoring';
import { AgriConsultant } from './components/AgriConsultant';
import { IrrigationScheduler } from './components/IrrigationScheduler';
import { YieldSimulator } from './components/YieldSimulator';
import { useTranslation } from 'react-i18next';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { exportToPDF } from './lib/pdfExport';
import { requestNotificationPermission, sendNotification } from './lib/notifications';
import { SoilMetrics, Recommendation, UserProfile as UserProfileType, Notification, DiseaseRecord, FarmTask, InventoryItem, MachineryItem, AnalyticsData } from './types';

export default function App() {
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [profile, setProfile] = useState<UserProfileType>({
    name: 'Rona Dasakalesha',
    email: 'ronadasakalesha@gmail.com',
    phone: '+91 98765 43210',
    farmName: 'Green Valley Farms',
    farmLocation: 'Punjab, India',
    farmSize: 15.5,
    primaryCrop: 'Rice',
    preferences: {
      notifications: true,
      theme: 'dark',
      currency: 'INR',
      language: 'en'
    },
    inventory: [
      { id: '1', name: 'Basmati Seeds', category: 'Seeds', quantity: 50, unit: 'kg', minThreshold: 10 },
      { id: '2', name: 'Urea Fertilizer', category: 'Fertilizers', quantity: 5, unit: 'bags', minThreshold: 10 },
      { id: '3', name: 'Neem Oil', category: 'Pesticides', quantity: 12, unit: 'liters', minThreshold: 5 }
    ],
    tasks: [
      { id: '1', title: 'Morning Irrigation', date: new Date().toISOString().split('T')[0], category: 'Irrigation', priority: 'high', completed: false },
      { id: '2', title: 'Check for Rice Blast', date: new Date().toISOString().split('T')[0], category: 'Disease Control', priority: 'medium', completed: true }
    ],
    analytics: {
      historicalYield: [
        { year: 2021, yield: 3.8 },
        { year: 2022, yield: 4.2 },
        { year: 2023, yield: 4.5 },
        { year: 2024, yield: 4.8 },
        { year: 2025, yield: 5.1 }
      ],
      soilHealth: [
        { month: 'Jan', n: 45, p: 30, k: 25 },
        { month: 'Feb', n: 42, p: 28, k: 24 },
        { month: 'Mar', n: 48, p: 32, k: 26 },
        { month: 'Apr', n: 50, p: 35, k: 28 }
      ],
      financialBreakdown: [
        { category: 'Seeds', amount: 25000 },
        { category: 'Fertilizers', amount: 45000 },
        { category: 'Labor', amount: 60000 },
        { category: 'Machinery', amount: 35000 },
        { category: 'Irrigation', amount: 15000 }
      ]
    }
  });

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    i18n.changeLanguage(profile.preferences.language);
  }, [profile.preferences.language, i18n]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/history', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const historicalYield = data
              .map((d: any, idx: number) => ({
                year: 2025 - idx,
                yield: parseFloat(d.prediction?.yield) || 0
              }))
              .filter(y => y.yield > 0)
              .reverse()
              .slice(-5); // last 5 records
              
            if (historicalYield.length > 0) {
              setProfile(prev => ({
                ...prev,
                analytics: {
                  ...prev.analytics!,
                  historicalYield: historicalYield.length >= 5 ? historicalYield : prev.analytics!.historicalYield
                }
              }));
            }
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  const [machinery, setMachinery] = useState<MachineryItem[]>([
    { id: '1', name: 'John Deere 5310', owner: 'Harpreet Singh', pricePerDay: 2500, location: 'Amritsar, Punjab', available: true, image: 'https://picsum.photos/seed/tractor1/800/600' },
    { id: '2', name: 'Mahindra Arjun 555', owner: 'Rajesh Kumar', pricePerDay: 2200, location: 'Ludhiana, Punjab', available: false, image: 'https://picsum.photos/seed/tractor2/800/600' },
    { id: '3', name: 'Sonalika Worldtrac', owner: 'Gurmeet Singh', pricePerDay: 2800, location: 'Jalandhar, Punjab', available: true, image: 'https://picsum.photos/seed/tractor3/800/600' }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'market',
      title: 'Rice Prices Up 5%',
      message: 'Basmati rice prices have seen a significant increase in your local mandi today.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'weather',
      title: 'Heavy Rain Alert',
      message: 'Thunderstorms expected in your region tomorrow. Ensure proper drainage in your fields.',
      timestamp: '5 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'disease',
      title: 'Rice Blast Warning',
      message: 'Outbreaks reported in neighboring farms. Check your crop for early symptoms.',
      timestamp: '1 day ago',
      read: true
    }
  ]);

  useEffect(() => {
    if (profile.preferences.theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [profile.preferences.theme]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  // Default projected revenue for demo if no recommendation exists
  const projectedRevenue = recommendation?.revenue || 234000;

  const handleSoilSubmit = async (metrics: SoilMetrics) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          fieldName: 'Main Field',
          N: metrics.n,
          P: metrics.p,
          K: metrics.k,
          temperature: metrics.temperature,
          humidity: metrics.humidity,
          ph: metrics.ph,
          rainfall: metrics.rainfall
        })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setRecommendation({
          id: data.recordId || Math.random().toString(36).substr(2, 9),
          crop: data.crop + (data.irrigation ? ` (Irrigation: ${data.irrigation})` : ''),
          yield: parseFloat(data.yield) || 4.2,
          revenue: data.market?.estimatedRevenue || 234000,
          fertilizerGap: {
            n: metrics.n,
            p: metrics.p,
            k: metrics.k
          },
          timestamp: new Date().toISOString()
        });
        setActiveTab('advisory');
      } else {
        console.error('Error from backend:', data.message);
      }
    } catch (err) {
      console.error('Network error during prediction:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-agro-dark text-white flex agro-gradient overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSignOut={() => setIsAuthenticated(false)} 
        unreadNotifications={unreadCount}
      />
      
      <main className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-10 pt-24 lg:pt-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">
              {activeTab === 'dashboard' && 'Home'}
              {activeTab === 'advisory' && 'AI Advisory Hub'}
              {activeTab === 'disease' && 'Disease Detection AI'}
              {activeTab === 'calendar' && 'Agricultural Calendar'}
              {activeTab === 'inventory' && 'Inventory Management'}
              {activeTab === 'machinery' && 'Machinery Marketplace'}
              {activeTab === 'irrigation' && 'Smart Irrigation'}
              {activeTab === 'simulator' && 'Yield Simulator'}
              {activeTab === 'consultant' && 'AI Agri-Consultant'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'market' && 'Market Intelligence'}
              {activeTab === 'finance' && 'Financial Ledger'}
              {activeTab === 'satellite' && 'Satellite Health'}
              {activeTab === 'community' && 'Farmer Community'}
              {activeTab === 'notifications' && 'Notifications'}
              {activeTab === 'profile' && 'User Profile'}
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-[var(--border-color)] rounded-2xl">
              <button 
                onClick={() => setProfile(prev => ({ ...prev, preferences: { ...prev.preferences, theme: prev.preferences.theme === 'dark' ? 'light' : 'dark' } }))}
                className="p-1 hover:text-agro-neon transition-colors"
              >
                {profile.preferences.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button 
                onClick={() => setActiveTab('notifications')}
                className="relative p-1 hover:text-agro-neon transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className="p-1 hover:text-agro-neon transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 pl-4 md:pl-6 border-l border-[var(--border-color)]"
            >
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/20">
                <img 
                  src="https://picsum.photos/seed/farmer/100/100" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[var(--text-main)]">{profile.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{profile.farmName}</p>
              </div>
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Soil Input Form Section */}
                  <div className="lg:col-span-4">
                    <section className="premium-card h-full">
                      <h2 className="text-xl font-display font-bold text-[var(--text-main)] mb-2">NPK Soil input form</h2>
                      <p className="text-[var(--text-muted)] text-sm mb-8">Interactive glassmorphism inputs and potassium</p>
                      <SoilInputForm onSubmit={handleSoilSubmit} />
                    </section>
                  </div>

                  {/* Revenue Calculator & Stats Section */}
                  <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <section className="premium-card bg-gradient-to-br from-agro-card to-agro-neon/5 border-agro-neon/10">
                        <h3 className="font-bold text-[var(--text-main)] mb-2">Your revenue calculator</h3>
                        <p className="text-[var(--text-muted)] text-xs mb-6">Your potential calculator result</p>
                        <div className="flex items-end gap-2 mb-8">
                          <span className="text-4xl md:text-5xl font-display font-bold text-agro-neon neon-text">₹{projectedRevenue.toLocaleString()}</span>
                        </div>
                        <button className="bg-agro-neon text-agro-dark font-bold px-6 py-3 rounded-2xl hover:bg-agro-neon/90 transition-all">
                          Calculator now
                        </button>
                      </section>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="premium-card flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 bg-agro-neon/10 rounded-2xl flex items-center justify-center mb-4">
                            <CloudSun className="w-6 h-6 text-agro-neon" />
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mb-1">Real-time weather</p>
                          <p className="text-sm font-bold">Successful!</p>
                        </div>
                        <div className="premium-card flex flex-col items-center justify-center text-center border-red-500/20">
                          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mb-1">Alerts</p>
                          <p className="text-sm font-bold text-red-500">#FF6B6B</p>
                        </div>
                        <div className="premium-card flex flex-col items-center justify-center text-center">
                          <p className="text-xs text-[var(--text-muted)] mb-2">Confidence Meter</p>
                          <div className="relative w-16 h-16 mb-2">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              <circle className="text-white/5" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                              <circle className="text-agro-neon" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="0" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">100%</span>
                          </div>
                          <p className="text-[10px] text-agro-neon font-bold">High Confidence</p>
                        </div>
                        <div className="premium-card flex flex-col items-center justify-center text-center">
                          <p className="text-xs text-[var(--text-muted)] mb-3">Irrigation Levels</p>
                          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
                            <Droplets className="w-6 h-6 text-blue-400" />
                          </div>
                          <p className="text-xs font-bold text-zinc-300">Normal</p>
                        </div>
                      </div>
                    </div>

                    <section className="premium-card bg-gradient-to-r from-agro-card to-agro-card/40 border-[var(--border-color)]">
                      <h2 className="text-2xl md:text-4xl font-display font-medium text-[var(--text-main)] text-center py-4">
                        Your field has <span className="text-agro-neon font-bold">94% match</span> for {profile.primaryCrop} this season
                      </h2>
                    </section>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 px-6 py-4 bg-white/5 border border-[var(--border-color)] rounded-3xl md:rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-agro-neon animate-pulse" />
                    <span className="text-sm font-bold text-[var(--text-main)] whitespace-nowrap">Status bar</span>
                  </div>
                  <div className="hidden md:block w-px h-4 bg-white/10" />
                  <p className="text-sm text-[var(--text-muted)]">Ultra-premium, award-winning UI atra modern agri-tech capability.</p>
                </div>
              </div>
            )}

            {activeTab === 'advisory' && (
              <div className="max-w-5xl mx-auto">
                {recommendation ? (
                  <div className="space-y-8">
                    <RecommendationCard data={recommendation} />
                  </div>
                ) : (
                  <div className="text-center py-20 md:py-32">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[var(--border-color)]">
                      <Sprout className="w-10 h-10 md:w-12 md:h-12 text-zinc-700" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-main)] mb-3">No Active Advisory</h3>
                    <p className="text-[var(--text-muted)] mb-10 max-w-md mx-auto px-4">Submit your soil metrics on the dashboard to get AI-powered crop recommendations and yield analytics.</p>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="bg-agro-neon text-agro-dark px-8 md:px-10 py-4 rounded-2xl font-bold hover:bg-agro-neon/90 transition-all uppercase tracking-widest text-sm"
                    >
                      Start Analysis
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'disease' && (
              <DiseaseDetection onResult={(res) => {
                const newRecord: DiseaseRecord = {
                  id: Math.random().toString(36).substr(2, 9),
                  diseaseName: res.disease,
                  date: new Date().toISOString().split('T')[0],
                  severity: res.severity.charAt(0).toUpperCase() + res.severity.slice(1) as any,
                  crop: profile.primaryCrop
                };
                setProfile(prev => ({
                  ...prev,
                  diseaseHistory: [newRecord, ...(prev.diseaseHistory || [])]
                }));
              }} />
            )}

            {activeTab === 'calendar' && (
              <AgriCalendar 
                tasks={profile.tasks || []} 
                onAddTask={(task) => setProfile(prev => ({ ...prev, tasks: [{ ...task, id: Math.random().toString(36).substr(2, 9) }, ...(prev.tasks || [])] }))}
                onToggleTask={(id) => setProfile(prev => ({ ...prev, tasks: prev.tasks?.map(t => t.id === id ? { ...t, completed: !t.completed } : t) }))}
                onDeleteTask={(id) => setProfile(prev => ({ ...prev, tasks: prev.tasks?.filter(t => t.id !== id) }))}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryManager 
                items={profile.inventory || []}
                onAddItem={(item) => setProfile(prev => ({ ...prev, inventory: [{ ...item, id: Math.random().toString(36).substr(2, 9) }, ...(prev.inventory || [])] }))}
                onUpdateItem={(id, updates) => setProfile(prev => ({ ...prev, inventory: prev.inventory?.map(i => i.id === id ? { ...i, ...updates } : i) }))}
                onDeleteItem={(id) => setProfile(prev => ({ ...prev, inventory: prev.inventory?.filter(i => i.id !== id) }))}
              />
            )}

            {activeTab === 'machinery' && (
              <MachineryMarketplace 
                items={machinery}
                onRent={(id) => setMachinery(prev => prev.map(m => m.id === id ? { ...m, available: false } : m))}
                onListMachinery={(item) => setMachinery(prev => [{ ...item, id: Math.random().toString(36).substr(2, 9) }, ...prev])}
              />
            )}

            {activeTab === 'irrigation' && <IrrigationScheduler />}
            {activeTab === 'simulator' && <YieldSimulator />}
            {activeTab === 'consultant' && <AgriConsultant />}
            {activeTab === 'satellite' && <SatelliteMonitoring />}
            {activeTab === 'analytics' && profile.analytics && (
              <div id="analytics-report">
                <AnalyticsDashboard 
                  data={profile.analytics} 
                  onExport={() => exportToPDF('analytics-report', 'Farm_Analytics_Report')}
                />
              </div>
            )}

            {activeTab === 'market' && (
              <div className="max-w-5xl mx-auto">
                <MarketInsights />
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="max-w-6xl mx-auto">
                <FinancialLedger projectedRevenue={projectedRevenue} />
              </div>
            )}

            {activeTab === 'community' && (
              <div className="max-w-4xl mx-auto">
                <CommunityFeed />
              </div>
            )}

            {activeTab === 'notifications' && (
              <NotificationCenter 
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onDelete={handleDeleteNotification}
                onClearAll={handleClearAll}
              />
            )}

            {activeTab === 'profile' && (
              <UserProfile 
                profile={profile}
                onUpdate={setProfile}
              />
            )}

            {['analytics'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-32 md:py-40 text-zinc-600 px-4 text-center">
                <LayoutDashboard className="w-16 h-16 md:w-20 md:h-20 mb-6 opacity-10" />
                <p className="text-xl md:text-2xl font-display font-bold">Intelligence Module</p>
                <p className="text-sm mt-2">Advanced deep analytics coming soon.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-agro-dark/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-4 border-white/5 border-t-agro-neon rounded-full"
                />
                <Sprout className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-agro-neon neon-text" />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 text-2xl font-display font-bold text-white tracking-widest uppercase"
              >
                AgriMind AI is analyzing...
              </motion.p>
              <div className="mt-6 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-agro-neon animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 rounded-full bg-agro-neon animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 rounded-full bg-agro-neon animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
