'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Video, Camera, Smartphone, Radio, Users, MessageSquare, Settings,
  Lightbulb, X, Upload, FileVideo, CheckCircle, Film, Type, Tag, Trash2, Play, Square, Store
} from 'lucide-react';
import { saveVideo, getVideos, deleteVideo, type StoredVideo } from '@/src/lib/video-storage';
import { createClient } from '@/src/lib/supabase/client';

function ViewHeader({ onBack, viewerCount, isLive }: { onBack: () => void; viewerCount: number; isLive: boolean }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(rgba(0,0,0,0.5), transparent)' }}>
      <button className="pj-touch" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }} onClick={onBack}>
        <ArrowLeft size={20} strokeWidth={2} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--pj-radius-pill)', background: isLive ? 'var(--pj-red)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'white' }}>
          <Users size={12} />
          <span className="pj-mono">{viewerCount}</span>
        </div>
        <button className="pj-touch" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Settings size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function CameraView({ stream, isRecording, isLive }: { stream: MediaStream | null; isRecording: boolean; isLive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return (
      <div style={{ position: 'relative', aspectRatio: '9/16', maxHeight: '65vh', background: 'var(--pj-surface-1)', borderRadius: 'var(--pj-radius-lg)', overflow: 'hidden', margin: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Video size={48} style={{ color: 'var(--pj-text-tertiary)', marginBottom: 16 }} />
          <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text-secondary)' }}>Requesting camera...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', aspectRatio: '9/16', maxHeight: '65vh', borderRadius: 'var(--pj-radius-lg)', overflow: 'hidden', margin: '0 16px' }}>
      <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
      {isLive && (
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'var(--pj-red)', fontSize: 11, fontWeight: 700, color: 'white' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'pj-pulse 1.5s infinite' }} /> LIVE
        </div>
      )}
      {isRecording && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'rgba(0,0,0,0.7)', fontSize: 11, fontWeight: 700, color: 'white' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pj-red)' }} /> REC
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'rgba(0,0,0,0.5)', fontSize: 'var(--pj-size-micro)', fontWeight: 600, color: 'var(--pj-text-secondary)' }}>9:16</span>
        <span style={{ padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'rgba(0,0,0,0.5)', fontSize: 'var(--pj-size-micro)', fontWeight: 600, color: 'var(--pj-text-secondary)' }}>HD</span>
      </div>
    </div>
  );
}

function StreamPresets({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const presets = [
    { id: 'product', label: 'Product', Icon: Smartphone },
    { id: 'tour', label: 'Tour', Icon: Video },
    { id: 'portrait', label: 'Portrait', Icon: Camera },
  ];
  return (
    <div style={{ padding: '16px 16px 0', display: 'flex', gap: 8 }}>
      {presets.map((p) => (
        <button key={p.id} className={`pj-pill ${active === p.id ? 'pj-pill-active' : ''}`} onClick={() => onChange(p.id)} style={{ flex: 1, justifyContent: 'center' }}>
          <p.Icon size={14} strokeWidth={2} /> {p.label}
        </button>
      ))}
    </div>
  );
}

function RecordControls({ onRecord, onStopRecord, isRecording, onLive }: { onRecord: () => void; onStopRecord: () => void; isRecording: boolean; onLive: () => void }) {
  return (
    <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <button className="pj-touch" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pj-text-secondary)' }} title="Flip camera">
        <Camera size={18} strokeWidth={2} />
      </button>
      {isRecording ? (
        <button className="pj-touch" onClick={onStopRecord} style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--pj-red)', border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} data-testid="button-stop-record">
          <Square size={28} fill="white" style={{ color: 'white' }} />
        </button>
      ) : (
        <button className="pj-touch" onClick={onRecord} style={{ width: 72, height: 72, borderRadius: '50%', background: 'transparent', border: '3px solid var(--pj-red)', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }} data-testid="button-record">
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--pj-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={24} strokeWidth={2.5} style={{ color: 'white' }} />
          </div>
        </button>
      )}
      <button className="pj-touch" onClick={onLive} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pj-text-secondary)' }} title="Chat">
        <MessageSquare size={18} strokeWidth={2} />
      </button>
    </div>
  );
}

function CoachingTip() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div className="pj-card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start', borderColor: 'var(--pj-border-hover)' }}>
        <Lightbulb size={18} strokeWidth={2} style={{ color: 'var(--pj-text-tertiary)', flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>Quick tip</h4>
          <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', lineHeight: 1.5 }}>Record: tap the red button. Go live: tap Record to start your stream. Recordings are saved locally.</p>
        </div>
        <button className="pj-touch" onClick={() => setDismissed(true)} style={{ background: 'transparent', border: 'none', color: 'var(--pj-text-tertiary)', padding: 4 }}><X size={14} /></button>
      </div>
    </div>
  );
}

