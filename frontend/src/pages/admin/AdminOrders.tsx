import { useState, useEffect } from 'react';

const STATUS_COLORS: any = {
  PENDING: { bg: '#fef3c7', color: '#b45309' },
  PROCESSING: { bg: '#dbeafe', color: '#1d4ed8' },
  COMPLETED: { bg: '#dcfce7', color: '#16a34a' },
  CANCELLED: { bg: '#fee2e2', color: '#dc2626' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/orders');
    if (res.ok) setOrders(await res.json());
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Manage Orders</h2>
      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
        {orders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No orders yet. Orders will appear here when customers checkout.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>ID</th>
                <th style={{ padding: '0.75rem' }}>Customer</th>
                <th style={{ padding: '0.75rem' }}>Phone</th>
                <th style={{ padding: '0.75rem' }}>Items Ordered</th>
                <th style={{ padding: '0.75rem' }}>Total</th>
                <th style={{ padding: '0.75rem' }}>Payment</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => {
                const s = STATUS_COLORS[o.status] || STATUS_COLORS.PENDING;
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>#{o.id}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.address}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{o.customerPhone}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', maxWidth: '300px' }}>
                       <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                         {o.items}
                       </div>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--secondary)' }}>TK. {o.totalAmount}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: o.paymentMethod === 'COD' ? '#fef3c7' : '#dbeafe',
                        color: o.paymentMethod === 'COD' ? '#b45309' : '#1d4ed8'
                      }}>
                        {o.paymentMethod === 'COD' ? 'ক্যাশ অন ডেলিভারি' : 'Online'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-BD')}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.6rem', backgroundColor: s.bg, color: s.color, borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 700 }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <select className="form-control" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }} value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
