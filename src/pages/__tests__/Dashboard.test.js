import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { auth } from '../../auth/firebase';

// Mock Firebase Auth
jest.mock('../../auth/firebase', () => ({
  auth: {
    signOut: jest.fn(),
    currentUser: { uid: '123', email: 'test@test.com' }
  }
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderDashboard = () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  test('affiche les statistiques', () => {
    renderDashboard();
    expect(screen.getByText(/ventes totales/i)).toBeInTheDocument();
    expect(screen.getByText(/revenus total/i)).toBeInTheDocument();
    expect(screen.getByText(/articles disponibles/i)).toBeInTheDocument();
  });

  test('change d\'onglet correctement', () => {
    renderDashboard();
    fireEvent.click(screen.getByText(/vinted/i));
    expect(screen.getByText(/synchronisation vinted/i)).toBeInTheDocument();
  });

  test('gère la déconnexion', () => {
    renderDashboard();
    fireEvent.click(screen.getByText(/déconnexion/i));
    expect(auth.signOut).toHaveBeenCalled();
  });
}); 