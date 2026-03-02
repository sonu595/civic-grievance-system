// api/solverapi.js
import API from './index';

// Get assigned complaints
export const getAssignedComplaints = async () => {
  try {
    const response = await API.get('/complaints/solver/my-tasks');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch assigned tasks' };
  }
};

// Get my tasks (alias)
export const getMyTasks = getAssignedComplaints;

// Get single task details
export const getTaskDetails = async (taskId) => {
  try {
    const response = await API.get(`/solver/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    // Fallback - try complaints endpoint
    try {
      const res = await API.get(`/complaints/${taskId}`);
      return { success: true, complaint: res.data };
    } catch (fallbackError) {
      throw error.response?.data || { message: 'Failed to fetch task details' };
    }
  }
};

// Start work on complaint
export const startWork = async (complaintId) => {
  try {
    const response = await API.patch(`/solver/complaints/${complaintId}/start`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to start work' };
  }
};

// Complete work (with photo)
export const completeComplaint = async (complaintId, formData) => {
  try {
    const response = await API.post(
      `/solver/complaints/${complaintId}/complete`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to complete task' };
  }
};

// Alias for completeComplaint (if TaskDetails uses completeWork)
export const completeWork = completeComplaint;

// Get solver statistics
export const getMyStats = async () => {
  try {
    const response = await API.get('/solver/stats');
    return response.data;
  } catch (error) {
    // Fallback - calculate from tasks
    try {
      const tasks = await getAssignedComplaints();
      const tasksArray = Array.isArray(tasks) ? tasks : (tasks.data || []);
      const totalAssigned = tasksArray.length;
      const completed = tasksArray.filter(t => t.status === 'completed').length;
      const inProgress = tasksArray.filter(t => t.status === 'in-progress').length;
      const pending = tasksArray.filter(t => t.status === 'assigned').length;
      
      return {
        success: true,
        totalAssigned,
        completed,
        inProgress,
        pending
      };
    } catch (fallbackError) {
      throw error;
    }
  }
};

// Assign solver (for department)
export const assignSolver = async (complaintId, solverId) => {
  try {
    const response = await API.post(`/complaints/${complaintId}/assign`, { solverId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to assign solver' };
  }
};

// Helper function
export const formatTaskData = (task) => {
  return {
    ...task,
    formattedDate: task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-IN') : 'N/A',
    deadlineDate: task.resolutionDeadline ? new Date(task.resolutionDeadline).toLocaleDateString('en-IN') : 'N/A',
    isOverdue: task.resolutionDeadline ? new Date(task.resolutionDeadline) < new Date() : false
  };
};