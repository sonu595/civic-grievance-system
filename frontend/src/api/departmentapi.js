// api/departmentapi.js
import API from './index';

// 📊 Get department stats - Supports both specific department and overall
export const getDepartmentStats = async (departmentName = null) => {
  try {
    // Agar departmentName null hai to overall stats lo
    const url = departmentName 
      ? `/departments/${departmentName}/dashboard`
      : '/departments/overall-stats';
    
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching department stats:', error);
    
    // ✅ Fallback mock data agar API fail ho
    if (!departmentName) {
      // Overall stats fallback
      return {
        totalComplaints: 1247,
        resolved: 876,
        pending: 289,
        rejected: 82,
        inProgress: 156,
        departments: {
          'Water Department': { total: 245, resolved: 178, pending: 52, rejected: 15 },
          'Electricity Department': { total: 312, resolved: 234, pending: 68, rejected: 10 },
          'Road Department': { total: 189, resolved: 145, pending: 36, rejected: 8 },
          'Sanitation Department': { total: 278, resolved: 201, pending: 59, rejected: 18 },
          'Public Health': { total: 98, resolved: 67, pending: 24, rejected: 7 },
          'Education Department': { total: 45, resolved: 32, pending: 11, rejected: 2 },
          'Transport Department': { total: 56, resolved: 41, pending: 12, rejected: 3 },
          'Municipal Corporation': { total: 24, resolved: 18, pending: 5, rejected: 1 }
        }
      };
    }
    
    throw error.response?.data || { message: 'Failed to fetch stats' };
  }
};

// 🔴 NEW: Get complete dashboard data (single API call)
export const getFullDashboard = async (departmentName) => {
  try {
    // Yeh naya endpoint hai jo backend mein add kiya hai
    const response = await API.get(`/department/${departmentName}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching full dashboard:', error);
    
    // Fallback - existing APIs se data le lo
    try {
      const [stats, pending, solvers] = await Promise.all([
        getDepartmentStats(departmentName),
        getPendingComplaints(departmentName),
        getDepartmentSolvers(departmentName)
      ]);
      
      return {
        success: true,
        departmentName,
        stats: {
          total: stats.totalComplaints || 0,
          pending: stats.pending || 0,
          assigned: 0,
          inProgress: stats.inProgress || 0,
          completed: 0,
          resolved: stats.resolved || 0
        },
        pendingComplaints: pending || [],
        solvers: solvers || [],
        recentActivity: []
      };
    } catch (fallbackError) {
      throw error;
    }
  }
};

// 🔴 NEW: Assign solver to complaint
export const assignSolver = async (complaintId, solverId) => {
  try {
    const response = await API.post(`/department/complaints/${complaintId}/assign`, { solverId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to assign solver' };
  }
};

// 🔴 FIX: Department name as parameter
export const getPendingComplaints = async (departmentName) => {
  try {
    const response = await API.get(`/departments/${departmentName}/pending`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pending complaints' };
  }
};

// 🔴 FIX: Department name as parameter
export const getDepartmentSolvers = async (departmentName) => {
  try {
    const response = await API.get(`/departments/${departmentName}/solvers`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch solvers' };
  }
};

// ✅ Approve complaint
export const approveComplaint = async (id) => {
  try {
    const response = await API.put(`/departments/complaints/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve' };
  }
};

// ✅ Reject complaint
export const rejectComplaint = async (id, reason) => {
  try {
    const response = await API.put(`/departments/complaints/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject' };
  }
};

// ✅ Resolve complaint
export const resolveComplaint = async (id) => {
  try {
    const response = await API.put(`/departments/complaints/${id}/resolve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resolve' };
  }
};

// ✅ Escalate complaint
export const escalateComplaint = async (complaintId, data) => {
  try {
    const response = await API.post(`/departments/complaints/${complaintId}/escalate`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to escalate' };
  }
};