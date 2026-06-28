import { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';

export default function AdminAuthors() {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({ nameEn: '', nameBn: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/authors');
      if (res.ok) setItems(await res.json());
    } finally { setLoading(false); }
  };

  const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...formData } : formData;
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/authors', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      setFormData({ nameEn: '', nameBn: '' });
      setEditingId(null);
      fetchItems();
      showMsg(editingId ? 'Author updated!' : 'Author added!');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ nameEn: item.nameEn, nameBn: item.nameBn });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this author?')) return;
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/authors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchItems();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Manage Authors</h2>
      {msg && <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '6px', border: '1px solid #86efac' }}>{msg}</div>}

      <div style={{ background: 'white', border: `2px solid ${editingId ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '10px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: editingId ? 'var(--primary)' : '#1e293b' }}>
          {editingId ? 'Edit Author' : 'Add New Author'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Name (English)</label>
            <input required type="text" className="form-control" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} placeholder="e.g. Humayun Ahmed" />
          </div>
          <div className="input-group">
            <label className="input-label">Name (Bengali)</label>
            <input required type="text" className="form-control" value={formData.nameBn} onChange={e => setFormData({...formData, nameBn: e.target.value})} placeholder="উদা: হুমায়ূন আহমেদ" />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> {editingId ? 'Update Author' : 'Add Author'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setFormData({ nameEn: '', nameBn: '' }); setEditingId(null); }} className="btn" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>All Authors ({items.length})</h3>
        {loading ? <p>Loading...</p> : items.length === 0 ? <p style={{ color: '#94a3b8' }}>No authors yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>
                <th style={{ padding: '0.6rem 0' }}>English Name</th>
                <th>Bengali Name</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: editingId === item.id ? '#f0f9ff' : 'transparent' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{item.nameEn}</td>
                  <td>{item.nameBn}</td>
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
        )}
      </div>
    </div>
  );
}
