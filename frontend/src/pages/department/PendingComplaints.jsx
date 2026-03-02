import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PendingComplaintsTable from '../../components/department/PendingComplaintsTable';
import SolverAssignModal from '../../components/department/SolverAssignModal';
import Loader from '../../components/common/Loader';
import { getPendingComplaints } from '../../api/departmentapi';
import { useAuth } from '../../context/AuthContext';

const PendingComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role !== 'department') {
      navigate('/login');
      return;
    }

    const fetchPending = async () => {
      try {
        setLoading(true);
        const data = await getPendingComplaints();
        setComplaints(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load pending complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [isAuthenticated, role, navigate]);

  const handleView = (id) => {
    navigate(`/complaint/${id}`);
  };

  const handleAssign = (id) => {
    setSelectedComplaintId(id);
    setShowAssignModal(true);
  };

  const handleAssignSuccess = () => {
    setShowAssignModal(false);
    // Optional: list refresh कर सकते हो
  };

  return (
    <div className="min-h-screen bg-[#FDEBD0] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#8C52FF]">
            Pending Complaints
          </h1>
          <button
            onClick={() => navigate('/department/dashboard')}
            className="text-[#8C52FF] hover:underline font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center">
            {error}
          </div>
        )}

        <PendingComplaintsTable
          complaints={complaints}
          onView={handleView}
          onAssign={handleAssign}
          loading={loading}
        />

        {showAssignModal && (
          <SolverAssignModal
            complaintId={selectedComplaintId}
            onAssign={handleAssignSuccess}
            onClose={() => setShowAssignModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PendingComplaints;