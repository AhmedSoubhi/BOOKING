import React, { useEffect, useState } from 'react';
import { getUserBookings, updateBooking, deleteBooking } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ManageAppointments() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Please login first!');
      navigate('/login');
      return;
    }

    getUserBookings(token).then(setBookings).catch(console.error);
  }, [token, navigate]);

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setNewDate('');
    setNewTime('');
    setAvailableTimes([]);
    // No need to fetch available days upfront now.
  };

  // Once a date is chosen, fetch times for that specific date
  const handleDateChange = async (selectedDate) => {
    setNewDate(selectedDate);
    setNewTime(''); // Reset time

    if (!selectedDate) return;

    try {
      const currentBooking = bookings.find(b => b.id === editingId);
      const response = await axios.get(
        `http://localhost:5000/availability?provider_id=${currentBooking.provider_id}&service_id=${currentBooking.service_id}&date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableTimes(response.data); // This should be the list of available time slots for that day
    } catch (err) {
      console.error(err);
      alert('Failed to fetch available times.');
    }
  };

  const handleUpdate = async () => {
    if (!newDate || !newTime) {
      alert('Please select both a new date and a new time.');
      return;
    }
    try {
      await updateBooking(editingId, newDate, newTime, token);
      alert('Appointment rescheduled successfully!');
      const updatedBookings = await getUserBookings(token);
      setBookings(updatedBookings);
      setEditingId(null);
      setAvailableTimes([]);
    } catch (err) {
      console.error(err);
      alert('Failed to reschedule appointment.');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await deleteBooking(id, token);
        alert('Appointment canceled successfully!');
        const updatedBookings = await getUserBookings(token);
        setBookings(updatedBookings);
      } catch (err) {
        console.error(err);
        alert('Failed to cancel appointment.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h2>My Appointments</h2>
      {bookings.length === 0 && <p>You have no upcoming appointments.</p>}
      {bookings.map((booking) => (
        <div key={booking.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          {editingId === booking.id ? (
            <div>
              <p>Service: {booking.service_name}</p>
              <p>Current Date: {booking.date}</p>
              <p>Current Time: {booking.time}</p>

              <label>New Date:</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />

              {newDate && availableTimes.length > 0 && (
                <>
                  <label>New Time:</label>
                  <select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                    <option value="">-- Select New Time --</option>
                    {availableTimes.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <button
                onClick={handleUpdate}
                disabled={!newDate || !newTime}
                style={{ marginTop: '10px' }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setAvailableTimes([]);
                  setNewDate('');
                  setNewTime('');
                }}
                style={{ marginLeft: '10px', marginTop: '10px' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p>Service: {booking.service_name}</p>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.time}</p>
              <p>Status: {booking.status}</p>
              <button onClick={() => handleEdit(booking)}>Reschedule</button>
              <button onClick={() => handleCancel(booking.id)}>Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManageAppointments;
