import React, { useState } from 'react';
import {
  Line,
  Bar,
  Doughnut
} from 'react-chartjs-2';
import { motion } from 'framer-motion';

export function InteractiveCharts({ data }) {
  const [activeDataset, setActiveDataset] = useState('all');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            setHoveredPoint({
              value: context.parsed.y,
              label: context.dataset.label,
              index: context.dataIndex
            });
            return `${context.dataset.label}: ${context.parsed.y}€`;
          }
        }
      }
    },
    onHover: (event, elements) => {
      if (elements.length === 0) {
        setHoveredPoint(null);
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="interactive-charts">
      <div className="chart-controls">
        <button
          className={activeDataset === 'all' ? 'active' : ''}
          onClick={() => setActiveDataset('all')}
        >
          Toutes les données
        </button>
        <button
          className={activeDataset === 'sales' ? 'active' : ''}
          onClick={() => setActiveDataset('sales')}
        >
          Ventes
        </button>
        <button
          className={activeDataset === 'items' ? 'active' : ''}
          onClick={() => setActiveDataset('items')}
        >
          Articles
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="chart-container"
      >
        <Line 
          data={data[activeDataset]}
          options={chartOptions}
        />
      </motion.div>

      {hoveredPoint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="point-details"
        >
          <h4>{hoveredPoint.label}</h4>
          <p>Valeur: {hoveredPoint.value}€</p>
        </motion.div>
      )}
    </div>
  );
} 