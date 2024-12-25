import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AppointmentScheduler.css';

function AppointmentScheduler() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/services')
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
      });
  }, []);

  const handleCheckAvailability = () => {
    if (!selectedService || !date) return;

    axios
      .get(
        `http://localhost:5000/availability?provider_id=1&service_id=${selectedService}&date=${date}`
      )
      .then((res) => {
        setAvailableSlots(res.data);
      })
      .catch((err) => {
        console.error('Error checking availability:', err);
      });
  };

  const handleBookAppointment = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      return;
    }

    axios
      .post(
        'http://localhost:5000/bookings',
        {
          provider_id: 1,
          service_id: selectedService,
          date: date,
          time: selectedSlot
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        console.log('Booking success:', res.data);
        setSuccessMessage('Appointment booked successfully!');
        setTimeout(() => {
          navigate('/bookings-home');
        }, 2000);
      })
      .catch((err) => {
        console.error('Booking error:', err);
        if (err.response && err.response.data && err.response.data.error) {
          alert(`Failed: ${err.response.data.error}`);
        } else {
          alert('Failed to book appointment');
        }
      });
  };

  return (
    <div className="appointment-container">
      <h1 className="appointment-title">Book an Appointment</h1>

      <div className="form-group">
        <label className="form-label">Service:</label>
        <select
          className="form-input"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">-- Select Service --</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} ({service.duration} min) - {service.price} AED
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Date:</label>
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-check" onClick={handleCheckAvailability}>
        Check Availability
      </button>

      {availableSlots.length > 0 && (
        <div className="form-group">
          <label className="form-label">Available Time Slots:</label>
          <select
            className="form-input"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">-- Select Time --</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSlot && (
        <button className="btn btn-book" onClick={handleBookAppointment}>
          Book Now
        </button>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default AppointmentScheduler;
