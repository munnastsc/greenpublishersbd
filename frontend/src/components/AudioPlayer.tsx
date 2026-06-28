// AudioPlayer Component
import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ src, title, subtitle, onNext, onPrev, hasNext, hasPrev }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLoaded(false);
    audio.load();
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !muted;
    audioRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '16px',
      padding: '1.5rem',
      color: 'white',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
    }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => { setDuration(audioRef.current?.duration || 0); setLoaded(true); }}
        onEnded={() => { setPlaying(false); if (onNext) onNext(); }}
      />

      {/* Track info */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
          animation: playing ? 'spin 4s linear infinite' : 'none'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: '2px' }}>{subtitle}</div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <div style={{ position: 'relative', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)', marginBottom: '6px' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '2px', transition: 'width 0.1s linear' }} />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          style={{ position: 'absolute', top: '-6px', left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '20px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', opacity: 0.55 }}>
          <span>{formatTime(currentTime)}</span>
          <span>{loaded ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{ width: '70px', accentColor: '#f59e0b', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            style={{ background: 'none', border: 'none', color: hasPrev ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', cursor: hasPrev ? 'pointer' : 'default', padding: '4px', display: 'flex' }}
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlay}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              border: 'none', borderRadius: '50%',
              width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white',
              boxShadow: '0 4px 16px rgba(245,158,11,0.5)',
              transition: 'transform 0.1s'
            }}
          >
            {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" style={{ marginLeft: '2px' }} />}
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            style={{ background: 'none', border: 'none', color: hasNext ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', cursor: hasNext ? 'pointer' : 'default', padding: '4px', display: 'flex' }}
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div style={{ width: '90px' }} />
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
