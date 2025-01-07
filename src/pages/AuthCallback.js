import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    // Vérifier l'état pour la sécurité
    const savedState = sessionStorage.getItem('auth_state');
    if (state !== savedState) {
      console.error('État invalide');
      navigate('/login');
      return;
    }

    // Envoyer le code au parent
    window.opener?.postMessage({
      type: 'VINTED_AUTH',
      code
    }, window.location.origin);

    // Rediriger vers le dashboard
    navigate('/dashboard');
  }, [navigate, location]);

  return <div>Authentification en cours...</div>;
} 