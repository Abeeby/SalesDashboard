import { useState, useEffect } from 'react';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check-session');
        const data = await response.json();
        setIsAuthenticated(data.isValid);
      } catch (error) {
        console.error('Erreur de vérification de session:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
}

export default useAuth; 