import { useState } from 'react';
import * as XLSX from 'xlsx';
import { addItem } from '../api/items';
import '../styles/ExcelImport.css';

export default function ExcelImport() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    setMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const workbook = XLSX.read(event.target.result);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Traitement de chaque ligne
        for (const row of jsonData) {
          await addItem({
            nom: row.Nom || row.nom,
            prix: parseFloat(row.Prix || row.prix) || 0,
            status: row.Status || row.status || 'disponible',
            marque: row.Marque || row.marque,
            categories: (row.Categories || row.categories || '').split(',').map(c => c.trim()),
            description: row.Description || row.description,
            plateforme: row.Plateforme || row.plateforme || 'vinted',
            dateImport: new Date().toISOString()
          });
        }

        setMessage(`${jsonData.length} articles importés avec succès !`);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      setMessage('Erreur lors de l\'import du fichier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="excel-import">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <div className="loading">Importation en cours...</div>}
      {message && <div className={message.includes('succès') ? 'success' : 'error'}>{message}</div>}
    </div>
  );
} 