import { useState } from 'react';
import { syncVintedAccount, getVintedItems } from '../api/vinted';
import '../styles/VintedSync.css';

export default function VintedSync() {
  const [vintedEmail, setVintedEmail] = useState('');
  const [vintedUsername, setVintedUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVintedSync = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await syncVintedAccount(vintedEmail);
      if (result.success) {
        const items = await getVintedItems();
        console.log('Articles récupérés:', items);
      }
    } catch (error) {
      setError('Erreur lors de la synchronisation avec Vinted');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vinted-sync">
      <h2>Synchronisation Vinted</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleVintedSync}>
        <div className="input-group">
          <label>Email Vinted</label>
          <input
            type="email"
            value={vintedEmail}
            onChange={(e) => setVintedEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Nom d'utilisateur Vinted</label>
          <input
            type="text"
            value={vintedUsername}
            onChange={(e) => setVintedUsername(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Synchronisation...' : 'Synchroniser avec Vinted'}
        </button>
      </form>
    </div>
  );
} 