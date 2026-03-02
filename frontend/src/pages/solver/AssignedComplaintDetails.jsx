import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CompleteWorkForm from '../../components/solver/CompleteWorkForm';
import WorkStatusBadge from '../../components/solver/WorkStatusBadge';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getComplaintById } from '../../api/complaintsapi'; // reuse citizen API or create solver-specific
import { completeComplaint } from '../../api/solverapi';
import { useAuth } from '../../context/AuthContext';

const AssignedComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role !== 'solver') {
      navigate('/login');
      return;
    }

    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const data = await getComplaintById(id); // adjust if solver has separate endpoint
        setComplaint(data);
      } catch (err) {
        setError(err.message || 'Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, isAuthenticated, role, navigate]);

  const handleCompleteSubmit = async (formData) => {
    setSubmitLoading(true);
    setError(null);

    try {
      await completeComplaint(id, formData);
      // Success → refresh or redirect
      alert('Work marked as completed successfully!');
      navigate('/solver/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to submit completion');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size="large" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{error}</div>;
  if (!complaint) return <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">Task not found</div>;

  const canComplete = complaint.status === 'Assigned' || complaint.status === 'In Progress';

  return (
    <div className="min-h-screen bg-[#FDEBD0] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/solver/dashboard')}
          className="mb-6 text-[#8C52FF] font-medium hover:underline flex items-center gap-2"
        >
          ← Back to My Tasks
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#8C52FF]">
          {/* Header */}
          <div className="bg-[#8C52FF] text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{complaint.title}</h1>
                <p className="text-sm opacity-90 mt-1">Task ID: {complaint.id}</p>
              </div>
              <WorkStatusBadge status={complaint.status} />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Image & Info */}
              <div>
                <img
                  src={complaint.image || 'https://via.placeholder.com/600x400?text=Complaint+Image'}
                  alt={complaint.title}
                  className="w-full rounded-2xl border border-gray-200 shadow-sm object-cover h-64 md:h-96"
                />
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-[#5C4016]">Location</h3>
                    <p className="text-gray-700">{complaint.location}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5C4016]">Category</h3>
                    <p className="text-gray-700">{complaint.category}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5C4016]">Assigned On</h3>
                    <p className="text-gray-700">{complaint.assignedDate || complaint.date}</p>
                  </div>
                </div>
              </div>

              {/* Right: Description & Actions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#8C52FF] mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed bg-[#FFF1D1] p-5 rounded-2xl">
                    {complaint.description}
                  </p>
                </div>

                {canComplete && !showCompleteForm && (
                  <div className="pt-6">
                    <Button
                      variant="primary"
                      size="large"
                      onClick={() => setShowCompleteForm(true)}
                      className="w-full md:w-auto"
                    >
                      Mark as Completed
                    </Button>
                  </div>
                )}

                {showCompleteForm && (
                  <CompleteWorkForm
                    onSubmit={handleCompleteSubmit}
                    loading={submitLoading}
                    complaintTitle={complaint.title}
                  />
                )}

                {complaint.status === 'Completed' && (
                  <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center">
                    <h3 className="text-xl font-bold text-green-700 mb-2">Task Completed</h3>
                    <p className="text-green-600">Completion proof has been submitted</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedComplaintDetail;