import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ProductForm from './ProductForm';
import DownloadIcon from '@mui/icons-material/Download';
import { exportToExcel } from '../utils/exportUtils';
import HistoryIcon from '@mui/icons-material/History';
import PriceHistory from './PriceHistory';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import GalleryView from './GalleryView';
import { importFromExcel } from '../utils/importUtils';
import UploadIcon from '@mui/icons-material/Upload';
import { validateExcelData, generateExcelTemplate } from '../utils/importUtils';
import ImportPreview from './ImportPreview';

const getStatusColor = (status) => {
  const colors = {
    vendu: 'success',
    en_attente: 'warning',
    disponible: 'info',
    envoyé: 'default'
  };
  return colors[status];
};

const ProductList = ({ products, setProducts }) => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'tous',
    categories: []
  });
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [selectedPriceHistory, setSelectedPriceHistory] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [importData, setImportData] = useState(null);
  const [importValidation, setImportValidation] = useState(null);
  const [showImportPreview, setShowImportPreview] = useState(false);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleSave = (productData) => {
    if (selectedProduct) {
      if (selectedProduct.prix !== productData.prix) {
        productData.priceHistory = [
          ...(selectedProduct.priceHistory || []),
          {
            date: new Date(),
            oldPrice: selectedProduct.prix,
            newPrice: productData.prix
          }
        ];
      }
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? { ...productData, id: p.id } : p
      ));
    } else {
      setProducts([...products, { 
        ...productData, 
        id: Date.now(),
        priceHistory: []
      }]);
    }
  };

  const handleShowPriceHistory = (product) => {
    setSelectedPriceHistory(product.priceHistory || []);
    setShowPriceHistory(true);
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.nom.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'tous' || product.status === filters.status;
    const matchCategories = filters.categories.length === 0 || 
      filters.categories.some(cat => product.categories?.includes(cat));
    return matchSearch && matchStatus && matchCategories;
  });

  const categories = [
    'Haut', 'Bas', 'Chaussures', 'Accessoires',
    'Streetwear', 'Vintage', 'Luxe', 'Sport',
    'Casual', 'Formel'
  ];

  const handleImport = async (event) => {
    const file = event.target.files[0];
    try {
      const importedData = await importFromExcel(file);
      const validation = validateExcelData(importedData);
      setImportData(importedData);
      setImportValidation(validation);
      setShowImportPreview(true);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erreur lors de l\'import du fichier',
        severity: 'error'
      });
    }
  };

  const handleConfirmImport = () => {
    setProducts(prevProducts => {
      const existingRefs = new Set(prevProducts.map(p => p.reference));
      const newProducts = importData.filter(p => !existingRefs.has(p.reference));
      
      setNotification({
        open: true,
        message: `${newProducts.length} articles importés avec succès`,
        severity: 'success'
      });

      return [...prevProducts, ...newProducts];
    });
    setShowImportPreview(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5">Liste des Articles</Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            startIcon={<ViewModuleIcon />}
            onClick={() => setShowGallery(true)}
            sx={{ mr: 2 }}
          >
            Vue Galerie
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => exportToExcel(products)}
            sx={{ mr: 2 }}
          >
            Exporter
          </Button>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            sx={{ mr: 2 }}
          >
            Importer Excel
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleImport}
            />
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProduct(null);
              setOpenForm(true);
            }}
          >
            Ajouter un article
          </Button>
          <Button
            variant="outlined"
            onClick={generateExcelTemplate}
            sx={{ mr: 2 }}
          >
            Télécharger Template
          </Button>
        </Grid>
      </Grid>

      {/* Filtres */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Rechercher"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              label="Statut"
            >
              <MenuItem value="tous">Tous</MenuItem>
              <MenuItem value="disponible">Disponible</MenuItem>
              <MenuItem value="vendu">Vendu</MenuItem>
              <MenuItem value="en_attente">En attente</MenuItem>
              <MenuItem value="envoyé">Envoyé</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Filtrer par catégories
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    categories: prev.categories.includes(category)
                      ? prev.categories.filter(c => c !== category)
                      : [...prev.categories, category]
                  }));
                }}
                color={filters.categories.includes(category) ? "primary" : "default"}
                variant={filters.categories.includes(category) ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>

      {/* Table des produits */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Vues</TableCell>
              <TableCell>Favoris</TableCell>
              <TableCell>Date de Vente</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nom}</TableCell>
                <TableCell>{product.prix}€</TableCell>
                <TableCell>
                  <Chip 
                    label={product.status.replace('_', ' ')} 
                    color={getStatusColor(product.status)}
                  />
                </TableCell>
                <TableCell>{product.vues}</TableCell>
                <TableCell>{product.favoris}</TableCell>
                <TableCell>{product.dateVente || '-'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleShowPriceHistory(product)}
                    disabled={!product.priceHistory?.length}
                  >
                    <HistoryIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        product={selectedProduct}
        onSave={handleSave}
      />

      <PriceHistory
        open={showPriceHistory}
        handleClose={() => setShowPriceHistory(false)}
        history={selectedPriceHistory}
      />

      <GalleryView
        open={showGallery}
        handleClose={() => setShowGallery(false)}
        products={products}
        onEdit={handleEdit}
      />

      <ImportPreview
        open={showImportPreview}
        onClose={() => setShowImportPreview(false)}
        data={importData}
        validation={importValidation}
        onConfirm={handleConfirmImport}
      />

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductList; 