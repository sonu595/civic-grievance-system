import React from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';

const PendingComplaintsTable = ({ complaints = [], onView, onAssign, loading = false }) => {
  if (loading) {
    return <div className="text-center py-10">Loading complaints...</div>;
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No pending complaints at the moment
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#FFF1D1]">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-[#5C4016]">ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-[#5C4016]">Title</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-[#5C4016]">Category</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-[#5C4016]">Location</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-[#5C4016]">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-[#5C4016]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <tr key={complaint.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {complaint.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {complaint.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {complaint.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {complaint.location?.substring(0, 30)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={complaint.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => onView(complaint.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => onAssign(complaint.id)}
                  >
                    Assign Solver
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingComplaintsTable;