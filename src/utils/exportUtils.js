export const exportToCSV = (data) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'products_export.csv';
  link.click();
};

export const exportToExcel = (data) => {
  // Pour l'instant, on utilise la même fonction que CSV
  // Plus tard, on pourra implémenter une vraie exportation Excel
  exportToCSV(data);
}; 