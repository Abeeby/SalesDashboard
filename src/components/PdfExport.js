import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20 },
  section: { margin: 10, padding: 10 },
  item: { marginBottom: 5 },
  stats: { flexDirection: 'row', justifyContent: 'space-between' }
});

const VintedPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Rapport Zandishop</Text>
      
      <View style={styles.section}>
        <Text>Statistiques de vente</Text>
        <View style={styles.stats}>
          <Text>Chiffre d'affaires: {data.totalRevenue}€</Text>
          <Text>Nombre de ventes: {data.sales?.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text>Articles en vente</Text>
        {data.items?.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text>{item.title} - {item.price}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export function PdfExport({ data }) {
  return (
    <div className="pdf-export">
      <PDFDownloadLink
        document={<VintedPDF data={data} />}
        fileName={`zandishop-report-${new Date().toISOString()}.pdf`}
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Génération du PDF...' : 'Télécharger le rapport PDF'
        }
      </PDFDownloadLink>
    </div>
  );
} 