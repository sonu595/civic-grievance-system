// components/common/Toast.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ show, message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
      default:
        return 'bg-green-50 border-green-500 text-green-800';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className={`${getBgColor()} border-l-4 rounded-lg shadow-lg p-4 flex items-center gap-3`}>
            <span className="text-xl">{getIcon()}</span>
            <p className="flex-1 font-medium">{message}</p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;