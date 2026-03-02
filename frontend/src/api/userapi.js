import API from './index';

export const getProfile = async () => {
  try {
    const response = await API.get('/users/profile');
    
    // Check if response has success flag
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }
    
    // Return user object directly (backend ke hisaab se)
    return response.data.user || response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await API.put('/users/profile', data);
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to update profile');
    }
    
    return response.data.user || response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

export const changePassword = async (data) => {
  try {
    const response = await API.put('/users/change-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};