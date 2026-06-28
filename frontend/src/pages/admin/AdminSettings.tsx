import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [publishers, setPublishers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings').then(r => r.json()),
      fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/publishers').then(r => r.json()),
    ]).then(([settingsData, publishersData]) => {
      setSettings(settingsData);
      setPublishers(publishersData);
      setLoading(false);
    });
  }, []);

  const set = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) return <p>Loading settings...</p>;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
      {children}
    </h3>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>Site Settings</h2>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 700, background: '#f0fdf4', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <CheckCircle size={18} /> সেটিংস সেভ হয়েছে!
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* Site Identity */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>সাইটের পরিচয় (Site Identity)</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Site Name (সাইটের নাম)</label>
              <input className="form-control" value={settings.siteName || ''} onChange={e => set('siteName', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Tagline (ট্যাগলাইন)</label>
              <input className="form-control" value={settings.siteTagline || ''} onChange={e => set('siteTagline', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>যোগাযোগের তথ্য (Contact Info)</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Phone Number (হেল্পলাইন)</label>
              <input className="form-control" value={settings.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="16297" />
            </div>
            <div className="input-group">
              <label className="input-label">Public Email (সাইটে দেখাবে)</label>
              <input className="form-control" type="email" value={settings.email || ''} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Admin Email (অর্ডার নোটিফিকেশন পাবেন)</label>
              <input className="form-control" type="email" value={settings.adminEmail || ''} onChange={e => set('adminEmail', e.target.value)} placeholder="admin@example.com" />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Address (ঠিকানা)</label>
              <input className="form-control" value={settings.address || ''} onChange={e => set('address', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Facebook URL</label>
              <input className="form-control" value={settings.facebookUrl || ''} onChange={e => set('facebookUrl', e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div className="input-group">
              <label className="input-label">YouTube URL</label>
              <input className="form-control" value={settings.youtubeUrl || ''} onChange={e => set('youtubeUrl', e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        {/* Homepage Hero Settings */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>হোমপেজ হিরো সেকশন (Banner না থাকলে দেখাবে)</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">শিরোনাম (English)</label>
              <input className="form-control" value={settings.heroTitleEn || ''} onChange={e => set('heroTitleEn', e.target.value)} placeholder="Welcome to Green Publishers BD" />
            </div>
            <div className="input-group">
              <label className="input-label">শিরোনাম (বাংলা)</label>
              <input className="form-control" value={settings.heroTitleBn || ''} onChange={e => set('heroTitleBn', e.target.value)} placeholder="গ্রিন পাবলিশার্স বিডিতে আপনাকে স্বাগতম" />
            </div>
            <div className="input-group">
              <label className="input-label">সাব-টাইটেল (English)</label>
              <input className="form-control" value={settings.heroSubtitleEn || ''} onChange={e => set('heroSubtitleEn', e.target.value)} placeholder="Find your next favorite book here." />
            </div>
            <div className="input-group">
              <label className="input-label">সাব-টাইটেল (বাংলা)</label>
              <input className="form-control" value={settings.heroSubtitleBn || ''} onChange={e => set('heroSubtitleBn', e.target.value)} placeholder="আপনার পরবর্তী পছন্দের বইটি এখানে খুঁজে নিন।" />
            </div>
            <div className="input-group">
              <label className="input-label">বাটন লেখা (English)</label>
              <input className="form-control" value={settings.heroBtnEn || ''} onChange={e => set('heroBtnEn', e.target.value)} placeholder="Explore More" />
            </div>
            <div className="input-group">
              <label className="input-label">বাটন লেখা (বাংলা)</label>
              <input className="form-control" value={settings.heroBtnBn || ''} onChange={e => set('heroBtnBn', e.target.value)} placeholder="আরও দেখুন" />
            </div>
          </div>
        </div>

        {/* Feature Strip Settings */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>হোমপেজ ফিচার স্ট্রিপ (নিচের ২টি আইকন বক্স)</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>বক্স ১</div>
              <div className="input-group">
                <label className="input-label">শিরোনাম (English)</label>
                <input className="form-control" value={settings.feature1TitleEn || ''} onChange={e => set('feature1TitleEn', e.target.value)} placeholder="Original Books" />
              </div>
              <div className="input-group">
                <label className="input-label">শিরোনাম (বাংলা)</label>
                <input className="form-control" value={settings.feature1TitleBn || ''} onChange={e => set('feature1TitleBn', e.target.value)} placeholder="১০০% অরিজিনাল বই" />
              </div>
              <div className="input-group">
                <label className="input-label">বিবরণ (English)</label>
                <input className="form-control" value={settings.feature1DescEn || ''} onChange={e => set('feature1DescEn', e.target.value)} placeholder="Directly from publishers" />
              </div>
              <div className="input-group">
                <label className="input-label">বিবরণ (বাংলা)</label>
                <input className="form-control" value={settings.feature1DescBn || ''} onChange={e => set('feature1DescBn', e.target.value)} placeholder="সরাসরি প্রকাশনী থেকে" />
              </div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>বক্স ২</div>
              <div className="input-group">
                <label className="input-label">শিরোনাম (English)</label>
                <input className="form-control" value={settings.feature2TitleEn || ''} onChange={e => set('feature2TitleEn', e.target.value)} placeholder="Fast Delivery" />
              </div>
              <div className="input-group">
                <label className="input-label">শিরোনাম (বাংলা)</label>
                <input className="form-control" value={settings.feature2TitleBn || ''} onChange={e => set('feature2TitleBn', e.target.value)} placeholder="দ্রুত ডেলিভারি" />
              </div>
              <div className="input-group">
                <label className="input-label">বিবরণ (English)</label>
                <input className="form-control" value={settings.feature2DescEn || ''} onChange={e => set('feature2DescEn', e.target.value)} placeholder="Nationwide Shipping" />
              </div>
              <div className="input-group">
                <label className="input-label">বিবরণ (বাংলা)</label>
                <input className="form-control" value={settings.feature2DescBn || ''} onChange={e => set('feature2DescBn', e.target.value)} placeholder="সারাদেশে ডেলিভারি" />
              </div>
            </div>
          </div>
        </div>

        {/* Books Page Settings */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>বইয়ের পাতার সেটিংস (Books Page)</SectionTitle>
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.9rem', color: '#1e40af' }}>
            এখানে যে প্রকাশনী নির্বাচন করবেন, সেই প্রকাশনীর বই বইয়ের পাতায় সবার আগে আলাদা সেকশনে দেখাবে।
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">প্রথমে দেখাবে যে প্রকাশনীর বই (Featured Publisher)</label>
              <select
                className="form-control"
                value={settings.featuredPublisherId || ''}
                onChange={e => set('featuredPublisherId', e.target.value)}
              >
                <option value="">— কোনো প্রকাশনী নির্বাচন নেই (সব বই একসাথে) —</option>
                {publishers.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nameEn} / {p.nameBn}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">প্রথম সেকশনের শিরোনাম (English)</label>
              <input
                className="form-control"
                value={settings.featuredPublisherSectionEn || ''}
                onChange={e => set('featuredPublisherSectionEn', e.target.value)}
                placeholder="Green Publishers Books"
              />
            </div>
            <div className="input-group">
              <label className="input-label">প্রথম সেকশনের শিরোনাম (বাংলা)</label>
              <input
                className="form-control"
                value={settings.featuredPublisherSectionBn || ''}
                onChange={e => set('featuredPublisherSectionBn', e.target.value)}
                placeholder="গ্রিন পাবলিশার্স বই"
              />
            </div>

            <div className="input-group">
              <label className="input-label">দ্বিতীয় সেকশনের শিরোনাম (English)</label>
              <input
                className="form-control"
                value={settings.otherPublishersSectionEn || ''}
                onChange={e => set('otherPublishersSectionEn', e.target.value)}
                placeholder="Other Publishers Books"
              />
            </div>
            <div className="input-group">
              <label className="input-label">দ্বিতীয় সেকশনের শিরোনাম (বাংলা)</label>
              <input
                className="form-control"
                value={settings.otherPublishersSectionBn || ''}
                onChange={e => set('otherPublishersSectionBn', e.target.value)}
                placeholder="অন্যান্য প্রকাশনীর বই"
              />
            </div>
          </div>
        </div>

        {/* Buy Button Settings */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>বই কেনার বাটন (External Buy Button)</SectionTitle>
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.9rem', color: '#92400e' }}>
            প্রতিটি বইতে আলাদা রকমারি/অন্য সাইটের লিঙ্ক দিতে পারবেন। এখানে শুধু বাটনের নাম পরিবর্তন করুন।
          </div>
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <label className="input-label">বাটনের নাম (Button Label)</label>
            <input
              className="form-control"
              value={settings.rokomariButtonLabel || ''}
              onChange={e => set('rokomariButtonLabel', e.target.value)}
              placeholder="রকমারিতে কিনুন"
            />
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem', display: 'block' }}>
              উদাহরণ: রকমারিতে কিনুন / Buy on Rokomari / অনলাইনে কিনুন
            </span>
          </div>
        </div>

        {/* Delivery Charges */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>ডেলিভারি চার্জ (Delivery Charges)</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">ঢাকার ভেতরে (Inside Dhaka) — TK</label>
              <input className="form-control" type="number" value={settings.deliveryChargeDhaka || '70'} onChange={e => set('deliveryChargeDhaka', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">ঢাকার বাইরে (Outside Dhaka) — TK</label>
              <input className="form-control" type="number" value={settings.deliveryChargeOutside || '150'} onChange={e => set('deliveryChargeOutside', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Email (SMTP) Settings */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>ইমেইল সেটিংস — SMTP (অর্ডার ইমেইল পাঠানোর জন্য)</SectionTitle>
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.9rem', color: '#92400e' }}>
            Gmail ব্যবহার করলে: SMTP Host = smtp.gmail.com, Port = 587। Gmail App Password ব্যবহার করুন (2-step verification চালু করে Settings → Security → App Passwords থেকে নিন)।
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">SMTP Host</label>
              <input className="form-control" value={settings.smtpHost || ''} onChange={e => set('smtpHost', e.target.value)} placeholder="smtp.gmail.com" />
            </div>
            <div className="input-group">
              <label className="input-label">SMTP Port</label>
              <input className="form-control" type="number" value={settings.smtpPort || '587'} onChange={e => set('smtpPort', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">SMTP User (Email)</label>
              <input className="form-control" type="email" value={settings.smtpUser || ''} onChange={e => set('smtpUser', e.target.value)} placeholder="yourmail@gmail.com" />
            </div>
            <div className="input-group">
              <label className="input-label">SMTP Password (App Password)</label>
              <input className="form-control" type="password" value={settings.smtpPass || ''} onChange={e => set('smtpPass', e.target.value)} placeholder="••••••••••••" />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
          <SectionTitle>পেমেন্ট পদ্ধতি (Payment Methods)</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input
                type="checkbox"
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                checked={settings.cashOnDelivery !== 'false'}
                onChange={e => set('cashOnDelivery', e.target.checked ? 'true' : 'false')}
              />
              <div>
                <div style={{ fontWeight: 700 }}>Cash on Delivery (ক্যাশ অন ডেলিভারি)</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>বই পেয়ে টাকা দিতে পারবেন</div>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input
                type="checkbox"
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                checked={settings.onlinePayment !== 'false'}
                onChange={e => set('onlinePayment', e.target.checked ? 'true' : 'false')}
              />
              <div>
                <div style={{ fontWeight: 700 }}>Online Payment (অনলাইন পেমেন্ট)</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>SSLCommerz / bKash / কার্ড</div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-blue" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem', display: 'flex', gap: '0.5rem' }} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'সব সেটিংস সেভ করুন'}
          </button>
        </div>
      </form>
    </div>
  );
}
