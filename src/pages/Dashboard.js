import { useState } from 'react';
import { auth } from '../auth/firebase';
import ExcelImport from '../components/ExcelImport';
import ProductList from '../components/ProductList';
import VintedSync from '../components/VintedSync';
import TeamManagement from '../components/TeamManagement';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('articles');
  const [products, setProducts] = useState([
    {
      id: 1,
      nom: "T-shirt Palace",
      prix: 25.00,
      status: "vendu",
      vues: 35,
      favoris: 5,
      dateVente: "2024-02-25",
      marque: "Palace",
      categories: ["Streetwear", "Haut"],
      description: "T-shirt Palace condition 9/10",
      plateforme: "vinted"
    },
    // ... autres produits
  ]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Tableau de Bord</h1>
        </div>
        <nav className="header-nav">
          <button 
            className={activeTab === 'articles' ? 'active' : ''} 
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
          <button 
            className={activeTab === 'vinted' ? 'active' : ''} 
            onClick={() => setActiveTab('vinted')}
          >
            Vinted
          </button>
          <button 
            className={activeTab === 'import' ? 'active' : ''} 
            onClick={() => setActiveTab('import')}
          >
            Importer
          </button>
          <button 
            className={activeTab === 'team' ? 'active' : ''} 
            onClick={() => setActiveTab('team')}
          >
            Équipe
          </button>
        </nav>
        <div className="header-right">
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {activeTab === 'articles' && (
          <div className="articles-section">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Ventes Totales</h3>
                <p>{products.filter(p => p.status === 'vendu').length}</p>
              </div>
              <div className="stat-card">
                <h3>Revenus Total</h3>
                <p>{products.reduce((acc, p) => p.status === 'vendu' ? acc + p.prix : acc, 0)}€</p>
              </div>
              <div className="stat-card">
                <h3>Articles Disponibles</h3>
                <p>{products.filter(p => p.status === 'disponible').length}</p>
              </div>
              <div className="stat-card">
                <h3>Moyenne des Vues</h3>
                <p>{Math.round(products.reduce((acc, p) => acc + p.vues, 0) / products.length)}</p>
              </div>
            </div>
            <ProductList products={products} setProducts={setProducts} />
          </div>
        )}

        {activeTab === 'vinted' && (
          <div className="vinted-section">
            <VintedSync />
          </div>
        )}

        {activeTab === 'import' && (
          <div className="import-section">
            <h2>Importer des Données</h2>
            <ExcelImport />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="team-section">
            <TeamManagement />
          </div>
        )}
      </main>
    </div>
  );
} 