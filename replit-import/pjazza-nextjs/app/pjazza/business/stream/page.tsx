'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Video, Camera, Smartphone,
  Radio, Users, MessageSquare, Settings, Lightbulb,
  X, Upload, FileVideo, CheckCircle, Clock, Film,
  Image, Type, Tag, ChevronRight, Trash2, Play
} from 'lucide-react';

function ViewHeader({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(rgba(0,0,0,0.5), transparent)',
      }}
    >
      <button
        className="pj-touch"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
        onClick={onBack}
        data-testid="button-back"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 'var(--pj-radius-pill)',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            fontSize: 'var(--pj-size-xs)',
            fontWeight: 600,
            color: 'white',
          }}
        >
          <Users size={12} />
          <span className="pj-mono">0</span>
        </div>
        <button
          className="pj-touch"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
          data-testid="button-settings"
        >
          <Settings size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function Viewfinder() {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '9/16',
        maxHeight: '65vh',
        background: 'var(--pj-surface-1)',
        borderRadius: 'var(--pj-radius-lg)',
        overflow: 'hidden',
        margin: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center', padding: 24 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--pj-surface-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Video size={24} strokeWidth={1.5} style={{ color: 'var(--pj-text-tertiary)' }} />
        </div>
        <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 4 }}>
          Camera preview
        </p>
        <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)' }}>
          Tap record to start streaming
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--pj-radius-pill)',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            fontSize: 'var(--pj-size-micro)',
            fontWeight: 600,
            color: 'var(--pj-text-secondary)',
          }}
        >
          9:16
        </div>
        <div
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--pj-radius-pill)',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            fontSize: 'var(--pj-size-micro)',
            fontWeight: 600,
            color: 'var(--pj-text-secondary)',
          }}
        >
          HD 1080p
        </div>
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
        <button
          key={p.id}
          className={`pj-pill ${active === p.id ? 'pj-pill-active' : ''}`}
          onClick={() => onChange(p.id)}
          data-testid={`button-preset-${p.id}`}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <p.Icon size={14} strokeWidth={2} />
          {p.label}
        </button>
      ))}
    </div>
  );
}

