import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';

export function CustomExport({ data }) {
  const [exportOptions, setExportOptions] = useState({
    includeStats: true,
    includeItems: true,
    includeSales: true,
    dateRange: 'all',
    format: 'pdf'
  });

  const handleExport = () => {
    const filteredData = {
      ...data,
      stats: exportOptions.includeStats ? data.stats : null,
      items: exportOptions.includeItems ? data.items : null,
      sales: exportOptions.includeSales ? data.sales : null
    };

    if (exportOptions.format === 'csv') {
      // Export CSV
      const csv = convertToCSV(filteredData);
      downloadCSV(csv);
    }
    // PDF est géré par PDFDownloadLink
  };

  return (
    <motion.div 
      className="custom-export"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <h3>Options d'export</h3>
      
      <div className="export-options">
        <label>
          <input
            type="checkbox"
            checked={exportOptions.includeStats}
            onChange={e => setExportOptions(prev => ({
              ...prev,
              includeStats: e.target.checked
            }))}
          />
          Statistiques
        </label>

        <label>
          <input
            type="checkbox"
            checked={exportOptions.includeItems}
            onChange={e => setExportOptions(prev => ({
              ...prev,
              includeItems: e.target.checked
            }))}
          />
          Articles en vente
        </label>

        <select
          value={exportOptions.dateRange}
          onChange={e => setExportOptions(prev => ({
            ...prev,
            dateRange: e.target.value
          }))}
        >
          <option value="all">Toutes les données</option>
          <option value="month">Dernier mois</option>
          <option value="week">Dernière semaine</option>
        </select>

        <select
          value={exportOptions.format}
          onChange={e => setExportOptions(prev => ({
            ...prev,
            format: e.target.value
          }))}
        >
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
        </select>
      </div>

      <button onClick={handleExport}>
        Exporter les données
      </button>
    </motion.div>
  );
} 