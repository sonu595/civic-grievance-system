import React, { useState } from 'react';
import Button from '../common/Button';

const SolverAssignModal = ({ complaintId, solvers = [], onAssign, onClose }) => {
  const [selectedSolver, setSelectedSolver] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedSolver) return;
    
    setLoading(true);
    try {
      await onAssign(complaintId, selectedSolver);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#8C52FF] mb-6">Assign Solver</h2>

        {solvers.length === 0 ? (
          <p className="text-gray-500 mb-6">No solvers available in this department</p>
        ) : (
          <select
            value={selectedSolver}
            onChange={(e) => setSelectedSolver(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:border-[#8C52FF] outline-none"
          >
            <option value="">Select a Solver</option>
            {solvers.map((solver) => (
              <option key={solver.id} value={solver.id}>
                {solver.name} - {solver.specialization || 'General'}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedSolver || solvers.length === 0 || loading}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SolverAssignModal;