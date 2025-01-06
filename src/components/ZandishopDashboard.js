import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ZandishopDashboard.css';
import { VintedNotifications } from './VintedNotifications';
import { DataExport } from './DataExport';
import { SalesStats } from './SalesStats';
import { OrderTracking } from './OrderTracking';
import { VintedFilters } from './VintedFilters';
import { VintedAnalytics } from './VintedAnalytics';
import { DetailedStats } from './DetailedStats';
import { ItemSorting } from './ItemSorting';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { PdfExport } from './PdfExport';
import { AnimatedCard } from './AnimatedCard';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { ParallaxSection } from './ParallaxSection';
import { useAdvancedKeyboard } from '../hooks/useAdvancedKeyboard';
import { CustomLoader } from './CustomLoader';
import { ParticlesBackground } from './ParticlesBackground';
import { PageTransitions } from './PageTransitions';
import { AnimatedStats } from './AnimatedStats';

export default function ZandishopDashboard() {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    price: '',
    date: ''
  });
  const [sortBy, setSortBy] = useState('');
  const [theme, toggleTheme] = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/zandishop');
        setShopData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    // Rafraîchir toutes les minutes
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const filteredItems = shopData?.items?.filter(item => {
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.price) {
      const price = parseFloat(item.price);
      const [min, max] = filters.price.split('-').map(Number);
      if (max && (price < min || price > max)) return false;
      if (!max && price < min) return false;
    }
    // ... autres filtres
    return true;
  });

  const sortedAndFilteredItems = filteredItems?.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'date-new':
        return new Date(b.date) - new Date(a.date);
      case 'date-old':
        return new Date(a.date) - new Date(b.date);
      default:
        return 0;
    }
  });

  const keyboardHandlers = {
    search: () => document.querySelector('.search-box input')?.focus(),
    print: () => window.print(),
    toggleSidebar: () => setSidebarOpen(prev => !prev),
    secretCommand: () => showNotification('Easter Egg', '🎉 Vous avez trouvé un secret !'),
    previousSection: () => {/* Navigation entre sections */},
    nextSection: () => {/* Navigation entre sections */}
  };

  useAdvancedKeyboard(keyboardHandlers);

  if (loading) return <CustomLoader text="Chargement du dashboard" />;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <PageTransitions>
      <ParticlesBackground theme={theme} />
      <div className={`zandishop-dashboard theme-${theme}`}>
        <ParallaxSection offset={100}>
          <h1>Zandishop Dashboard</h1>
        </ParallaxSection>

        <div className="dashboard-header">
          <h2>Zandishop Dashboard</h2>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <VintedFilters onFilterChange={handleFilterChange} />
        <ItemSorting onSort={setSortBy} />
        
        <DetailedStats data={shopData} />
        
        <div className="dashboard-grid">
          <SalesStats salesData={shopData?.sales || []} />
          <OrderTracking orders={shopData?.sales || []} />
          <DataExport />
        </div>

        <VintedAnalytics data={shopData} />

        <div className="items-grid">
          <AnimatePresence>
            {sortedAndFilteredItems?.map((item, index) => (
              <AnimatedCard key={item.id || index}>
                <div className="item-card">
                  <img src={item.imageUrl} alt={item.title} />
                  <h4>{item.title}</h4>
                  <p className="price">{item.price}</p>
                  <p className="status">{item.status}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    Voir sur Vinted
                  </a>
                </div>
              </AnimatedCard>
            ))}
          </AnimatePresence>
        </div>

        <PdfExport data={shopData} />

        <div className="stats-overview">
          <AnimatedStats
            value={shopData?.totalRevenue}
            label="Chiffre d'affaires"
            prefix="€"
          />
          <AnimatedStats
            value={shopData?.items?.length}
            label="Articles en vente"
          />
        </div>
      </div>
    </PageTransitions>
  );
} 