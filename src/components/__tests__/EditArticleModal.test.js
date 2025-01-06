import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditArticleModal from '../EditArticleModal';
import { updateItem } from '../../api/items';

// Mock des dépendances
jest.mock('../../api/items');

describe('EditArticleModal', () => {
  const mockArticle = {
    id: '1',
    nom: 'T-shirt Nike',
    prix: 25.99,
    marque: 'Nike',
    categories: ['Sport', 'Haut'],
    description: 'Super t-shirt',
    status: 'disponible'
  };

  const mockOnClose = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('devrait afficher les données de l\'article', () => {
    render(
      <EditArticleModal
        article={mockArticle}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByDisplayValue('T-shirt Nike')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Nike')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sport, Haut')).toBeInTheDocument();
  });

  test('devrait valider et soumettre le formulaire', async () => {
    updateItem.mockResolvedValueOnce({});

    render(
      <EditArticleModal
        article={mockArticle}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
      />
    );

    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'Nouveau T-shirt' }
    });

    fireEvent.click(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(updateItem).toHaveBeenCalled();
      expect(mockOnEdit).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('devrait afficher les erreurs de validation', async () => {
    render(
      <EditArticleModal
        article={mockArticle}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
      />
    );

    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'T' }
    });

    fireEvent.click(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(screen.getByText(/Le nom doit contenir/)).toBeInTheDocument();
    });
  });
}); 