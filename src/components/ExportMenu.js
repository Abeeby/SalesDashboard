import { useState } from 'react';
import { exportService } from '../services/exportService';
import '../styles/ExportMenu.css';

export default function ExportMenu({ data }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (format) => {
    switch (format) {
      case 'csv':
        exportService.toCSV(data);
        break;
      case 'excel':
        exportService.toExcel(data);
        break;
      case 'pdf':
        exportService.toPDF(data);
        break;
      default:
        break;
    }
    setShowMenu(false);
  };

  return (
    <div className="export-menu">
      <button 
        className="export-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        Exporter
      </button>
      {showMenu && (
        <div className="export-options">
          <button onClick={() => handleExport('csv')}>CSV</button>
          <button onClick={() => handleExport('excel')}>Excel</button>
          <button onClick={() => handleExport('pdf')}>PDF</button>
        </div>
      )}
    </div>
  );
} 