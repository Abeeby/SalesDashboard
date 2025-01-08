import React from 'react';
import { motion } from 'framer-motion';

export function ImportPreview({ data, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="import-preview"
    >
      <h3>Aperçu des données</h3>
      <div className="preview-table">
        <table>
          <thead>
            <tr>
              {Object.keys(data[0] || {}).map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 5 && (
          <div className="more-rows">
            Et {data.length - 5} lignes supplémentaires...
          </div>
        )}
      </div>

      <div className="preview-actions">
        <button onClick={onConfirm} className="confirm">
          Confirmer l'import
        </button>
        <button onClick={onCancel} className="cancel">
          Annuler
        </button>
      </div>
    </motion.div>
  );
} 