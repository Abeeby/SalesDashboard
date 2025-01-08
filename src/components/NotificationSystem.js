import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notificationVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
};

const CustomToast = ({ title, message, type, onClose }) => (
  <motion.div
    variants={notificationVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className={`custom-toast ${type}`}
  >
    <div className="toast-header">
      <h4>{title}</h4>
      <button onClick={onClose}>×</button>
    </div>
    <div className="toast-body">{message}</div>
    <motion.div 
      className="progress-bar"
      initial={{ width: "100%" }}
      animate={{ width: "0%" }}
      transition={{ duration: 5 }}
    />
  </motion.div>
);

export function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (title, message, type = 'info') => {
    toast(<CustomToast 
      title={title}
      message={message}
      type={type}
      onClose={() => toast.dismiss()}
    />, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  return (
    <>
      <ToastContainer />
      {/* Exposer la fonction showNotification via un contexte React */}
    </>
  );
} 