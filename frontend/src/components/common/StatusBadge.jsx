import React from 'react';
import { STATUS_COLORS } from '../../utils/constants'; 

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <span
      className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold border ${colors}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;