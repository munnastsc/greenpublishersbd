import { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, BookOpen, GripVertical } from 'lucide-react';

export default function AdminUnits() {
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [units, setUnits] = useState<any[]>([]);
  const [form, setForm] = useState({ titleEn: '', titleBn: '', order: '0' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/books').then(r => r.json()).then(setBooks);
  }, []);

  useEffect(() => {
    if (selectedBookId) fetchUnits();
    else setUnits([]);
  }, [selectedBookId]);

  const fetchUnits = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/units?bookId=${selectedBookId}`);
    if (res.ok) setUnits(await res.json());
  };

  const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) return;
    setLoading(true);
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/units', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, bookId: selectedBookId }),
    });
    if (res.ok) {
      setForm({ titleEn: '', titleBn: '', order: '0' });
      fetchUnits();
      showMsg('Unit added!');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('এই unit delete করবেন? এর সাথে linked সব video/audio unlinked হয়ে যাবে।')) return;
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/units', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchUnits();
  };

  const selectedBook = books.find(b => String(b.id) === selectedBookId);

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Layers size={28} /> Unit Management
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Book-এর ভেতরে Unit তৈরি করুন। Video/Audio upload করার সময় unit assign করা যাবে।
      </p>

      {msg && <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '6px', border: '1px solid #86efac' }}>{msg}</div>}

      {/* Book selector */}
      <div className="book-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <label className="input-label">বই বেছে নিন</label>
        <select className="form-control" style={{ maxWidth: '420px' }} value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)}>
          <option value="">— বই সিলেক্ট করুন —</option>
          {books.map(b => <option key={b.id} value={b.id}>{b.titleEn} / {b.titleBn}</option>)}
        </select>
      </div>

      {selectedBookId && (
        <>
          {/* Add unit form */}
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> নতুন Unit যোগ করুন
              {selectedBook && <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>— {selectedBook.titleEn}</span>}
            </h3>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Title (English) *</label>
                <input required type="text" className="form-control" placeholder="Unit 1: Introduction" value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} />
              </div>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Title (Bengali) — Optional</label>
                <input type="text" className="form-control" placeholder="ইউনিট ১: ভূমিকা" value={form.titleBn} onChange={e => setForm({ ...form, titleBn: e.target.value })} />
              </div>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Order</label>
                <input type="number" className="form-control" style={{ width: '80px' }} min="0" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-blue" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                <Plus size={15} /> {loading ? '...' : 'Add Unit'}
              </button>
            </form>
          </div>

          {/* Units list */}
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Units ({units.length})
            </h3>
            {units.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                <Layers size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                <p>এই বইতে এখনো কোনো unit নেই।</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {units.map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fafafa' }}>
                    <GripVertical size={16} color="#cbd5e1" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.titleEn}</div>
                      {u.titleBn && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.titleBn}</div>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                      Order: {u.order}
                    </div>
                    <button onClick={() => handleDelete(u.id)} style={{ background: '#fff1f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
