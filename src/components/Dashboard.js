import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = ({ products }) => {
  // Calcul des statistiques
  const stats = {
    totalVentes: products.filter(p => p.status === 'vendu').length,
    enAttente: products.filter(p => p.status === 'en_attente').length,
    articlesDispo: products.filter(p => p.status === 'disponible').length,
    revenusTotal: products
      .filter(p => p.status === 'vendu')
      .reduce((sum, p) => sum + Number(p.prix), 0),
    moyenneVues: Math.round(
      products.reduce((sum, p) => sum + p.vues, 0) / products.length
    ),
    totalFavoris: products.reduce((sum, p) => sum + p.favoris, 0)
  };

  // Données pour le graphique circulaire des statuts
  const statusData = [
    { name: 'Disponible', value: stats.articlesDispo },
    { name: 'Vendu', value: stats.totalVentes },
    { name: 'En attente', value: stats.enAttente }
  ];

  // Données pour le graphique des plateformes
  const platformData = Object.entries(
    products.reduce((acc, product) => {
      acc[product.plateforme] = (acc[product.plateforme] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>
      
      {/* Statistiques générales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Ventes Totales</Typography>
            <Typography variant="h4">{stats.totalVentes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Revenus Total</Typography>
            <Typography variant="h4">{stats.revenusTotal}€</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Articles Disponibles</Typography>
            <Typography variant="h4">{stats.articlesDispo}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Moyenne des Vues</Typography>
            <Typography variant="h4">{stats.moyenneVues}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Répartition par Status
            </Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={statusData}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Répartition par Plateforme
            </Typography>
            <BarChart width={400} height={300} data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 