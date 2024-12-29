import React from 'react';
import { Box, Container } from '@mui/material';
import ProductList from './components/ProductList.js';
import Dashboard from './components/Dashboard.js';

function App() {
  const [products, setProducts] = React.useState([
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
    {
      id: 2,
      nom: "Pull Lacoste",
      prix: 30.00,
      status: "en_attente",
      vues: 88,
      favoris: 6,
      dateVente: null,
      marque: "Lacoste",
      categories: ["Casual", "Haut"],
      description: "Pull Lacoste vintage",
      plateforme: "vinted"
    }
  ]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Dashboard products={products} />
        <ProductList products={products} setProducts={setProducts} />
      </Box>
    </Container>
  );
}

export default App; 