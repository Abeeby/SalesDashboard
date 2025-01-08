import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { db } from '../auth/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export function DataExport() {
  const [exportData, setExportData] = useState(null);

  const prepareExportData = async (startDate, endDate) => {
    const salesRef = collection(db, 'vintedHistory');
    const q = query(
      salesRef,
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => {
      const sale = doc.data();
      return {
        date: sale.timestamp.toDate().toLocaleDateString(),
        article: sale.title,
        prix: sale.price,
        acheteur: sale.buyerName,
        statut: sale.status
      };
    });

    setExportData(data);
  };

  return (
    <div className="data-export">
      <h3>Export des données</h3>
      <div className="date-picker">
        <input 
          type="date" 
          onChange={e => setStartDate(e.target.value)}
        />
        <input 
          type="date" 
          onChange={e => setEndDate(e.target.value)}
        />
      </div>
      <button onClick={() => prepareExportData(startDate, endDate)}>
        Préparer l'export
      </button>
      {exportData && (
        <CSVLink 
          data={exportData}
          filename={`vinted-export-${new Date().toISOString()}.csv`}
          className="export-button"
        >
          Télécharger CSV
        </CSVLink>
      )}
    </div>
  );
} 