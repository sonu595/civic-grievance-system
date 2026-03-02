import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}) => {
  const base = 'font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-[#8C52FF] text-white hover:bg-[#3a2200] focus:ring-[#8C52FF]',
    secondary: 'bg-[#5C4016] text-white hover:bg-[#4a3212] focus:ring-[#5C4016]',
    outline: 'border-2 border-[#8C52FF] text-[#8C52FF] hover:bg-[#8C52FF11] focus:ring-[#8C52FF]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;