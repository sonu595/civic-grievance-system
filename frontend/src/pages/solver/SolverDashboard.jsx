// pages/solver/SolverDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyTasks, getMyStats, formatTaskData } from '../../api/solverapi';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import StatusBadge from '../../components/common/StatusBadge';
import { motion } from 'framer-motion';

const SolverDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, statsRes] = await Promise.all([
        getMyTasks(),
        getMyStats()
      ]);
      
      const tasksData = Array.isArray(tasksRes) ? tasksRes : (tasksRes.data || []);
      const statsData = statsRes.data || statsRes || {};
      
      const formattedTasks = tasksData.map(task => formatTaskData(task));
      
      setTasks(formattedTasks);
      setStats(statsData);
    } catch (err) {
      console.error('Dashboard error:', err);
      showToast(err.message || 'Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPriorityColor = (deadline) => {
    if (!deadline) return 'text-gray-600';
    const daysLeft = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft < 1) return 'text-red-600 font-bold';
    if (daysLeft < 2) return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DDCCFF] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Toast Component */}
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
            Welcome, {user?.name || 'Solver'}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.departmentName} • {user?.specialization || 'General'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <StatCard title="Total Assigned" value={stats.totalAssigned || 0} color="#8C52FF" />
            <StatCard title="In Progress" value={stats.inProgress || 0} color="#3B82F6" />
            <StatCard title="Pending" value={stats.pending || 0} color="#E67E22" />
            <StatCard title="Completed" value={stats.completed || 0} color="#10B981" />
          </motion.div>
        )}

        {/* My Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[30px] p-6 shadow-lg border border-[#8C52FF]"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#8C52FF]">
              My Assigned Tasks ({tasks.length})
            </h2>
            <Button variant="outline" size="small" onClick={loadDashboardData}>
              🔄 Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Tasks Assigned</h3>
              <p className="text-gray-500">You don't have any pending tasks right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/solver/task/${task.id}`)}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">#{task.id}</span>
                        <StatusBadge status={task.status} />
                        {task.isOverdue && task.status !== 'completed' && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
                            Overdue
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs">
                        <span className="text-gray-500">📍 {task.location}</span>
                        <span className="text-gray-500">📅 Assigned: {formatDate(task.assignedAt)}</span>
                        <span className={getPriorityColor(task.resolutionDeadline)}>
                          Deadline: {formatDate(task.resolutionDeadline)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center md:self-center">
                      <Button
                        variant={task.status === 'completed' ? 'outline' : 'primary'}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/solver/task/${task.id}`);
                        }}
                      >
                        {task.status === 'completed' ? 'View Details' : 'Continue →'}
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar for in-progress tasks */}
                  {task.status === 'in-progress' && task.resolutionDeadline && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {Math.round(
                            ((new Date() - new Date(task.assignedAt)) / 
                            (new Date(task.resolutionDeadline) - new Date(task.assignedAt))) * 100
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#8C52FF] h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(
                              ((new Date() - new Date(task.assignedAt)) / 
                              (new Date(task.resolutionDeadline) - new Date(task.assignedAt))) * 100, 100
                            )}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <QuickActionCard
            icon="📋"
            title="All Tasks"
            description="View all your assigned tasks"
            onClick={() => navigate('/solver/dashboard')}
          />
          <QuickActionCard
            icon="✅"
            title="Completed"
            description="Tasks you've finished"
            onClick={() => {
              const completed = tasks.filter(t => t.status === 'completed');
              showToast(`You have completed ${completed.length} tasks`, 'info');
            }}
          />
          <QuickActionCard
            icon="📊"
            title="Performance"
            description="Your work statistics"
            onClick={() => showToast(`Total: ${stats?.totalAssigned}, Completed: ${stats?.completed}`, 'info')}
          />
        </motion.div>
      </div>
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

// Quick Action Card Component
const QuickActionCard = ({ icon, title, description, onClick }) => (
  <div 
    className="bg-white rounded-2xl p-6 shadow-md border border-[#8C52FF] cursor-pointer hover:shadow-lg transition"
    onClick={onClick}
  >
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-bold text-[#8C52FF] mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default SolverDashboard;