import React from 'react';
import { THEME } from '../../utils/constants';

const StatsCards = ({ stats = { total: 0, pending: 0, inProgress: 0, resolved: 0 } }) => {
  const cards = [
    { title: 'Total Complaints', value: stats.total, color: '#8C52FF' },
    { title: 'Pending', value: stats.pending, color: '#E67E22' },
    { title: 'In Progress', value: stats.inProgress, color: '#3B82F6' },
    { title: 'Resolved', value: stats.resolved, color: '#10B981' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
          <p className="text-3xl font-bold" style={{ color: card.color }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;