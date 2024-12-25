// src/pages/BookingsHome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function BookingsHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // Retrieve the user's email from localStorage
  const userEmail = localStorage.getItem('userEmail') || '';

  // Optionally, if there's no token, you could redirect to /login or something:
  // if (!token) {
  //   navigate('/login');
  // }

  const handleBookAppointment = () => navigate('/schedule');
  const handleManageAppointments = () => navigate('/manage-appointments');

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Welcome {userEmail}! What would you like to do?</h2>
      <button style={{ margin: '10px' }} onClick={handleBookAppointment}>
        Book an Appointment
      </button>
      <button style={{ margin: '10px' }} onClick={handleManageAppointments}>
        Manage My Appointments
      </button>
    </div>
  );
}

export default BookingsHome;
