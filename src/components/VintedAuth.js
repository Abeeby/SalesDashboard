import React, { useEffect, useState } from 'react';
import { CircularProgress, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function VintedAuth() {
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleVintedLogin = async () => {
    try {
      setStatus('loading');
      // Ouvrir Vinted dans un nouvel onglet
      const vintedWindow = window.open('https://www.vinted.fr', '_blank');
      
      // Écouter les messages de l'extension (à développer plus tard)
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'VINTED_AUTH_SUCCESS') {
          const { cookies } = event.data;
          // Sauvegarder les cookies
          const response = await fetch('/api/auth/save-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cookies })
          });

          if (response.ok) {
            setStatus('success');
            navigate('/dashboard');
          }
        }
      });

    } catch (error) {
      setStatus('error');
      console.error('Erreur d\'authentification:', error);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 3,
      p: 4 
    }}>
      <Typography variant="h4">
        Connexion à Vinted
      </Typography>

      {status === 'loading' && (
        <>
          <CircularProgress />
          <Typography>
            Connectez-vous à Vinted dans la nouvelle fenêtre...
          </Typography>
        </>
      )}

      {status === 'idle' && (
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleVintedLogin}
          size="large"
        >
          Se connecter avec Vinted
        </Button>
      )}

      {status === 'error' && (
        <Typography color="error">
          Une erreur est survenue. Veuillez réessayer.
        </Typography>
      )}
    </Box>
  );
}

export default VintedAuth; 