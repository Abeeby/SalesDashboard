import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  Box
} from '@mui/material';

const ImportPreview = ({ 
  open, 
  onClose, 
  data, 
  validation, 
  onConfirm 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Prévisualisation de l'import</DialogTitle>
      <DialogContent>
        {validation.errors.length > 0 && (
          <Box mb={2}>
            <Alert severity="error">
              {validation.errors.map((error, i) => (
                <div key={i}>{error}</div>
              ))}
            </Alert>
          </Box>
        )}
        {validation.warnings.length > 0 && (
          <Box mb={2}>
            <Alert severity="warning">
              {validation.warnings.map((warning, i) => (
                <div key={i}>{warning}</div>
              ))}
            </Alert>
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Marque</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Taille</TableCell>
              <TableCell>Couleur</TableCell>
              <TableCell>Référence</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.marque}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.prix}€</TableCell>
                <TableCell>{item.taille}</TableCell>
                <TableCell>{item.couleur}</TableCell>
                <TableCell>{item.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={onConfirm}
          disabled={!validation.isValid}
          variant="contained"
        >
          Confirmer l'import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportPreview; 