import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', experience: '', photo_emoji: '🦷' });
  const [doctorMessage, setDoctorMessage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editDoctor, setEditDoctor] = useState({ name: '', specialty: '', experience: '', photo_emoji: '🦷' });
  const [editMessage, setEditMessage] = useState('');

  const fetchDoctors = () => {
    setDoctorsLoading(true);
    fetch('http://localhost/dental-clinic/backend/get_doctors.php')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(Array.isArray(data) ? data : []);
        setDoctorsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setDoctorsLoading(false);
      });
  };

  const fetchAppointments = () => {
    fetch('http://localhost/dental-clinic/backend/get_appointments.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setAppointments(data.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      });
  };

  const fetchStats = () => {
    fetch('http://localhost/dental-clinic/backend/get_stats.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setStats(data.data);
        }
      })
      .catch((err) => console.error('Error fetching stats:', err));
  };

  useEffect(() => {
    fetchAppointments();
    fetchStats();
    fetchDoctors();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    fetch('http://localhost/dental-clinic/backend/update_status.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchStats();
        } else {
          alert(data.message || 'Failed to update status.');
          fetchAppointments();
        }
      })
      .catch((err) => {
        console.error('Update status error:', err);
        alert('Server connection failed.');
        fetchAppointments();
      });
  };

  const filteredAppointments = appointments.filter((item) =>
    (item.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.phone || '').includes(search) ||
    (item.service || '').toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: 'Total', value: stats?.total, bg: '#f0fdfa', color: '#0f766e' },
    { label: 'Pending', value: stats?.pending, bg: '#fef9c3', color: '#a16207' },
    { label: 'Approved', value: stats?.approved, bg: '#dbeafe', color: '#1e40af' },
    { label: 'Completed', value: stats?.completed, bg: '#dcfce7', color: '#15803d' },
    { label: 'Cancelled', value: stats?.cancelled, bg: '#fee2e2', color: '#b91c1c' },
    { label: "Today's", value: stats?.today, bg: '#ede9fe', color: '#6d28d9' },
  ];

  const statusColors = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    approved: { bg: '#dbeafe', color: '#1e40af' },
    completed: { bg: '#dcfce7', color: '#166534' },
    cancelled: { bg: '#fee2e2', color: '#991b1b' },
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.experience) {
      setDoctorMessage('Please fill all fields.');
      return;
    }

    fetch('http://localhost/dental-clinic/backend/add_doctor.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoctor),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDoctorMessage('Doctor added successfully!');
          setNewDoctor({ name: '', specialty: '', experience: '', photo_emoji: '🦷' });
          fetchDoctors();
        } else {
          setDoctorMessage(data.message || 'Failed to add doctor.');
        }
      })
      .catch((err) => {
        console.error('Add doctor error:', err);
        setDoctorMessage('Server connection failed.');
      });
  };

  const handleDeleteDoctor = (id) => {
    if (!window.confirm('Remove this doctor?')) return;

    fetch('http://localhost/dental-clinic/backend/delete_doctor.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchDoctors();
        } else {
          alert(data.message || 'Failed to delete doctor.');
        }
      })
      .catch((err) => console.error('Delete doctor error:', err));
  };

  const startEditing = (doc) => {
    setEditingId(doc.id);
    setEditDoctor({
      name: doc.name || '',
      specialty: doc.specialty || '',
      experience: doc.experience || '',
      photo_emoji: doc.photo_emoji || '🦷'
    });
    setEditMessage('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditMessage('');
  };

  const handleEditDoctor = (e, id) => {
    e.preventDefault();
    if (!editDoctor.name || !editDoctor.specialty || !editDoctor.experience) {
      setEditMessage('Please fill all fields.');
      return;
    }

    fetch('http://localhost/dental-clinic/backend/edit_doctor.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editDoctor }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEditingId(null);
          fetchDoctors();
        } else {
          setEditMessage(data.message || 'Failed to update doctor.');
        }
      })
      .catch((err) => {
        console.error('Edit doctor error:', err);
        setEditMessage('Server connection failed.');
      });
  };

  return (
    <div style={{
      minHeight: '85vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #e6f2f2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <h2 style={{ color: '#0f766e', fontSize: '28px', margin: '0 0 20px 0', fontWeight: '700' }}>
          Admin Dashboard
        </h2>

        {/* Stats Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '14px',
            marginBottom: '25px'
          }}>
            {statCards.map((card) => (
              <div key={card.label} style={{
                backgroundColor: card.bg,
                color: card.color,
                borderRadius: '14px',
                padding: '18px 16px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontSize: '26px', fontWeight: '700', lineHeight: '1.2' }}>
                  {card.value ?? 0}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px', opacity: 0.85 }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Breakdown */}
        {stats && stats.by_service && stats.by_service.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px 24px',
            marginBottom: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '15px', color: '#334155', margin: '0 0 14px 0', fontWeight: '700' }}>
              Bookings by Service
            </h3>
            {stats.by_service.map((s) => {
              const max = Math.max(...stats.by_service.map((x) => parseInt(x.count)));
              const widthPct = max > 0 ? (parseInt(s.count) / max) * 100 : 0;
              return (
                <div key={s.service} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                    <span>{s.service}</span>
                    <span style={{ fontWeight: '700' }}>{s.count}</span>
                  </div>
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${widthPct}%`,
                      backgroundColor: '#14b8a6',
                      height: '100%',
                      borderRadius: '8px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Appointments Table */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <span style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '8px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '14px' }}>
              Total Appointments: {appointments.length}
            </span>

            <input
              type="text"
              placeholder="Search by name, phone, or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                width: '300px',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
         {loading ? (
          <Spinner text="Loading records..." />
           ) : filteredAppointments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>No appointments found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0fdfa', color: '#0f766e', fontSize: '13px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px' }}>ID</th>
                    <th style={{ padding: '14px' }}>Patient Name</th>
                    <th style={{ padding: '14px' }}>Phone</th>
                    <th style={{ padding: '14px' }}>Service</th>
                    <th style={{ padding: '14px' }}>Doctor</th>
                    <th style={{ padding: '14px' }}>Date</th>
                    <th style={{ padding: '14px' }}>Time</th>
                    <th style={{ padding: '14px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((item) => {
                    const currentStatus = (item.status || 'pending').toLowerCase();
                    const colors = statusColors[currentStatus] || statusColors.pending;
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '14px' }}>
                        <td style={{ padding: '14px', color: '#94a3b8' }}>#{item.id}</td>
                        <td style={{ padding: '14px', fontWeight: '600', color: '#0f172a' }}>{item.patient_name}</td>
                        <td style={{ padding: '14px' }}>{item.phone}</td>
                        <td style={{ padding: '14px' }}>{item.service}</td>
                        <td style={{ padding: '14px', color: item.doctor_name ? '#334155' : '#cbd5e1' }}>
                          {item.doctor_name || 'No preference'}
                        </td>
                        <td style={{ padding: '14px' }}>{item.appointment_date}</td>
                        <td style={{ padding: '14px' }}>{item.appointment_time}</td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.color,
                              padding: '6px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              border: 'none',
                              outline: 'none',
                              cursor: 'pointer',
                              textTransform: 'capitalize'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Doctors Management Section */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ color: '#0f766e', fontSize: '20px', margin: '0 0 20px 0', fontWeight: '700' }}>
            Manage Doctors
          </h3>

          {/* Add Doctor Form */}
          <form onSubmit={handleAddDoctor} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '15px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>Name</label>
              <input
                type="text"
                placeholder="Dr. John Doe"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>Specialty</label>
              <input
                type="text"
                placeholder="Orthodontist"
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>Experience</label>
              <input
                type="text"
                placeholder="5 years"
                value={newDoctor.experience}
                onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>Icon</label>
              <select
                value={newDoctor.photo_emoji}
                onChange={(e) => setNewDoctor({ ...newDoctor, photo_emoji: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option value="🦷">🦷</option>
                <option value="👨‍⚕️">👨‍⚕️</option>
                <option value="👩‍⚕️">👩‍⚕️</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#0d9488',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                height: 'fit-content'
              }}
            >
              Add Doctor
            </button>
          </form>

          {doctorMessage && (
            <p style={{ fontSize: '13px', color: doctorMessage.includes('success') ? '#15803d' : '#b91c1c', marginBottom: '15px' }}>
              {doctorMessage}
            </p>
          )}

          {/* Doctors List */}
          {doctorsLoading ? (
            <Spinner text="Loading doctors..." />
          ) : doctors.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No doctors added yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {doctors.map((doc, index) => (
                <div key={doc.id || index} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  {editingId === doc.id ? (
                    <form onSubmit={(e) => handleEditDoctor(e, doc.id)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        value={editDoctor.name}
                        onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                        placeholder="Name"
                        style={{ padding: '8px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                      <input
                        type="text"
                        value={editDoctor.specialty}
                        onChange={(e) => setEditDoctor({ ...editDoctor, specialty: e.target.value })}
                        placeholder="Specialty"
                        style={{ padding: '8px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                      <input
                        type="text"
                        value={editDoctor.experience}
                        onChange={(e) => setEditDoctor({ ...editDoctor, experience: e.target.value })}
                        placeholder="Experience"
                        style={{ padding: '8px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                      <select
                        value={editDoctor.photo_emoji}
                        onChange={(e) => setEditDoctor({ ...editDoctor, photo_emoji: e.target.value })}
                        style={{ padding: '8px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      >
                        <option value="🦷">🦷</option>
                        <option value="👨‍⚕️">👨‍⚕️</option>
                        <option value="👩‍⚕️">👩‍⚕️</option>
                      </select>

                      {editMessage && (
                        <p style={{ fontSize: '12px', color: '#b91c1c', margin: 0 }}>{editMessage}</p>
                      )}

                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                          type="submit"
                          style={{
                            flex: 1,
                            backgroundColor: '#0d9488',
                            color: '#fff',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          style={{
                            flex: 1,
                            backgroundColor: '#e2e8f0',
                            color: '#334155',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '20px' }}>{doc.photo_emoji || '🦷'}</div>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{doc.name}</div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>{doc.specialty} · {doc.experience}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => startEditing(doc)}
                          style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doc.id)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;