import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

export const getUserBookings = async (token) => {
  const response = await axios.get(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateBooking = async (id, date, time, token) => {
  const response = await axios.put(`${API_URL}/bookings/${id}`, {date, time}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteBooking = async (id, token) => {
  const response = await axios.delete(`${API_URL}/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
