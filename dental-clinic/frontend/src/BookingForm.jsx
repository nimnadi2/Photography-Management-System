import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get('service') || 'Dental Checkup';
  const preSelectedDoctor = searchParams.get('doctor') || '';

  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    service: preSelectedService,
    doctor_name: preSelectedDoctor,
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bookingCode, setBookingCode] = useState('');
  const [bookedDetails, setBookedDetails] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setBookingCode('');
    setBookedDetails(null);

    fetch('http://localhost/dental-clinic/backend/book_appointment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 'success') {
          setMessage({ type: 'success', text: 'Appointment booked successfully!' });
          setBookingCode(data.booking_code || '');
          setBookedDetails({
            name: formData.patient_name,
            service: formData.service,
            doctor: formData.doctor_name || 'No preference',
            date: formData.date,
            time: formData.time
          });
          setFormData({ patient_name: '', phone: '', service: 'Dental Checkup', doctor_name: '', date: '', time: '' });
        } else {
          setMessage({ type: 'error', text: data.message || 'Booking failed. Try again.' });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Booking Error:', err);
        setMessage({ type: 'error', text: 'Server connection failed.' });
      });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #cbd5e1',
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    marginTop: '6px',
    marginBottom: '18px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontWeight: '600',
    fontSize: '14px',
    color: '#334155',
    display: 'block'
  };

  return (
    <div style={{
      padding: '40px 20px',
      minHeight: '85vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #e6f2f2 100%)'
    }}>
      <div style={{
        maxWidth: '520px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        padding: '35px 30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ color: '#0f766e', fontSize: '26px', margin: '0 0 8px 0', textAlign: 'center', fontWeight: '700' }}>
          Book an Appointment
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', marginBottom: '25px' }}>
          Fill in your details and we'll confirm shortly
        </p>

        {message.text && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#15803d' : '#b91c1c'
          }}>
            {message.text}
          </div>
        )}

        {bookingCode && (
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
            boxShadow: '0 6px 16px rgba(15, 118, 110, 0.25)'
          }}>
            <p style={{ color: '#e0f2fe', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Booking Code
            </p>
            <p style={{ color: '#ffffff', fontSize: '28px', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '2px' }}>
              {bookingCode}
            </p>
            <p style={{ color: '#e0f2fe', fontSize: '12px', margin: 0 }}>
              Save this code to check or cancel your appointment later
            </p>
          </div>
        )}

        {bookedDetails && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '18px 20px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#0f766e', fontSize: '14px', margin: '0 0 12px 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Booking Summary
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', fontWeight: '600' }}>Name</td>
                  <td style={{ padding: '6px 0', color: '#1e293b', textAlign: 'right' }}>{bookedDetails.name}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', fontWeight: '600' }}>Service</td>
                  <td style={{ padding: '6px 0', color: '#1e293b', textAlign: 'right' }}>{bookedDetails.service}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', fontWeight: '600' }}>Doctor</td>
                  <td style={{ padding: '6px 0', color: '#1e293b', textAlign: 'right' }}>{bookedDetails.doctor}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', fontWeight: '600' }}>Date</td>
                  <td style={{ padding: '6px 0', color: '#1e293b', textAlign: 'right' }}>{bookedDetails.date}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', fontWeight: '600' }}>Time</td>
                  <td style={{ padding: '6px 0', color: '#1e293b', textAlign: 'right' }}>{bookedDetails.time}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="patient_name"
              placeholder="e.g. John Doe"
              value={formData.patient_name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g. 0717700899"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Service</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="Dental Checkup">Dental Checkup</option>
              <option value="Teeth Cleaning">Teeth Cleaning</option>
              <option value="Tooth Extraction">Tooth Extraction</option>
              <option value="Root Canal">Root Canal</option>
              <option value="Teeth Whitening">Teeth Whitening</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Preferred Doctor <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optional)</span></label>
            <input
              type="text"
              name="doctor_name"
              placeholder="No preference"
              value={formData.doctor_name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Preferred Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Preferred Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#0d9488',
              color: '#ffffff',
              padding: '14px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
              marginTop: '10px'
            }}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;