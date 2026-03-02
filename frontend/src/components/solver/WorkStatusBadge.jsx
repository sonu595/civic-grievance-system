import React from 'react';

const WorkStatusBadge = ({ status }) => {
  const styles = {
    Assigned: 'bg-blue-100 text-blue-800 border-blue-300',
    'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Completed: 'bg-green-100 text-green-800 border-green-300',
  };

  const colorClass = styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <span className={`inline-flex px-4 py-1 rounded-full text-sm font-semibold border ${colorClass}`}>
      {status}
    </span>
  );
};

export default WorkStatusBadge;