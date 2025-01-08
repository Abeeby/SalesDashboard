import React from 'react';
import { motion } from 'framer-motion';

const loaderVariants = {
  initial: {
    scale: 0.8,
    opacity: 0.5
  },
  animate: {
    scale: [1, 0.8, 1],
    opacity: [1, 0.5, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const dotVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export function CustomLoader({ text = "Chargement" }) {
  return (
    <div className="custom-loader">
      <motion.div
        className="loader-circle"
        variants={loaderVariants}
        initial="initial"
        animate="animate"
      />
      <div className="loader-text">
        {text}
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.1 }}
          >
            .
          </motion.span>
        ))}
      </div>
    </div>
  );
} 