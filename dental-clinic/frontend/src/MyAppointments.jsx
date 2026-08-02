import React, { useState } from 'react';
import Spinner from './Spinner';

const MyAppointments = () => {
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    fetch(`http://localhost/dental-clinic/backend/get_my_appointments.php?phone=${encodeURIComponent(phone)}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 'success') {
          setAppointments(data.data || []);
        } else {
          setAppointments([]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Fetch error:', err);
        setAppointments([]);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSearched(true);
    fetchAppointments();
  };

  const handleCancel = (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    fetch('http://localhost/dental-clinic/backend/cancel_appointment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchAppointments();
        } else {
          alert(data.message || 'Failed to cancel appointment.');
        }
      })
      .catch((err) => {
        console.error('Cancel error:', err);
        alert('Server connection failed.');
      });
  };

  const getStatusStyle = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'cancelled') return { backgroundColor: '#fee2e2', color: '#b91c1c' };
    if (s === 'completed') return { backgroundColor: '#dcfce7', color: '#15803d' };
    if (s === 'approved') return { backgroundColor: '#dbeafe', color: '#1e40af' };
    return { backgroundColor: '#fef3c7', color: '#92400e' };
  };

  return (
    <div style={{
      minHeight: '85vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #e6f2f2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '35px 25px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#0f766e', fontSize: '28px', margin: '0 0 8px 0', fontWeight: '700' }}>
            My Appointments
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '25px' }}>
            Enter your phone number or booking code to check your appointment details.
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="e.g. 0717700899 or DC-C3843F"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                flex: '1',
                minWidth: '220px',
                padding: '12px 18px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#1e293b'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#0d9488',
                color: '#ffffff',
                padding: '12px 26px',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {searched && (
          <div style={{
            backgroundColor: '#ffffff',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#1e293b', fontSize: '18px', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              Appointments Found ({appointments.length})
            </h3>

            {loading ? (
              <Spinner text="Loading details..." />
              ) : appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <p style={{ fontSize: '16px', color: '#e11d48', fontWeight: '500', margin: 0 }}>
                  No appointments found for "{phone}"
                </p>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px' }}>
                  Please verify your phone number or booking code and try again.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0fdfa', color: '#0f766e', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '14px 16px', borderRadius: '8px 0 0 8px' }}>Code</th>
                      <th style={{ padding: '14px 16px' }}>Patient Name</th>
                      <th style={{ padding: '14px 16px' }}>Service</th>
                      <th style={{ padding: '14px 16px' }}>Date</th>
                      <th style={{ padding: '14px 16px' }}>Time</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '14px 16px', borderRadius: '0 8px 8px 0', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item, index) => {
                      const status = (item.status || 'pending').toLowerCase();
                      const canCancel = status !== 'cancelled' && status !== 'completed';
                      return (
                        <tr key={item.id || index} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '15px' }}>
                          <td style={{ padding: '16px', fontWeight: '700', color: '#0f766e', fontSize: '13px' }}>{item.booking_code || '—'}</td>
                          <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{item.patient_name}</td>
                          <td style={{ padding: '16px' }}>{item.service}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{item.appointment_date}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{item.appointment_time}</td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{
                              ...getStatusStyle(item.status),
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'inline-block',
                              textTransform: 'capitalize'
                            }}>
                              {item.status || 'Pending'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            {canCancel ? (
                              <button
                                onClick={() => handleCancel(item.id)}
                                style={{
                                  backgroundColor: '#fee2e2',
                                  color: '#b91c1c',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  fontSize: '13px',
                                  cursor: 'pointer'
                                }}
                              >
                                Cancel
                              </button>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '13px' }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;