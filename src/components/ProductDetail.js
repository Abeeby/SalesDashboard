import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Grid,
  Chip,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';

const ProductDetail = ({ open, handleClose, product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < (product.images?.length - 1) ? prev + 1 : prev
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : prev);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {product.nom}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {product.images?.length > 0 && (
              <Box sx={{ position: 'relative' }}>
                <img
                  src={product.images[currentImageIndex].url}
                  alt={`${product.nom} - ${currentImageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1,
                  bgcolor: 'rgba(0,0,0,0.5)'
                }}>
                  <Button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    sx={{ color: 'white' }}
                  >
                    <KeyboardArrowLeft /> Précédent
                  </Button>
                  <Typography sx={{ color: 'white' }}>
                    {currentImageIndex + 1} / {product.images.length}
                  </Typography>
                  <Button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === product.images.length - 1}
                    sx={{ color: 'white' }}
                  >
                    Suivant <KeyboardArrowRight />
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Détails du produit
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Marque:</strong> {product.marque}
              </Typography>
              <Typography variant="body1">
                <strong>Prix:</strong> {product.prix}€
              </Typography>
              <Typography variant="body1">
                <strong>Taille:</strong> {product.taille}
              </Typography>
              <Typography variant="body1">
                <strong>Plateforme:</strong> {product.plateforme}
              </Typography>
              <Typography variant="body1">
                <strong>Vues:</strong> {product.vues}
              </Typography>
              <Typography variant="body1">
                <strong>Favoris:</strong> {product.favoris}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Catégories
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.categories?.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail; 