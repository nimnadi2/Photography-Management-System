import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import heroImg from './assets/hero-photo.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost/dental-clinic/backend/get_doctors.php')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          setDoctors([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setDoctors([]);
        setLoading(false);
      });
  }, []);

  const specialties = ['All', ...new Set(
    doctors.map((doc) => doc.specialty || doc.specialization).filter(Boolean)
  )];

  const filteredDoctors = doctors.filter((doc) => {
    const name = (doc.name || doc.doctor_name || '').toLowerCase();
    const specialty = doc.specialty || doc.specialization || '';
    const matchesSearch = name.includes(doctorSearch.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'All' || specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const handleDoctorClick = (doctorName) => {
    navigate(`/book?doctor=${encodeURIComponent(doctorName)}`);
  };

  return (
<div style={{
      fontFamily: "'Poppins', Arial, sans-serif",
      color: '#333',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #e6f2f2 100%)'
    }}>
      
     {/* Hero Section */}
      <section style={{
        position: 'relative',
        backgroundImage: `linear-gradient(rgba(0, 51, 51, 0.75), rgba(0, 51, 51, 0.6)), url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#ffffff',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Your Smile, Our Priority
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '25px', opacity: '0.95' }}>
            Professional & Caring Dental Services for Your Whole Family.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <Link to="/book" style={{
              backgroundColor: '#ffffff',
              color: '#008080',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              Book an Appointment
            </Link>
            <Link to="/my-appointments" style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '2px solid #ffffff',
              padding: '10px 22px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              My Appointments
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 50px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#008080' }}>Our Services</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          A few of our most popular treatments
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🦷</div>
            <h3 style={cardTitleStyle}>General Checkup</h3>
            <p>Comprehensive dental exams and professional cleaning.</p>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✨</div>
            <h3 style={cardTitleStyle}>Teeth Whitening</h3>
            <p>Brighten your smile with modern cosmetic treatment.</p>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔬</div>
            <h3 style={cardTitleStyle}>Root Canal</h3>
            <p>Pain-free root canal treatment to save infected teeth.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/services" style={{
            display: 'inline-block',
            backgroundColor: '#008080',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}>
            View All Services →
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 50px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#008080' }}>Why Choose Us</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Trusted dental care you can count on
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          <div style={whyCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🦷</div>
            <h4 style={{ color: '#008080', marginBottom: '8px' }}>Experienced Doctors</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Qualified specialists with years of expertise</p>
          </div>

          <div style={whyCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏥</div>
            <h4 style={{ color: '#008080', marginBottom: '8px' }}>Modern Equipment</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Latest dental technology & techniques</p>
          </div>

          <div style={whyCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
            <h4 style={{ color: '#008080', marginBottom: '8px' }}>Affordable Pricing</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Transparent, patient-friendly rates</p>
          </div>

          <div style={whyCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📅</div>
            <h4 style={{ color: '#008080', marginBottom: '8px' }}>Easy Online Booking</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Book your appointment in minutes</p>
          </div>

          <div style={whyCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>😊</div>
            <h4 style={{ color: '#008080', marginBottom: '8px' }}>Patient-Friendly Care</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Comfortable, stress-free treatment</p>
          </div>

          <div style={whyCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🕐</div>
            <h4 style={{ color: '#008080', marginBottom: '8px' }}>Flexible Hours</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Convenient scheduling for your lifestyle</p>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section style={{ backgroundColor: '#e6f2f2', padding: '50px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#008080' }}>Our Specialist Doctors</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Click on a doctor to book an appointment with them
          </p>

          {/* Search + Filter Bar */}
          {!loading && doctors.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '30px'
            }}>
              <input
                type="text"
                placeholder="Search doctor by name..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  width: '260px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <Spinner text="Loading Doctors..." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc, index) => {
                  const docName = doc.name || doc.doctor_name;
                  return (
                    <div
                      key={doc.id || index}
                      onClick={() => handleDoctorClick(docName)}
                      style={{ ...cardStyle, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                      }}
                    >
                      <h4 style={{ color: '#008080', marginBottom: '8px' }}>{docName}</h4>
                      <p style={{ color: '#666', margin: '0 0 10px 0' }}>{doc.specialty || doc.specialization || 'Dental Specialist'}</p>
                      <span style={{ color: '#0d9488', fontSize: '13px', fontWeight: '600' }}>Book with this doctor →</span>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                  {doctors.length === 0 ? 'No doctors found at the moment.' : 'No doctors match your search.'}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '50px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#008080', marginBottom: '15px' }}>About Our Dental Clinic</h2>
        <p style={{ lineHeight: '1.6', color: '#555' }}>
          We provide high-quality dental care using state-of-the-art equipment and experienced specialists.
          Your comfort and health are always our top priorities.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#222', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Dental Clinic. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

// Common Styles
const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e0e0e0',
  textAlign: 'center'
};

const cardTitleStyle = {
  color: '#008080',
  fontSize: '1.25rem',
  marginBottom: '10px'
};

const whyCardStyle = {
  backgroundColor: '#ffffff',
  padding: '24px 20px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e0e0e0',
  textAlign: 'center'
};

export default Home;