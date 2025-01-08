import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { toast } from 'react-toastify';
import { ImportPreview } from './ImportPreview';

export default function FileImporter() {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [errors, setErrors] = useState([]);

  const validateData = (data) => {
    const errors = [];
    const requiredFields = ['reference', 'nom', 'prix', 'quantite'];

    // Vérifier les champs requis
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field]) {
          errors.push(`Ligne ${index + 1}: Le champ "${field}" est manquant`);
        }
      });

      // Valider le format des prix
      if (row.prix && isNaN(parseFloat(row.prix))) {
        errors.push(`Ligne ${index + 1}: Prix invalide "${row.prix}"`);
      }

      // Valider les quantités
      if (row.quantite && (!Number.isInteger(Number(row.quantite)) || Number(row.quantite) < 0)) {
        errors.push(`Ligne ${index + 1}: Quantité invalide "${row.quantite}"`);
      }
    });

    return errors;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setLoading(true);
    setErrors([]);

    try {
      const data = await readExcelFile(file);
      const validationErrors = validateData(data);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        toast.error('Le fichier contient des erreurs');
      } else {
        setPreviewData(data);
      }
    } catch (error) {
      toast.error('Erreur lors de la lecture du fichier: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData) return;

    setLoading(true);
    try {
      await saveInventory(previewData);
      toast.success('Inventaire importé avec succès !');
      setPreviewData(null);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = read(e.target.result, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = utils.sheet_to_json(firstSheet);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const saveInventory = async (data) => {
    const response = await fetch('http://localhost:3001/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inventory: data })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde de l\'inventaire');
    }

    return response.json();
  };

  return (
    <div className="file-importer">
      <h2>Importer des Données</h2>
      
      {errors.length > 0 && (
        <div className="validation-errors">
          <h4>Erreurs de validation:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {!previewData ? (
        <div className="upload-zone">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={loading}
          />
          {loading && <div className="loading">Lecture du fichier...</div>}
        </div>
      ) : (
        <ImportPreview
          data={previewData}
          onConfirm={handleConfirmImport}
          onCancel={() => setPreviewData(null)}
        />
      )}
    </div>
  );
} 