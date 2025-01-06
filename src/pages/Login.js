import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useFormValidation } from '../hooks/useFormValidation';

export function Login() {
  const {
    values,
    errors,
    isValid,
    handleChange
  } = useFormValidation({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setLoading(true);

    try {
      if (isResetMode) {
        const response = await fetch('http://localhost:3001/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email })
        });

        const data = await response.json();
        if (data.success) {
          toast.success('Email de réinitialisation envoyé !');
          setIsResetMode(false);
        } else {
          toast.error(data.error);
        }
      } else {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });

        const data = await response.json();
        if (data.success) {
          localStorage.setItem('vintedToken', data.token);
          toast.success('Connexion réussie !');
          navigate('/dashboard');
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="login-container"
    >
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isResetMode ? 'Réinitialiser le mot de passe' : 'Connexion Vinted'}</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'error' : ''}
            required
          />
          <AnimatePresence>
            {errors.email && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="error-message"
              >
                {errors.email}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isResetMode && (
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={errors.password ? 'error' : ''}
              required
            />
            <AnimatePresence>
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="error-message"
                >
                  <p>{errors.password.message}</p>
                  <ul>
                    {Object.entries(errors.password.checks).map(([key, isValid]) => (
                      <li key={key} className={isValid ? 'valid' : 'invalid'}>
                        {key === 'length' && '6 caractères minimum'}
                        {key === 'hasUpper' && 'Une majuscule'}
                        {key === 'hasLower' && 'Une minuscule'}
                        {key === 'hasNumber' && 'Un chiffre'}
                        {key === 'hasSpecial' && 'Un caractère spécial'}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <button type="submit" disabled={loading || !isValid}>
          {loading ? 'Chargement...' : (isResetMode ? 'Envoyer' : 'Se connecter')}
        </button>

        <button
          type="button"
          className="switch-mode"
          onClick={() => setIsResetMode(!isResetMode)}
        >
          {isResetMode ? 'Retour à la connexion' : 'Mot de passe oublié ?'}
        </button>
      </form>
    </motion.div>
  );
} 