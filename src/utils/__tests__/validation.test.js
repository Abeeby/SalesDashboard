import { validateItem } from '../validation';

describe('validateItem', () => {
  test('devrait valider un article correct', () => {
    const item = {
      nom: 'T-shirt Nike',
      prix: 25.99,
      marque: 'Nike',
      categories: ['Sport', 'Haut']
    };

    const { isValid, errors } = validateItem(item);
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  test('devrait rejeter un article invalide', () => {
    const item = {
      nom: 'T',
      prix: -10,
      marque: '',
      categories: []
    };

    const { isValid, errors } = validateItem(item);
    expect(isValid).toBe(false);
    expect(errors).toHaveProperty('nom');
    expect(errors).toHaveProperty('prix');
    expect(errors).toHaveProperty('marque');
    expect(errors).toHaveProperty('categories');
  });
}); 