import { useState, useEffect } from 'react';
import { UserCheck, UserX, RefreshCw, Search } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (user: any) => {
    setToggling(user.id);
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
    });
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    setToggling(null);
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>ব্যবহারকারী ব্যবস্থাপনা (Users)</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Video/Audio access দিতে ব্যবহারকারীর অ্যাকাউন্ট <strong>Active</strong> করুন।
          </p>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <RefreshCw size={16} /> রিফ্রেশ
        </button>
      </div>

      <div className="book-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
            className="form-control"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>লোড হচ্ছে...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#64748b' }}>কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
      ) : (
        <div className="book-card" style={{ overflow: 'hidden', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>নাম</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>ইমেইল</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>নিবন্ধন তারিখ</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Video/Audio Access</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{user.name || '—'}</td>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {new Date(user.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {user.isActive ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#f0fdf4', color: '#166534', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                        <UserCheck size={14} /> Active
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fef2f2', color: '#991b1b', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                        <UserX size={14} /> Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleActive(user)}
                      disabled={toggling === user.id}
                      style={{
                        padding: '0.5rem 1.2rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        background: user.isActive ? '#fef2f2' : '#f0fdf4',
                        color: user.isActive ? '#dc2626' : '#16a34a',
                        opacity: toggling === user.id ? 0.6 : 1,
                      }}
                    >
                      {toggling === user.id ? '...' : user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
