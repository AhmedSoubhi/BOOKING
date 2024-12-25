import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  // Service form inputs
  const [providerId, setProviderId] = useState(1);
  const [serviceName, setServiceName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    // 1) Parse token from ?token=XYZ
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      // Store it in localStorage for future requests
      localStorage.setItem('token', tokenFromUrl);

      // Remove token from the URL (optional, for cleanliness)
      window.history.replaceState({}, '', window.location.pathname);
    }

    // 2) Now use the stored token for all requests
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      alert('No token found. Please log in via Chatwoot as admin first.');
      return;
    }

    // Fetch appointments
    axios
      .get('http://localhost:5000/bookings/admin/all', {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => {
        console.error('Failed to fetch appointments:', err);
        alert('Error fetching appointments');
      });

    // Fetch services
    axios
      .get('http://localhost:5000/services/admin', {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setServices(res.data))
      .catch((err) => {
        console.error('Failed to fetch services:', err);
        alert('Error fetching services');
      });
  }, []);

  // Create a new service
  const handleCreateService = () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      alert('No token found. Please log in again.');
      return;
    }

    if (!serviceName || !duration || !price) {
      alert('Please fill all fields.');
      return;
    }

    axios
      .post(
        'http://localhost:5000/services/admin',
        {
          provider_id: providerId,
          name: serviceName,
          duration: duration,
          price: price,
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
      .then((res) => {
        alert(res.data.message || 'Service created');
        // Re-fetch the services
        return axios.get('http://localhost:5000/services/admin', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      })
      .then((res) => {
        setServices(res.data);
        setServiceName('');
        setDuration('');
        setPrice('');
      })
      .catch((err) => {
        console.error('Failed to create service:', err);
        alert('Error creating service');
      });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <h1>Admin Panel</h1>

      <h2>All Appointments</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Service Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.booking_id}>
              <td>{appt.booking_id}</td>
              <td>{appt.user_name}</td>
              <td>{appt.user_email}</td>
              <td>{appt.service_name}</td>
              <td>{appt.date}</td>
              <td>{appt.time}</td>
              <td>{appt.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>Manage Services</h2>
      <h3>Create New Service</h3>
      <div style={{ marginBottom: '20px' }}>
        <div>
          <label>Provider ID: </label>
          <input
            type="number"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
          />
        </div>
        <div>
          <label>Service Name: </label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>
        <div>
          <label>Duration (minutes): </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <label>Price (AED): </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button onClick={handleCreateService}>Create Service</button>
      </div>

      <h3>Existing Services</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Service ID</th>
            <th>Provider ID</th>
            <th>Name</th>
            <th>Duration</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => (
            <tr key={svc.id}>
              <td>{svc.id}</td>
              <td>{svc.provider_id}</td>
              <td>{svc.name}</td>
              <td>{svc.duration}</td>
              <td>{svc.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