function RecordControls({ onRecord }: { onRecord: () => void }) {
  return (
    <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <button
        className="pj-touch"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'var(--pj-surface-2)',
          border: '1px solid var(--pj-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--pj-text-secondary)',
        }}
        data-testid="button-flip-camera"
      >
        <Camera size={18} strokeWidth={2} />
      </button>

      <button
        className="pj-touch"
        onClick={onRecord}
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'transparent',
          border: '3px solid var(--pj-red)',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        data-testid="button-record"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'var(--pj-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Radio size={24} strokeWidth={2.5} style={{ color: 'white' }} />
        </div>
      </button>

      <button
        className="pj-touch"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'var(--pj-surface-2)',
          border: '1px solid var(--pj-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--pj-text-secondary)',
        }}
        data-testid="button-chat"
      >
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
      <div
        className="pj-card"
        style={{
          padding: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          borderColor: 'var(--pj-border-hover)',
        }}
      >
        <Lightbulb size={18} strokeWidth={2} style={{ color: 'var(--pj-gold)', flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>
            Quick tip
          </h4>
          <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', lineHeight: 1.5 }}>
            Start with your best product. Smile, introduce yourself, and tell viewers what makes it special. Keep it under 15 minutes for best engagement.
          </p>
        </div>
        <button
          className="pj-touch"
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--pj-text-tertiary)',
            padding: 4,
          }}
          data-testid="button-dismiss-tip"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function UploadView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({ name: file.name, size: `${sizeMB} MB` });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const categoryOptions = [
    'Food & Dining', 'Property', 'Cars & Auto', 'Yachts & Marine',
    'Home Services', 'Freelancers', 'Health & Wellness', 'Fashion & Retail',
    'Electronics', 'Tourism', 'Education', 'Pets & Animals',
  ];

  return (
    <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        data-testid="input-file-upload"
      />

      {!selectedFile ? (
        <button
          onClick={handleFileSelect}
          style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 'var(--pj-radius-lg)',
            border: '2px dashed var(--pj-border-hover)',
            background: 'var(--pj-surface-1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            cursor: 'pointer',
            padding: 24,
          }}
          data-testid="button-upload-area"
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--pj-surface-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Upload size={24} strokeWidth={1.5} style={{ color: 'var(--pj-red)' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text)', marginBottom: 4 }}>
              Tap to upload video
            </p>
            <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)' }}>
              MP4, MOV, or WebM up to 500MB
            </p>
          </div>
        </button>
      ) : (
        <div
          className="pj-card"
          style={{ padding: 16, marginBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--pj-radius-md)',
                background: 'var(--pj-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileVideo size={22} strokeWidth={1.5} style={{ color: 'var(--pj-red)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedFile.name}
              </p>
              <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>
                {selectedFile.size}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                className="pj-touch"
                onClick={handleFileSelect}
                style={{ background: 'transparent', border: 'none', color: 'var(--pj-text-secondary)', padding: 6 }}
                data-testid="button-change-file"
              >
                <Upload size={16} />
              </button>
              <button
                className="pj-touch"
                onClick={handleRemoveFile}
                style={{ background: 'transparent', border: 'none', color: 'var(--pj-red)', padding: 6 }}
                data-testid="button-remove-file"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>
            <Type size={14} /> Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sea View Apartment Tour — Sliema"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--pj-radius-md)',
              border: '1px solid var(--pj-border)',
              background: 'var(--pj-surface-1)',
              color: 'var(--pj-text)',
              fontSize: 'var(--pj-size-body)',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            data-testid="input-video-title"
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>
            <Film size={14} /> Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what viewers will see in this video..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--pj-radius-md)',
              border: '1px solid var(--pj-border)',
              background: 'var(--pj-surface-1)',
              color: 'var(--pj-text)',
              fontSize: 'var(--pj-size-body)',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            data-testid="input-video-description"
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>
            <Tag size={14} /> Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--pj-radius-md)',
              border: '1px solid var(--pj-border)',
              background: 'var(--pj-surface-1)',
              color: category ? 'var(--pj-text)' : 'var(--pj-text-tertiary)',
              fontSize: 'var(--pj-size-body)',
              fontFamily: 'inherit',
              outline: 'none',
              appearance: 'none',
              boxSizing: 'border-box',
            }}
            data-testid="select-video-category"
          >
            <option value="">Select a category</option>
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button
            className="pj-btn-primary"
            style={{ flex: 1, padding: '16px 20px', fontSize: 15, opacity: selectedFile && title ? 1 : 0.4 }}
            disabled={!selectedFile || !title}
            data-testid="button-publish-video"
          >
            <Upload size={16} strokeWidth={2.5} />
            <span>Publish Video</span>
          </button>
        </div>

        <div
          className="pj-card"
          style={{ padding: 14, display: 'flex', gap: 10, alignItems: 'flex-start', borderColor: 'var(--pj-border-hover)' }}
        >
          <CheckCircle size={16} strokeWidth={2} style={{ color: 'var(--pj-green)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-secondary)', lineHeight: 1.5 }}>
              Videos are reviewed within 24 hours. Once approved, they appear on your profile and in search results across PJAZZA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeTabs({ mode, onChange }: { mode: 'live' | 'upload'; onChange: (m: 'live' | 'upload') => void }) {
  return (
    <div style={{ padding: '12px 16px 0', display: 'flex', gap: 4, background: 'var(--pj-black)' }}>
      <button
        className={`pj-pill ${mode === 'live' ? 'pj-pill-active' : ''}`}
        onClick={() => onChange('live')}
        style={{ flex: 1, justifyContent: 'center', padding: '10px 16px' }}
        data-testid="button-mode-live"
      >
        <Radio size={14} strokeWidth={2} />
        Go Live
      </button>
      <button
        className={`pj-pill ${mode === 'upload' ? 'pj-pill-active' : ''}`}
        onClick={() => onChange('upload')}
        style={{ flex: 1, justifyContent: 'center', padding: '10px 16px' }}
        data-testid="button-mode-upload"
      >
        <Upload size={14} strokeWidth={2} />
        Upload Video
      </button>
    </div>
  );
}

export default function RecordingStudio() {
  const router = useRouter();
  const [preset, setPreset] = useState('product');
  const [mode, setMode] = useState<'live' | 'upload'>('live');

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--pj-black)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="pj-studio-container">
        <div style={{ position: 'relative' }}>
          <ViewHeader onBack={() => router.push('/pjazza/business/dashboard')} />
        </div>

        <div style={{ paddingTop: 56 }}>
          <ModeTabs mode={mode} onChange={setMode} />
        </div>

        {mode === 'live' ? (
          <>
            <div style={{ marginTop: 8 }}>
              <Viewfinder />
            </div>
            <StreamPresets active={preset} onChange={setPreset} />
            <div style={{ flex: 1 }} />
            <RecordControls onRecord={() => {}} />
            <CoachingTip />
          </>
        ) : (
          <UploadView />
        )}
      </div>
    </div>
  );
}
