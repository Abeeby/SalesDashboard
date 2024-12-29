export const saveProducts = (products) => {
  localStorage.setItem('products', JSON.stringify(products));
};

export const loadProducts = () => {
  const saved = localStorage.getItem('products');
  return saved ? JSON.parse(saved) : [];
}; 