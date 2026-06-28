import { useState, useEffect } from 'react';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [formData, setFormData] = useState({ code: '', discountType: 'PERCENTAGE', value: '', active: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/coupons');
    if (res.ok) setCoupons(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setFormData({ code: '', discountType: 'PERCENTAGE', value: '', active: true });
      fetchCoupons();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchCoupons();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Manage Coupons</h2>
      
      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem', marginBottom: '2rem' }}>
        <h3 className="section-title">Create New Coupon</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Coupon Code (e.g. EID25)</label>
            <input required className="form-control" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
          </div>
          <div className="input-group">
            <label className="input-label">Type</label>
            <select className="form-control" value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}>
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (TK)</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Value</label>
            <input required type="number" className="form-control" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <button type="submit" className="btn btn-blue" disabled={loading}>{loading ? '...' : 'Create'}</button>
          </div>
        </form>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
        <h3 className="section-title">Active Coupons</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Code</th>
              <th style={{ padding: '0.75rem' }}>Type</th>
              <th style={{ padding: '0.75rem' }}>Value</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>{c.code}</td>
                <td style={{ padding: '0.75rem' }}>{c.discountType}</td>
                <td style={{ padding: '0.75rem' }}>{c.value} {c.discountType === 'PERCENTAGE' ? '%' : 'TK'}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ color: c.active ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{c.active ? 'ACTIVE' : 'INACTIVE'}</span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(c.id)} className="btn" style={{ color: '#dc2626', border: '1px solid #fca5a5', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
