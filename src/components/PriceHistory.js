import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceHistory = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <Box>
        <Typography variant="body1">
          Aucun historique de prix disponible
        </Typography>
      </Box>
    );
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Prix',
        data: data.map(item => item.price),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Historique des prix
      </Typography>
      <Line data={chartData} />
    </Box>
  );
};

export default PriceHistory; 