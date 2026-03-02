import React from 'react';
import AssignedComplaintCard from './AssignedComplaintCard';
import Loader from '../common/Loader';

const AssignedComplaintList = ({ 
  complaints = [], 
  loading = false, 
  onViewDetail, 
  onComplete 
}) => {
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600 bg-white rounded-2xl p-10 shadow-md">
        <h3 className="text-xl font-semibold mb-3">No assigned tasks</h3>
        <p>Check back later for new assignments</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {complaints.map((complaint) => (
        <AssignedComplaintCard
          key={complaint.id}
          data={complaint}
          onViewDetail={onViewDetail}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
};

export default AssignedComplaintList;