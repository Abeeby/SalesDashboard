import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Stack,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import fr from 'date-fns/locale/fr';
import ImageUpload from './ImageUpload';

const ProductForm = ({ open, handleClose, product, onSave }) => {
  const [formData, setFormData] = useState(product || {
    nom: '',
    prix: '',
    status: 'disponible',
    vues: 0,
    favoris: 0,
    dateVente: null,
    description: '',
    taille: '',
    marque: '',
    plateforme: 'vinted',
    categories: [],
    priceHistory: [],
    images: []
  });

  const categories = [
    'Haut', 'Bas', 'Chaussures', 'Accessoires',
    'Streetwear', 'Vintage', 'Luxe', 'Sport',
    'Casual', 'Formel'
  ];

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {product ? 'Modifier l\'article' : 'Ajouter un nouvel article'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="nom"
              label="Nom de l'article"
              value={formData.nom}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="marque"
              label="Marque"
              value={formData.marque}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="prix"
              label="Prix"
              type="number"
              value={formData.prix}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="taille"
              label="Taille"
              value={formData.taille}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Statut"
              >
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="vendu">Vendu</MenuItem>
                <MenuItem value="en_attente">En attente</MenuItem>
                <MenuItem value="envoyé">Envoyé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Plateforme</InputLabel>
              <Select
                name="plateforme"
                value={formData.plateforme}
                onChange={handleChange}
                label="Plateforme"
              >
                <MenuItem value="vinted">Vinted</MenuItem>
                <MenuItem value="vestiaire_collective">Vestiaire Collective</MenuItem>
                <MenuItem value="leboncoin">Leboncoin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Catégories
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryToggle(category)}
                  color={formData.categories.includes(category) ? "primary" : "default"}
                  variant={formData.categories.includes(category) ? "filled" : "outlined"}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          {formData.status === 'vendu' && (
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date de vente"
                  value={formData.dateVente}
                  onChange={(newValue) => {
                    setFormData({ ...formData, dateVente: newValue });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Photos de l'article
            </Typography>
            <ImageUpload
              images={formData.images}
              onChange={(newImages) => setFormData({ ...formData, images: newImages })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;