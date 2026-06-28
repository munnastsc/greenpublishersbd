'use client';
import { useState, useEffect } from 'react';

function CrudPage({ title, apiUrl, fields }: { title: string, apiUrl: string, fields: { key: string, label: string }[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const res = await fetch(apiUrl);
    if (res.ok) setItems(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setFormData({});
      fetchItems();
      setMsg('Saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } else {
      setMsg('Error saving. Try again.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(apiUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchItems();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>{title}</h2>
      
      {msg && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: msg.includes('Error') ? '#fee2e2' : '#dcfce7', color: msg.includes('Error') ? '#dc2626' : '#16a34a', borderRadius: 'var(--radius-sm)', border: '1px solid', borderColor: msg.includes('Error') ? '#fca5a5' : '#86efac' }}>
          {msg}
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem', marginBottom: '2rem' }}>
        <h3 className="section-title">Add New</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {fields.map(f => (
            <div className="input-group" key={f.key}>
              <label className="input-label">{f.label}</label>
              <input required type="text" className="form-control" value={formData[f.key] || ''}
                onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-blue" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
        <h3 className="section-title">Current Records</h3>
        {items.length === 0 ? <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No records yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                {fields.map(f => <th key={f.key} style={{ padding: '0.75rem 0.5rem' }}>{f.label}</th>)}
                <th style={{ padding: '0.75rem 0.5rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {fields.map(f => <td key={f.key} style={{ padding: '0.75rem 0.5rem' }}>{item[f.key]}</td>)}
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <button onClick={() => handleDelete(item.id)} className="btn" style={{ color: '#dc2626', border: '1px solid #fca5a5', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                      Delete
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

export function AdminAuthorsPage() {
  return <CrudPage title="Manage Authors" apiUrl="/api/authors" fields={[{ key: 'nameEn', label: 'Name (English)' }, { key: 'nameBn', label: 'Name (Bengali)' }]} />;
}

export function AdminPublishersPage() {
  return <CrudPage title="Manage Publishers" apiUrl="/api/publishers" fields={[{ key: 'nameEn', label: 'Name (English)' }, { key: 'nameBn', label: 'Name (Bengali)' }]} />;
}

export function AdminMenusPage() {
  return <CrudPage title="Manage Navigation Menus" apiUrl="/api/menus" fields={[
    { key: 'labelEn', label: 'Label (English)' },
    { key: 'labelBn', label: 'Label (Bengali)' },
    { key: 'url', label: 'URL (e.g. /books)' },
    { key: 'order', label: 'Order (number)' },
  ]} />;
}
