import { motion } from 'framer-motion';

const transitionVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 50,
      mass: 0.5,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.5,
    },
  }),
};

export function PageTransitions({ children, direction = 1 }) {
  return (
    <motion.div
      custom={direction}
      variants={transitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-transition"
    >
      {children}
    </motion.div>
  );
} 