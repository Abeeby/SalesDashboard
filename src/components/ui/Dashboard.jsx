import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { AIAssistant, Analytics, Inventory, Marketing } from './modules';
import { Logo } from './common/Logo';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Vert professionnel
      light: '#4CAF50',
      dark: '#1B5E20'
    },
    secondary: {
      main: '#FF4081', // Rose dynamique
      light: '#FF80AB',
      dark: '#F50057'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
  }
});

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [data, setData] = useState(null);

  useEffect(() => {
    // Chargement initial des données
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Chargement des données en temps réel
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden' }}>
        <Grid container spacing={2}>
          {/* Sidebar */}
          <Grid item xs={2}>
            <Paper elevation={3} sx={{ height: '100vh', p: 2 }}>
              <Logo />
              <Navigation 
                active={activeModule}
                onChange={setActiveModule}
              />
              <AIAssistantWidget />
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={10}>
            <Box sx={{ p: 3 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderActiveModule()}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard; 