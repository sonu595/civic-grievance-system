import API from './index';

export const registerUser = async (data) => {
  try {
    const response = await API.post('/auth/register', data);
    return response.data; // Return full response data
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const loginUser = async (data) => {
  try {
    const response = await API.post('/auth/login', data);
    return response.data; // Return full response data
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};