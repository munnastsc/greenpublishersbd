import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ margin: '0 auto', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
          Admin Portal
        </h2>
        <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563', marginBottom: '2rem' }}>
          Sign in to manage Green Publishers
        </p>

        <div style={{ backgroundColor: '#ffffff', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleLogin}>
            {error && (
              <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #f87171', padding: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>{error}</p>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '0', left: '0', paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <Mail style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                </div>
                <input
                  type="email"
                  required
                  style={{ display: 'block', width: '100%', paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                  placeholder="admin@greenpublishers.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '0', left: '0', paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <Lock style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                </div>
                <input
                  type="password"
                  required
                  style={{ display: 'block', width: '100%', paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.75rem 1rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: '#ffffff', backgroundColor: 'var(--primary)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => { if(!loading) e.currentTarget.style.backgroundColor = 'var(--primary-dark)'; }}
                onMouseLeave={(e) => { if(!loading) e.currentTarget.style.backgroundColor = 'var(--primary)'; }}
              >
                {loading ? '...' : 'Sign in to Dashboard'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
