'use client';
import { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  folder?: 'images' | 'files' | 'audio';
  accept?: string;
  required?: boolean;
}

export default function FileUpload({ value, onChange, label, folder = 'images', accept, required = false }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = folder === 'images';
  const isAudio = folder === 'audio';

  const defaultAccept = isImage
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : isAudio
    ? 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4'
    : 'application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const filename = value ? value.split('/').pop() : '';

  return (
    <div className="input-group">
      <label className="input-label">{label}{required && ' *'}</label>

      {/* Current value preview */}
      {value && (
        <div style={{ marginBottom: '0.5rem', position: 'relative', display: 'inline-block' }}>
          {isImage ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={value}
                alt="Preview"
                style={{ maxHeight: '120px', maxWidth: '200px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'block' }}
              />
              <button
                type="button"
                onClick={() => onChange('')}
                style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              {isAudio ? <imgIcon size={16} color="#64748b"  loading="lazy" /> : <FileText size={16} color="#64748b" />}
              <span style={{ fontSize: '0.8rem', color: '#475569', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filename}</span>
              <button
                type="button"
                onClick={() => onChange('')}
                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: uploading ? '#f0f9ff' : '#fafafa',
          transition: 'all 0.2s',
          minHeight: '70px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem'
        }}
      >
        {uploading ? (
          <>
            <div style={{ width: '20px', height: '20px', border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.8rem', color: '#3b82f6' }}>আপলোড হচ্ছে...</span>
          </>
        ) : (
          <>
            <Upload size={20} color="#94a3b8" />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {value ? 'নতুন ফাইল বেছে নিন বা টেনে আনুন' : 'ফাইল বেছে নিন বা টেনে আনুন'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              {isImage ? 'JPG, PNG, WEBP (max 20MB)' : isAudio ? 'MP3, WAV, OGG (max 20MB)' : 'PDF, DOC, PPT (max 20MB)'}
            </span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept || defaultAccept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {/* Manual URL input fallback */}
      <input
        type="text"
        className="form-control"
        placeholder="অথবা সরাসরি URL দিন..."
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
      />

      {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</p>}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
