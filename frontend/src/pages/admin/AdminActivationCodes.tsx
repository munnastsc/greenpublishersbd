import { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';

export default function AdminActivationCodes() {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({ code: '', isUsed: false, deviceId: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/activation');
      if (res.ok) setItems(await res.json());
    } finally { setLoading(false); }
  };

  const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const bodyToSubmit = { ...formData };
    if (!editingId && !bodyToSubmit.code) bodyToSubmit.code = generateRandomCode();
    
    const body = editingId ? { id: editingId, ...bodyToSubmit } : bodyToSubmit;
    
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + (editingId ? `/api/activation/${editingId}` : '/api/activation'), { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    });
    
    if (res.ok) {
      setFormData({ code: '', isUsed: false, deviceId: '' });
      setEditingId(null);
      fetchItems();
      showMsg(editingId ? 'Code updated!' : 'Code added!');
    } else {
      showMsg('Failed to save code');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ code: item.code, isUsed: item.isUsed || false, deviceId: item.deviceId || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this code?')) return;
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + `/api/activation/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Manage Activation Codes</h2>
      {msg && <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '6px', border: '1px solid #86efac' }}>{msg}</div>}

      <div style={{ background: 'white', border: `2px solid ${editingId ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '10px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: editingId ? 'var(--primary)' : '#1e293b' }}>
          {editingId ? 'Edit Code' : 'Add New Code'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Code (Leave empty for random)</label>
            <input type="text" className="form-control" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. A1B2C3D4" />
          </div>
          
          <div className="input-group">
            <label className="input-label">Device ID (Optional)</label>
            <input type="text" className="form-control" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} placeholder="Device UUID if bound" />
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <input type="checkbox" id="isUsed" checked={formData.isUsed} onChange={e => setFormData({...formData, isUsed: e.target.checked})} style={{ width: '18px', height: '18px' }} />
            <label htmlFor="isUsed" style={{ fontWeight: 600, cursor: 'pointer' }}>Mark as Used</label>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> {editingId ? 'Update Code' : 'Generate Code'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setFormData({ code: '', isUsed: false, deviceId: '' }); setEditingId(null); }} className="btn" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>All Codes ({items.length})</h3>
        </div>
        
        {loading ? <p>Loading...</p> : items.length === 0 ? <p style={{ color: '#94a3b8' }}>No codes yet.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>
                  <th style={{ padding: '0.6rem 0' }}>Code</th>
                  <th>Status</th>
                  <th>Device Bound</th>
                  <th>Created At</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: editingId === item.id ? '#f0f9ff' : 'transparent' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700, letterSpacing: '1px' }}>{item.code}</td>
                    <td>
                      {item.isUsed ? (
                        <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>USED</span>
                      ) : (
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>UNUSED</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.deviceId || 'None'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleEdit(item)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: '#fff1f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
