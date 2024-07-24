import axios from 'axios';

const API_URL = 'https://tracker-api-gamma.vercel.app/api/auth'; // Use your machine's IP address

const handleApiError = (error, defaultMessage) => {
  console.error(`${defaultMessage} error:`, error.message); // Log error data
  throw new Error(error.response?.data?.message || defaultMessage);
};

export const loginUser = async (email, password) => {
  try {
    console.log(`Attempting to login with ${email} and ${password}`); // Log request data
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login response:', response.data); // Log response data
    return response.data;
  } catch (error) {
    handleApiError(error, 'Login failed');
  }
};

export const signupUser = async (name, email, password) => {
  try {
    console.log(`Attempting to signup with ${name}, ${email}, and ${password}`); // Log request data
    const response = await axios.post(`${API_URL}/signup`, { name, email, password });
    console.log('Signup response:', response.data); // Log response data
    return response.data;
  } catch (error) {
    handleApiError(error, 'Signup failed');
  }
};
