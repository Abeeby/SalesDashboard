import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { getStatusColor } from '../utils/statusUtils';
import ProductDetail from './ProductDetail';

const GalleryView = ({ open, handleClose, products, onEdit }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['all', ...new Set(products.flatMap(p => p.categories || []))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categories?.includes(selectedCategory));

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Galerie des Articles
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "contained" : "outlined"}
              onClick={() => setSelectedCategory(category)}
              size="small"
            >
              {category === 'all' ? 'Tous' : category}
            </Button>
          ))}
        </Box>
        <Grid container spacing={2}>
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                {product.images?.[0] && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images[0].url}
                    alt={product.nom}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setSelectedProduct(product)}
                  />
                )}
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      {product.nom}
                    </Typography>
                    <IconButton size="small" onClick={() => onEdit(product)}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {product.marque} - {product.prix}€
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label={product.status}
                      color={getStatusColor(product.status)}
                      sx={{ mr: 1 }}
                    />
                    {product.categories?.map(cat => (
                      <Chip
                        key={cat}
                        size="small"
                        label={cat}
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {selectedProduct && (
          <ProductDetail
            open={!!selectedProduct}
            handleClose={() => setSelectedProduct(null)}
            product={selectedProduct}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GalleryView; 