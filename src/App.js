// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AppointmentScheduler from './pages/AppointmentScheduler';
import BookingsHome from './pages/BookingsHome';
import ManageAppointments from './pages/ManageAppointments';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';  // <--- import the private route

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div>
            <h1>Welcome to the Home Page</h1>
            <p><a href="/register">Register</a> | <a href="/login">Login</a></p>
          </div>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route
          path="/bookings-home"
          element={
            <PrivateRoute>
              <BookingsHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-appointments"
          element={
            <PrivateRoute>
              <ManageAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <AppointmentScheduler />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
