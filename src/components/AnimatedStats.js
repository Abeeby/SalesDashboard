import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function AnimatedStats({ value, label, prefix = '', suffix = '' }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="animated-stat"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="stat-value"
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? {
            opacity: 1,
            transition: {
              duration: 2,
              ease: "easeOut",
            },
          } : {}}
        >
          {value}
        </motion.span>
        {suffix}
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="stat-underline"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="stat-label"
      >
        {label}
      </motion.div>
    </motion.div>
  );
} 