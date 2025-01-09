// Définition des types pour une meilleure maintenabilité
interface VintedItem {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'sold' | 'deleted';
  created_at: string;
  views: number;
  likes: number;
  photos: string[];
  description: string;
  brand?: string;
  size?: string;
  condition?: string;
}

interface VintedStats {
  totalViews: number;
  totalLikes: number;
  averagePrice: number;
  totalItems: number;
  totalSales: number;
  conversionRate: number;
  performanceScore: number;
}

interface VintedAnalytics {
  dailyViews: Record<string, number>;
  dailyLikes: Record<string, number>;
  dailySales: Record<string, number>;
  peakHours: Record<number, number>;
  popularCategories: Record<string, number>;
  priceDistribution: Record<string, number>;
}

interface DashboardState {
  items: VintedItem[];
  stats: VintedStats;
  analytics: VintedAnalytics;
  loading: boolean;
  error: string | null;
} 