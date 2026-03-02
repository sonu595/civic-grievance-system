import React from 'react';
import StatusBadge from '../common/StatusBadge'; // common से
import Button from '../common/Button';
import { THEME } from '../../utils/constants';

const AssignedComplaintCard = ({ data, onViewDetail, onComplete }) => {
  const isCompletable = data.status === 'Assigned' || data.status === 'In Progress';

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-[#8C52FF] hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-[#8C52FF]">{data.title}</h3>
          <p className="text-sm text-gray-600 mt-1">ID: {data.id}</p>
        </div>
        <StatusBadge status={data.status || 'Assigned'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image & Basic Info */}
        <div>
          <img
            src={data.image || 'https://via.placeholder.com/400x220?text=Complaint'}
            alt="Complaint"
            className="w-full h-48 object-cover rounded-2xl border border-gray-200 mb-3"
          />
          <div className="text-sm text-gray-600">
            <strong>Location:</strong> {data.location}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Assigned on: {data.assignedDate || data.date}
          </div>
        </div>

        {/* Right: Description & Actions */}
        <div className="flex flex-col">
          <div className="bg-[#FFF1D1] rounded-2xl p-4 mb-4 grow">
            <h4 className="font-semibold text-[#5C4016] mb-2">Description</h4>
            <p className="text-sm text-gray-700 line-clamp-5">
              {data.description}
            </p>
          </div>

          <div className="flex gap-4 mt-auto">
            <Button 
              variant="outline" 
              size="small"
              onClick={() => onViewDetail(data.id)}
            >
              View Details
            </Button>
            
            {isCompletable && (
              <Button 
                variant="primary"
                size="small"
                onClick={() => onComplete(data.id)}
              >
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedComplaintCard;