import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, ShoppingBag, Users, Clock, Settings, RefreshCw, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ books: 0, orders: 0, pendingOrders: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleSystemUpdate = async () => {
    if (!window.confirm('Are you sure you want to update the system? This will replace core files and restart the server.')) return;
    
    setUpdateLoading(true);
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/system/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ updateUrl: 'https://example.com/latest-release.zip' })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'System updated successfully!');
        window.location.reload();
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (error) {
      alert('An error occurred during the update process.');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button 
          onClick={handleSystemUpdate}
          disabled={updateLoading}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: updateLoading ? 'not-allowed' : 'pointer', opacity: updateLoading ? 0.5 : 1 }}
        >
          <RefreshCw size={18} style={{ animation: updateLoading ? 'spin 1s linear infinite' : 'none' }} />
          {updateLoading ? 'Updating System...' : 'Check for System Updates'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a' }}><Book size={24} /></div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Total Books</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.books}</div>
            </div>
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb' }}><ShoppingBag size={24} /></div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Total Orders</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.orders}</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#ffedd5', color: '#ea580c' }}><Clock size={24} /></div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Pending Orders</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.pendingOrders}</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#9333ea' }}><Users size={24} /></div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Total Users</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.users}</div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
