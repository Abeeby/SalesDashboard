import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportService = {
  toCSV: (data) => {
    const headers = ['Nom', 'Prix', 'Status', 'Marque', 'Catégories', 'Description', 'Date de Vente'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.nom,
        item.prix,
        item.status,
        item.marque,
        item.categories.join(';'),
        item.description,
        item.dateVente
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'articles.csv';
    link.click();
  },

  toExcel: (data) => {
    const ws = XLSX.utils.json_to_sheet(data.map(item => ({
      Nom: item.nom,
      Prix: item.prix,
      Status: item.status,
      Marque: item.marque,
      Catégories: item.categories.join(', '),
      Description: item.description,
      'Date de Vente': item.dateVente,
      Vues: item.vues,
      Favoris: item.favoris
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Articles');
    XLSX.writeFile(wb, 'articles.xlsx');
  },

  toPDF: (data) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Liste des Articles', 14, 22);

    doc.autoTable({
      head: [['Nom', 'Prix', 'Status', 'Marque', 'Catégories']],
      body: data.map(item => [
        item.nom,
        `${item.prix}€`,
        item.status,
        item.marque,
        item.categories.join(', ')
      ]),
      startY: 30,
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [33, 150, 243] }
    });

    doc.save('articles.pdf');
  }
}; 