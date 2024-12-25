// client/src/services/authService.js
import axios from 'axios';

const API_URL = "http://localhost:5000/auth";

export const registerUser = async (name, email, password, phone) => {
  const response = await axios.post(`${API_URL}/register`, {
    name, email, password, phone
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email, password
  });
  return response.data;
};
