import { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Check, Plus } from 'lucide-react';

const BLANK = { labelEn: '', labelBn: '', url: '', order: '0' };

const QUICK_LINKS = [
  { labelEn: 'Books', labelBn: 'বইসমূহ', url: '/books', order: 1 },
  { labelEn: 'Authors', labelBn: 'লেখক', url: '/authors', order: 2 },
  { labelEn: 'Categories', labelBn: 'বিষয়সমূহ', url: '/categories', order: 3 },
  { labelEn: 'Videos', labelBn: 'ভিডিও', url: '/videos', order: 4 },
  { labelEn: 'Audio', labelBn: 'অডিও', url: '/audio', order: 5 },
  { labelEn: 'Offers', labelBn: 'অফার', url: '/offers', order: 6 },
  { labelEn: 'Contact', labelBn: 'যোগাযোগ', url: '/contact', order: 7 },
];

export default function AdminMenus() {
  const [menus, setMenus] = useState<any[]>([]);
  const [formData, setFormData] = useState(BLANK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/menus');
      if (res.ok) setMenus(await res.json());
    } finally { setLoading(false); }
  };

  const showMsg = (text: string) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId
      ? { id: editingId, ...formData, order: parseInt(formData.order) }
      : { ...formData, order: parseInt(formData.order) };
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/menus', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      setFormData(BLANK);
      setEditingId(null);
      fetchMenus();
      showMsg(editingId ? 'Menu updated!' : 'Menu added!');
    }
  };

  const handleEdit = (m: any) => {
    setEditingId(m.id);
    setFormData({ labelEn: m.labelEn, labelBn: m.labelBn, url: m.url, order: String(m.order) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { setFormData(BLANK); setEditingId(null); };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this menu item?')) return;
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/menus', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchMenus();
  };

  const addQuick = async (ql: typeof QUICK_LINKS[0]) => {
    const exists = menus.some(m => m.url === ql.url);
    if (exists) { showMsg(`"${ql.labelEn}" already in menu!`); return; }
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/menus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ql) });
    fetchMenus();
    showMsg(`"${ql.labelEn}" added!`);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Manage Navigation Menus</h2>

      {msg && <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '6px', border: '1px solid #86efac' }}>{msg}</div>}

      {/* Quick Add */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#92400e' }}>Quick Add Common Pages:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {QUICK_LINKS.map(ql => (
            <button key={ql.url} onClick={() => addQuick(ql)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.9rem', border: '1px solid #fcd34d', borderRadius: '20px', background: 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#78350f' }}>
              <Plus size={12} /> {ql.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ background: 'white', border: `2px solid ${editingId ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '10px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: editingId ? 'var(--primary)' : '#1e293b' }}>
          {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Label (English)</label>
            <input required type="text" className="form-control" value={formData.labelEn} onChange={e => setFormData({...formData, labelEn: e.target.value})} placeholder="e.g. Books" />
          </div>
          <div className="input-group">
            <label className="input-label">Label (Bengali)</label>
            <input required type="text" className="form-control" value={formData.labelBn} onChange={e => setFormData({...formData, labelBn: e.target.value})} placeholder="উদা: বইসমূহ" />
          </div>
          <div className="input-group">
            <label className="input-label">URL / Link</label>
            <input required type="text" className="form-control" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="/books or https://..." />
          </div>
          <div className="input-group">
            <label className="input-label">Order (smaller = first)</label>
            <input required type="number" className="form-control" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> {editingId ? 'Update Menu' : 'Add Menu Item'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="btn" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Active Menu Items ({menus.length})</h3>
        {loading ? <p>Loading...</p> : menus.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No menu items. Add one above or use Quick Add.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>
                <th style={{ padding: '0.6rem 0' }}>#</th>
                <th>Label (EN / BN)</th>
                <th>URL</th>
                <th>Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m: any, idx: number) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', background: editingId === m.id ? '#f0f9ff' : 'transparent' }}>
                  <td style={{ padding: '0.75rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{m.labelEn} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {m.labelBn}</span></td>
                  <td style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.88rem' }}>{m.url}</td>
                  <td>{m.order}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleEdit(m)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(m.id)} style={{ background: '#fff1f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
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
