// pages/department/DepartmentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFullDashboard, assignSolver, approveComplaint, rejectComplaint, resolveComplaint } from '../../api/departmentapi';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Toast from '../../components/common/Toast'; // 🔴 NEW: Toast component
import { motion } from 'framer-motion';

const DepartmentDashboard = () => {
  const { departmentName } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🔴 NEW: Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const navigate = useNavigate();
  const currentDept = departmentName || user?.departmentName || 'Water Department';

  useEffect(() => {
    loadDashboard();
  }, [currentDept]);

  // 🔴 NEW: Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getFullDashboard(currentDept);
      if (response.success) {
        setData(response);
      } else {
        setError(response.message || 'Failed to load dashboard');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // 🔴 FIXED: Approve complaint with proper UI update
  const handleApprove = async (complaintId) => {
    try {
      const response = await approveComplaint(complaintId);
      if (response.success) {
        showToast('✅ Complaint approved successfully!', 'success');
        loadDashboard(); // Refresh data
      } else {
        showToast(response.message || 'Failed to approve', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to approve', 'error');
    }
  };

  // 🔴 FIXED: Reject complaint with proper UI update
  const handleReject = async (complaintId) => {
    if (!window.confirm('Are you sure you want to reject this complaint?')) return;
    
    try {
      const response = await rejectComplaint(complaintId);
      if (response.success) {
        showToast('❌ Complaint rejected', 'info');
        loadDashboard();
      } else {
        showToast(response.message || 'Failed to reject', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to reject', 'error');
    }
  };

  // 🔴 FIXED: Resolve complaint
  const handleResolve = async (complaintId) => {
    try {
      const response = await resolveComplaint(complaintId);
      if (response.success) {
        showToast('🎉 Complaint resolved!', 'success');
        loadDashboard();
      } else {
        showToast(response.message || 'Failed to resolve', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to resolve', 'error');
    }
  };

  const handleAssignClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowAssignModal(true);
  };

  const handleAssign = async (solverId) => {
    if (!solverId || !selectedComplaint) return;
    
    setAssignLoading(true);
    try {
      const response = await assignSolver(selectedComplaint.id, solverId);
      if (response.success) {
        showToast('👤 Solver assigned successfully!', 'success');
        setShowAssignModal(false);
        loadDashboard();
      } else {
        showToast(response.message || 'Failed to assign solver', 'error');
      }
    } catch (err) {
      showToast('Failed to assign solver', 'error');
    } finally {
      setAssignLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const filteredPending = data?.pendingComplaints?.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDEBD0] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔴 NEW: Toast Component */}
        <Toast 
          show={toast.show} 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-[#8C52FF]">
            {currentDept}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track all complaints in your department
          </p>
        </motion.div>

        {/* Stats Cards */}
        {data?.stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          >
            <StatCard title="Total" value={data.stats.total} color="#8C52FF" />
            <StatCard title="Pending" value={data.stats.pending} color="#E67E22" />
            <StatCard title="Approved" value={data.stats.approved || 0} color="#10B981" />
            <StatCard title="Assigned" value={data.stats.assigned} color="#3B82F6" />
            <StatCard title="In Progress" value={data.stats.inProgress} color="#8B5CF6" />
            <StatCard title="Completed" value={data.stats.completed} color="#059669" />
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search complaints by title, description, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 rounded-2xl border border-gray-300 focus:border-[#8C52FF] outline-none shadow-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton 
            active={activeTab === 'pending'} 
            onClick={() => setActiveTab('pending')}
            count={data?.pendingComplaints?.length || 0}
            label="Pending"
          />
          <TabButton 
            active={activeTab === 'approved'} 
            onClick={() => setActiveTab('approved')}
            count={data?.approvedComplaints?.length || 0}
            label="Approved"
          />
          <TabButton 
            active={activeTab === 'in-progress'} 
            onClick={() => setActiveTab('in-progress')}
            count={data?.inProgressComplaints?.length || 0}
            label="In Progress"
          />
          <TabButton 
            active={activeTab === 'completed'} 
            onClick={() => setActiveTab('completed')}
            count={data?.completedComplaints?.length || 0}
            label="Completed"
          />
          <TabButton 
            active={activeTab === 'solvers'} 
            onClick={() => setActiveTab('solvers')}
            count={data?.solvers?.length || 0}
            label="Solvers"
          />
        </div>

        {/* Content based on active tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* PENDING TAB */}
          {activeTab === 'pending' && (
            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-[#8C52FF]">
              <h2 className="text-xl font-bold text-[#8C52FF] mb-6">
                Pending Approval ({filteredPending.length})
              </h2>

              {filteredPending.length === 0 ? (
                <EmptyState message="No pending complaints" />
              ) : (
                <div className="space-y-4">
                  {filteredPending.map(complaint => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      type="pending"
                      onAssign={() => handleAssignClick(complaint)}
                      onView={() => navigate(`/complaint/${complaint.id}`)}
                      onApprove={() => handleApprove(complaint.id)}
                      onReject={() => handleReject(complaint.id)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* APPROVED TAB */}
          {activeTab === 'approved' && (
            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-[#8C52FF]">
              <h2 className="text-xl font-bold text-[#8C52FF] mb-6">
                Approved (Ready for Assignment)
              </h2>
              {data?.approvedComplaints?.length === 0 ? (
                <EmptyState message="No approved complaints" />
              ) : (
                <div className="space-y-4">
                  {data?.approvedComplaints?.map(complaint => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      type="approved"
                      onAssign={() => handleAssignClick(complaint)}
                      onView={() => navigate(`/complaint/${complaint.id}`)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* IN PROGRESS TAB */}
          {activeTab === 'in-progress' && (
            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-[#8C52FF]">
              <h2 className="text-xl font-bold text-[#8C52FF] mb-6">
                In Progress ({data?.inProgressComplaints?.length || 0})
              </h2>
              {data?.inProgressComplaints?.length === 0 ? (
                <EmptyState message="No complaints in progress" />
              ) : (
                <div className="space-y-4">
                  {data?.inProgressComplaints?.map(complaint => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      type="in-progress"
                      onView={() => navigate(`/complaint/${complaint.id}`)}
                      formatDate={formatDate}
                      getTimeAgo={getTimeAgo}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COMPLETED TAB */}
          {activeTab === 'completed' && (
            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-[#8C52FF]">
              <h2 className="text-xl font-bold text-[#8C52FF] mb-6">
                Completed ({data?.completedComplaints?.length || 0})
              </h2>
              {data?.completedComplaints?.length === 0 ? (
                <EmptyState message="No completed complaints" />
              ) : (
                <div className="space-y-4">
                  {data?.completedComplaints?.map(complaint => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      type="completed"
                      onView={() => navigate(`/complaint/${complaint.id}`)}
                      onResolve={() => handleResolve(complaint.id)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SOLVERS TAB */}
          {activeTab === 'solvers' && (
            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-[#8C52FF]">
              <h2 className="text-xl font-bold text-[#8C52FF] mb-6">
                Department Solvers ({data?.solvers?.length || 0})
              </h2>
              {data?.solvers?.length === 0 ? (
                <EmptyState message="No solvers in this department" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data?.solvers?.map(solver => (
                    <SolverCard key={solver.id} solver={solver} />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Assign Solver Modal */}
      {showAssignModal && selectedComplaint && (
        <AssignModal
          complaint={selectedComplaint}
          solvers={data?.solvers || []}
          onAssign={handleAssign}
          onClose={() => setShowAssignModal(false)}
          loading={assignLoading}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, color }) => (
  <div className="bg-[#FFF4D9] rounded-[20px] p-1">
    <div className="bg-white rounded-[18px] p-4 text-center">
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-600 mt-1">{title}</p>
    </div>
  </div>
);

// Tab Button Component
const TabButton = ({ active, onClick, count, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
      active 
        ? 'bg-[#8C52FF] text-white shadow-lg' 
        : 'bg-white text-[#8C52FF] hover:bg-[#FFF4D9] border border-gray-200'
    }`}
  >
    {label} {count > 0 && `(${count})`}
  </button>
);

// Empty State Component
const EmptyState = ({ message }) => (
  <div className="text-center py-12 text-gray-500">
    <div className="text-6xl mb-4">📭</div>
    <p className="text-lg">{message}</p>
  </div>
);

// Complaint Card Component
const ComplaintCard = ({ complaint, type, onAssign, onView, onApprove, onReject, onResolve, formatDate, getTimeAgo }) => (
  <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white">
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            #{complaint.id}
          </span>
          <StatusBadge status={complaint.status} />
          {complaint.assignedSolverName && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              👤 {complaint.assignedSolverName}
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-lg">{complaint.title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {complaint.description}
        </p>
        
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
          <span>📍 {complaint.location}</span>
          <span>👤 {complaint.userName || 'Anonymous'}</span>
          <span>📅 {formatDate(complaint.createdAt)}</span>
        </div>

        {type === 'in-progress' && complaint.startedAt && (
          <div className="mt-3">
            <p className="text-xs text-gray-500">Started: {getTimeAgo?.(complaint.startedAt)}</p>
          </div>
        )}

        {type === 'completed' && complaint.completionComment && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600">Work Summary:</p>
            <p className="text-sm mt-1">{complaint.completionComment}</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 items-center md:self-center">
        <Button variant="outline" size="small" onClick={onView}>
          View
        </Button>
        
        {type === 'pending' && (
          <>
            <Button variant="primary" size="small" onClick={onApprove}>
              Approve
            </Button>
            <Button variant="danger" size="small" onClick={onReject}>
              Reject
            </Button>
          </>
        )}
        
        {type === 'approved' && onAssign && (
          <Button variant="primary" size="small" onClick={onAssign}>
            Assign Solver
          </Button>
        )}
        
        {type === 'completed' && onResolve && (
          <Button
            variant="primary"
            size="small"
            onClick={onResolve}
            className="bg-green-600 hover:bg-green-700"
          >
            Mark Resolved
          </Button>
        )}
      </div>
    </div>
  </div>
);

// Solver Card Component
const SolverCard = ({ solver }) => (
  <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-white">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-[#8C52FF] text-white flex items-center justify-center font-bold text-lg">
        {solver.name?.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="font-bold">{solver.name}</p>
        <p className="text-sm text-gray-600">{solver.specialization || 'General'}</p>
        <div className="flex gap-3 mt-2 text-xs">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {solver.activeTasks || 0} Active
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Assign Modal Component
const AssignModal = ({ complaint, solvers, onAssign, onClose, loading }) => {
  const [selectedSolver, setSelectedSolver] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-[#8C52FF] mb-4">
          Assign Solver
        </h2>
        
        <p className="text-gray-600 mb-4">
          Complaint: <span className="font-bold">#{complaint.id}</span> - {complaint.title}
        </p>

        {solvers.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            No solvers available
          </p>
        ) : (
          <select
            value={selectedSolver}
            onChange={(e) => setSelectedSolver(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:border-[#8C52FF] outline-none"
          >
            <option value="">Select a solver</option>
            {solvers.map(solver => (
              <option key={solver.id} value={solver.id}>
                {solver.name} - {solver.specialization || 'General'}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => onAssign(selectedSolver)}
            disabled={!selectedSolver || solvers.length === 0 || loading}
            className="flex-1"
          >
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DepartmentDashboard;