import React from 'react';

const Loader = ({ size = 'medium', color = '#8C52FF' }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-t-transparent rounded-full animate-spin`}
        style={{ borderColor: `${color}33`, borderTopColor: color }}
      />
    </div>
  );
};

export default Loader;