function ModeTabs({ mode, onChange }: { mode: 'live' | 'upload' | 'library'; onChange: (m: 'live' | 'upload' | 'library') => void }) {
  return (
    <div style={{ padding: '12px 16px 0', display: 'flex', gap: 4, background: 'var(--pj-black)' }}>
      <button className={`pj-pill ${mode === 'live' ? 'pj-pill-active' : ''}`} onClick={() => onChange('live')} style={{ flex: 1, justifyContent: 'center', padding: '10px 16px' }}>
        <Radio size={14} strokeWidth={2} /> Go Live
      </button>
      <button className={`pj-pill ${mode === 'upload' ? 'pj-pill-active' : ''}`} onClick={() => onChange('upload')} style={{ flex: 1, justifyContent: 'center', padding: '10px 16px' }}>
        <Upload size={14} strokeWidth={2} /> Upload
      </button>
      <button className={`pj-pill ${mode === 'library' ? 'pj-pill-active' : ''}`} onClick={() => onChange('library')} style={{ flex: 1, justifyContent: 'center', padding: '10px 16px' }}>
        <FileVideo size={14} strokeWidth={2} /> Library
      </button>
    </div>
  );
}

type BusinessOption = { id: string; name: string; slug: string };

function UploadView({ onSaved }: { onSaved?: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [businesses, setBusinesses] = useState<BusinessOption[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ file: File; name: string; size: string } | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetch('/api/businesses')
      .then((r) => r.json())
      .then((data: BusinessOption[]) => setBusinesses(data))
      .catch(() => setBusinesses([]));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile({ file, name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
      setUploadError('');
    }
  };

  const handlePublishToStore = async () => {
    if (!selectedFile || !title || !selectedBusiness) {
      setUploadError(selectedBusiness ? 'Title is required' : 'Select a store first');
      return;
    }
    setSaving(true);
    setUploadError('');
    try {
      const supabase = createClient();
      const biz = businesses.find((b) => b.id === selectedBusiness);
      const ext = selectedFile.name.split('.').pop() || 'mp4';
      const path = `${selectedBusiness}/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('stream-videos')
        .upload(path, selectedFile.file, { upsert: true });

      if (uploadErr) {
        setUploadError(uploadErr.message || 'Upload failed');
        return;
      }

      const { data: urlData } = supabase.storage.from('stream-videos').getPublicUrl(path);
      const videoUrl = urlData.publicUrl;

      const { error: insertErr } = await supabase.from('streams').insert({
        business_id: selectedBusiness,
        video_url: videoUrl,
        title: title || 'Store video',
        description: description || null,
        is_live: true,
        peak_viewers: 0,
      });

      if (insertErr) {
        setUploadError(insertErr.message || 'Failed to publish');
        return;
      }

      setSaved(true);
      setTimeout(() => onSaved?.(), 1500);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishLocal = async () => {
    if (!selectedFile || !title) return;
    setSaving(true);
    setUploadError('');
    try {
      await saveVideo({ blob: selectedFile.file, title, description, category, createdAt: new Date().toISOString(), durationSeconds: 0 });
      setSaved(true);
      setTimeout(() => onSaved?.(), 1500);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = ['Food & Dining', 'Property', 'Cars & Auto', 'Yachts & Marine', 'Home Services', 'Freelancers', 'Health & Wellness', 'Fashion & Retail', 'Electronics', 'Tourism', 'Education', 'Pets & Animals'];

  return (
    <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
      <input ref={fileInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
      {!selectedFile ? (
        <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--pj-radius-lg)', border: '2px dashed var(--pj-border-hover)', background: 'var(--pj-surface-1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', padding: 24 }}>
          <Upload size={32} style={{ color: 'var(--pj-text-tertiary)' }} />
          <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text)' }}>Tap to upload video</p>
          <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)' }}>MP4, MOV, WebM — up to 500MB</p>
          <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-gold)', fontWeight: 600 }}>Publish to a store → plays like a stream</p>
        </button>
      ) : (
        <div className="pj-card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <FileVideo size={28} style={{ color: 'var(--pj-red)' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>{selectedFile.name}</p>
              <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>{selectedFile.size}</p>
            </div>
            <button className="pj-touch" onClick={() => setSelectedFile(null)} style={{ background: 'transparent', border: 'none', color: 'var(--pj-red)', padding: 6 }}><Trash2 size={16} /></button>
          </div>
        </div>
      )}
      {selectedFile && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}><Store size={14} style={{ display: 'inline', marginRight: 4 }} /> Store (to show as stream)</label>
            <select value={selectedBusiness} onChange={(e) => setSelectedBusiness(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--pj-radius-md)', border: '1px solid var(--pj-border)', background: 'var(--pj-surface-1)', color: selectedBusiness ? 'var(--pj-text)' : 'var(--pj-text-tertiary)', fontSize: 'var(--pj-size-body)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}>
              <option value="">Select store</option>
              {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}><Type size={14} style={{ display: 'inline', marginRight: 4 }} /> Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Apartment Tour — Sliema" style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--pj-radius-md)', border: '1px solid var(--pj-border)', background: 'var(--pj-surface-1)', color: 'var(--pj-text)', fontSize: 'var(--pj-size-body)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}><Film size={14} style={{ display: 'inline', marginRight: 4 }} /> Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your video..." rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--pj-radius-md)', border: '1px solid var(--pj-border)', background: 'var(--pj-surface-1)', color: 'var(--pj-text)', fontSize: 'var(--pj-size-body)', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}><Tag size={14} style={{ display: 'inline', marginRight: 4 }} /> Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--pj-radius-md)', border: '1px solid var(--pj-border)', background: 'var(--pj-surface-1)', color: category ? 'var(--pj-text)' : 'var(--pj-text-tertiary)', fontSize: 'var(--pj-size-body)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}>
              <option value="">Select category</option>
              {categoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          {uploadError && <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-red)', marginBottom: 12 }}>{uploadError}</p>}
          <button className="pj-btn-primary" style={{ width: '100%', padding: '16px 20px', fontSize: 15, marginBottom: 8 }} disabled={!title || !selectedBusiness || saving} onClick={handlePublishToStore}>
            {saving ? 'Publishing...' : saved ? 'Published!' : 'Publish to Store (plays as stream)'}
          </button>
          <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', marginBottom: 8 }}>Or save to local library:</p>
          <button className="pj-btn-secondary" style={{ width: '100%', padding: '14px 20px', fontSize: 14 }} disabled={!title || saving} onClick={handlePublishLocal}>
            Save to Library (local only)
          </button>
        </>
      )}
    </div>
  );
}

function VideoLibrary({ videos, onDelete, onRefresh }: { videos: StoredVideo[]; onDelete: (id: string) => void; onRefresh: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteVideo(id);
    onDelete(id);
    setDeleting(null);
  };

  if (videos.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <FileVideo size={48} style={{ color: 'var(--pj-text-tertiary)', marginBottom: 16 }} />
        <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>No videos yet</p>
        <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>Record or upload to build your library</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {videos.map((v) => {
        const url = v.blob ? URL.createObjectURL(v.blob) : '';
        return (
          <div key={v.id} className="pj-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 12, padding: 12 }}>
              <video src={url || undefined} style={{ width: 80, height: 80, borderRadius: 'var(--pj-radius-md)', objectFit: 'cover', background: 'var(--pj-surface-2)' }} muted />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>{v.title}</p>
                <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>{v.category || 'Uncategorized'} · {new Date(v.createdAt).toLocaleDateString()}</p>
              </div>
              <button className="pj-touch" onClick={() => handleDelete(v.id)} disabled={deleting === v.id} style={{ background: 'transparent', border: 'none', color: 'var(--pj-red)', padding: 8 }}><Trash2 size={18} /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RecordingStudio() {
  const router = useRouter();
  const [preset, setPreset] = useState('product');
  const [mode, setMode] = useState<'live' | 'upload' | 'library'>('live');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [viewerCount] = useState(0);
  const [videos, setVideos] = useState<StoredVideo[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 1280, height: 720 }, audio: true });
      setStream(s);
      return s;
    } catch (err) {
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setIsLive(false);
    setIsRecording(false);
  }, [stream]);

  useEffect(() => {
    if (mode === 'live') {
      const id = setTimeout(() => startCamera(), 0);
      return () => { clearTimeout(id); stopCamera(); };
    }
    stopCamera();
  }, [mode]);

  const startRecording = async () => {
    if (!stream) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    mediaRecorderRef.current = mr;
    mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      try {
        await saveVideo({ blob, title: `Recording ${new Date().toLocaleTimeString()}`, description: '', category: '', createdAt: new Date().toISOString(), durationSeconds: 0 });
        setVideos(await getVideos());
        setMode('library');
      } catch (err) {
        console.error(err);
      }
    };
    mr.start();
    setIsRecording(true);
    setIsLive(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  const loadVideos = useCallback(async () => {
    setVideos(await getVideos());
  }, []);

  useEffect(() => {
    if (mode === 'library') loadVideos();
  }, [mode, loadVideos]);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--pj-black)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="pj-studio-container" style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ position: 'relative' }}>
          <ViewHeader onBack={() => router.push('/pjazza/business/dashboard')} viewerCount={viewerCount} isLive={isLive} />
        </div>
        <div style={{ paddingTop: 56 }}>
          <ModeTabs mode={mode} onChange={setMode} />
        </div>
        {mode === 'live' && (
          <>
            <div style={{ marginTop: 8 }}>
              <CameraView stream={stream} isRecording={isRecording} isLive={isLive} />
            </div>
            <StreamPresets active={preset} onChange={setPreset} />
            <RecordControls onRecord={startRecording} onStopRecord={stopRecording} isRecording={isRecording} onLive={() => setIsLive(true)} />
            <CoachingTip />
          </>
        )}
        {mode === 'upload' && <UploadView onSaved={() => { loadVideos(); setMode('library'); }} />}
        {mode === 'library' && <VideoLibrary videos={videos} onDelete={(id) => setVideos((v) => v.filter((x) => x.id !== id))} onRefresh={loadVideos} />}
      </div>
    </div>
  );
}
