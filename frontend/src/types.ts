export interface SoilMetrics {
  n: number;
  p: number;
  k: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface Recommendation {
  id: string;
  crop: string;
  yield: number;
  revenue: number;
  fertilizerGap: {
    n: number;
    p: number;
    k: number;
  };
  timestamp: string;
}

export interface MarketPrice {
  commodity: string;
  mandi: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
  history: { date: string; price: number }[];
}

export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
  recommendationId?: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
  isCustom?: boolean;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface FinanceSummary {
  totalExpenses: number;
  projectedRevenue: number;
  netProfit: number;
}

export interface DiseaseRecord {
  id: string;
  diseaseName: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High';
  crop: string;
}

export interface FarmTask {
  id: string;
  title: string;
  date: string;
  category: 'Irrigation' | 'Fertilizer' | 'Weeding' | 'Harvesting' | 'Other';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Tools';
  quantity: number;
  unit: string;
  minThreshold: number;
}

export interface MachineryItem {
  id: string;
  name: string;
  owner: string;
  pricePerDay: number;
  location: string;
  available: boolean;
  image: string;
}

export interface AnalyticsData {
  historicalYield: { year: number; yield: number }[];
  soilHealth: { month: string; n: number; p: number; k: number }[];
  financialBreakdown: { category: string; amount: number }[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  farmName: string;
  farmLocation: string;
  farmSize: number;
  primaryCrop: string;
  diseaseHistory?: DiseaseRecord[];
  inventory?: InventoryItem[];
  tasks?: FarmTask[];
  analytics?: AnalyticsData;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    currency: string;
    language: string;
  };
}

export interface Notification {
  id: string;
  type: 'market' | 'weather' | 'disease' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
