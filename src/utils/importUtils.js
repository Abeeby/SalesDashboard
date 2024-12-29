import * as XLSX from 'xlsx';

export const importFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transformation des données selon votre structure
        const formattedData = rawData.map((item, index) => ({
          id: `ZAN${item['Reference #'] || index + 1}`,
          nom: `${item['Brand']} ${item['Type']}`,
          marque: item['Brand'],
          taille: item['Size'],
          type: item['Type'],
          couleur: item['Color'],
          genre: item['Gender'],
          materiau: item['Material'],
          prix: parseFloat(item['Price (€)'] || 0),
          reference: item['Reference #'],
          status: 'disponible', // Status par défaut
          vues: 0,
          favoris: 0,
          categories: [
            item['Type']?.toLowerCase() === 't-shirt' ? 'Haut' : 
            item['Type']?.toLowerCase().includes('pull') ? 'Haut' :
            item['Type']?.toLowerCase().includes('pantalon') ? 'Bas' :
            'Autre'
          ],
          description: `${item['Brand']} ${item['Type']} ${item['Color']} ${item['Material']}`,
          plateforme: 'vinted',
          priceHistory: []
        }));

        resolve(formattedData);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsBinaryString(file);
  });
};

export const validateExcelData = (data) => {
  const errors = [];
  const warnings = [];

  data.forEach((item, index) => {
    // Vérifications obligatoires
    if (!item.marque) errors.push(`Ligne ${index + 1}: Marque manquante`);
    if (!item.type) errors.push(`Ligne ${index + 1}: Type manquant`);
    if (!item.taille) warnings.push(`Ligne ${index + 1}: Taille non spécifiée`);
    if (isNaN(item.prix)) errors.push(`Ligne ${index + 1}: Prix invalide`);
    
    // Vérifications de format
    if (item.reference && !/^ZAN\d+$/.test(item.reference)) {
      warnings.push(`Ligne ${index + 1}: Format de référence incorrect`);
    }
  });

  return { errors, warnings, isValid: errors.length === 0 };
};

export const generateExcelTemplate = () => {
  const template = XLSX.utils.book_new();
  const headers = [
    'Brand', 'Size', 'Color', 'Type', 'Gender', 
    'Material', 'Price (€)', 'Reference #'
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  XLSX.utils.book_append_sheet(template, ws, 'Template');
  XLSX.writeFile(template, 'inventory_template.xlsx');
}; 