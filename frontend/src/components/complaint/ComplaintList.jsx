import React from 'react';
import ComplaintCard from './ComplaintCard';
import Loader from '../common/Loader';

const ComplaintList = ({ complaints = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        {error || 'Failed to load complaints'}
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-xl">No complaints found</p>
        <p className="mt-2">File a new complaint to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {complaints.map((complaint) => (
        <ComplaintCard key={complaint.id || complaint._id} data={complaint} />
      ))}
    </div>
  );
};

export default ComplaintList;