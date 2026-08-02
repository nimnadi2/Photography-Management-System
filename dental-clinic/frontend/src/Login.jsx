import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    fetch('http://localhost/dental-clinic/backend/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error("Server Error: " + text);
        }
      })
      .then((data) => {
        setLoading(false);
        if (data.status === 'success') {
          setStatus({ type: 'success', text: 'Login Successful! Redirecting...' });
          localStorage.setItem('adminLoggedIn', 'true');
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1000);
        } else {
          setStatus({ type: 'error', text: data.message || 'Invalid Credentials' });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Login Fetch Error:', err);
        setStatus({ type: 'error', text: err.message || 'Server connection failed!' });
      });
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #e6f2f2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: '45px 38px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.12)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px auto',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 8px 20px rgba(15, 118, 110, 0.3)'
          }}>
            🔒
          </div>
        </div>
        <h2 style={{ textAlign: 'center', color: '#0f766e', marginBottom: '8px', fontSize: '26px', fontWeight: '700' }}>
          Admin Login
        </h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '28px' }}>
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                marginTop: '6px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                boxSizing: 'border-box',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f8fafc',
                transition: '0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#14b8a6';
                e.target.style.backgroundColor = '#fff';
                e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                marginTop: '6px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                boxSizing: 'border-box',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f8fafc',
                transition: '0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#14b8a6';
                e.target.style.backgroundColor = '#fff';
                e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(90deg, #0f766e, #14b8a6)',
              color: '#fff',
              padding: '13px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '15px',
              marginTop: '6px',
              boxShadow: '0 6px 16px rgba(15, 118, 110, 0.25)',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {status && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: status.type === 'success' ? '#166534' : '#991b1b'
          }}>
            {status.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;