import API from './index';

export const fileComplaint = async (formData) => {
  try {
    // ✅ JSON data bhejna hai, FormData nahi
        const response = await API.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to file complaint' };
  }
};

export const getMyComplaints = async () => {
  try {
    const response = await API.get('/complaints/user');
    return response.data; // ✅ Direct array return
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch complaints' };
  }
};

// 🔴 NEW: Get All Complaints (Public) - YE ADD KARO
export const getAllComplaints = async () => {
  try {
    const response = await API.get('/complaints/all');
    // Agar response array hai to direct return, nahi to response.data.complaints se
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.complaints) {
      return response.data.complaints;
    } else {
      return response.data || [];
    }
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    throw error.response?.data || { message: 'Failed to fetch all complaints' };
  }
};

export const getComplaintById = async (id) => {
  try {
    const response = await API.get(`/complaints/${id}`);
    return response.data.complaint || response.data; // ✅ response.data.complaint hai
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch complaint' };
  }
};