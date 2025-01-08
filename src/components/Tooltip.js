import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Tooltip({ children, text, shortcut }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {text}
            {shortcut && (
              <span className="shortcut">
                {shortcut.split('+').map(key => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 