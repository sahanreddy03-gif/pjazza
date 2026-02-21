'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Radio,
  Play,
  Eye,
  MapPin,
  ChevronRight,
  Video,
  RefreshCw,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { StreamForList } from '@/src/lib/data';

const LiveKitViewer = dynamic(() => import('@/src/components/consumer/LiveKitViewer'), { ssr: false });

function StreamCardSkeleton() {
  return (
    <div className="w-[160px] shrink-0 overflow-hidden rounded-apple bg-surface-alt">
      <div className="aspect-[9/16] max-h-[200px] w-full animate-pulse bg-line" />
      <div className="p-3">
        <div className="mb-2 h-4 w-[75%] rounded bg-line animate-pulse" />
        <div className="mb-1 h-3 w-1/2 rounded bg-line animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-line animate-pulse" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-apple border border-line bg-surface-alt/50 py-16 px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-line/50">
        <Video className="h-8 w-8 text-ink-muted" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-2">No streams right now</h3>
      <p className="text-sm text-ink-muted mb-6 max-w-[260px]">
        When businesses go live or upload replays, they&apos;ll show up here. Check back soon.
      </p>
      <Link
        href="/pjazza/live-shop"
        className="inline-flex items-center gap-2 rounded-apple bg-ink px-5 py-2.5 text-sm font-semibold text-white"
      >
        Browse Live Shop <ChevronRight size={16} />
      </Link>
    </div>
  );
}

function StreamCard({
  stream,
  onClick,
  index,
}: {
  stream: StreamForList;
  onClick: () => void;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-[160px] shrink-0 flex-col overflow-hidden rounded-apple bg-white shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.98]"
      style={{
        animation: 'stream-card-in 0.4s ease-out forwards',
        opacity: 0,
        animationDelay: `${index * 60}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="relative aspect-[9/16] max-h-[200px] overflow-hidden bg-surface-alt">
        <img
          src={stream.img}
          alt={stream.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {stream.isLive && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-live px-2 py-0.5 text-[9px] font-bold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        )}
        {!stream.isLive && stream.videoUrl && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink/70 px-2 py-0.5 text-[9px] font-bold text-white">
            <Play size={8} fill="white" /> Replay
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-[10px] font-semibold text-white">
          <Eye size={10} />
          {stream.viewers}
        </div>
      </div>
      <div className="p-3 text-left">
        <h3 className="truncate text-[13px] font-semibold text-ink">{stream.name}</h3>
        <p className="flex items-center gap-1 truncate text-[11px] text-ink-muted">
          <MapPin size={10} /> {stream.location}
        </p>
      </div>
    </button>
  );
}

export default function LivePage() {
  const [streams, setStreams] = useState<StreamForList[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStream, setSelectedStream] = useState<StreamForList | null>(null);
  const [viewerToken, setViewerToken] = useState<string | null>(null);

  const fetchStreams = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/streams');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setStreams(data.streams ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setStreams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const watchStream = async (stream: StreamForList) => {
    if (stream.videoUrl) {
      setSelectedStream(stream);
      setViewerToken(null);
      return;
    }
    if (stream.roomId && stream.isLive) {
      try {
        const res = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room: stream.roomId,
            identity: `viewer-${crypto.randomUUID().slice(0, 8)}`,
            name: 'Viewer',
            subscribeOnly: true,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not connect');
        setSelectedStream(stream);
        setViewerToken(data.token);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not join stream');
      }
    } else if (stream.slug) {
      window.location.href = `/pjazza/live-shop/${stream.businessId || stream.slug}`;
    }
  };

  const closeViewer = () => {
    setSelectedStream(null);
    setViewerToken(null);
  };

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (selectedStream) {
    if (selectedStream.videoUrl) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <button
              onClick={closeViewer}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
            >
              ←
            </button>
            <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white">
              Replay · {selectedStream.name}
            </span>
          </div>
          <video
            src={selectedStream.videoUrl}
            autoPlay
            controls
            playsInline
            className="h-full w-full object-contain"
            onEnded={closeViewer}
          />
        </div>
      );
    }
    if (viewerToken && serverUrl) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={closeViewer}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
            >
              ←
            </button>
          </div>
          <LiveKitViewer
            token={viewerToken}
            serverUrl={serverUrl}
            streamName={selectedStream.name}
            onDisconnected={closeViewer}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink">Live</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            {streams && streams.length > 0
              ? `${streams.filter((s) => s.isLive).length} live · ${streams.length} total`
              : 'Watch streams & replays'}
          </p>
        </div>
        <button
          onClick={fetchStreams}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-ink-muted transition-transform hover:bg-line active:scale-95 disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="rounded-apple bg-warn/10 border border-warn/30 px-4 py-3 text-sm text-ink">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {[0, 1, 2, 3].map((i) => (
            <StreamCardSkeleton key={i} />
          ))}
        </div>
      ) : streams && streams.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {streams.map((stream, i) => (
            <StreamCard
              key={`${stream.businessId || stream.name}-${i}`}
              stream={stream}
              onClick={() => watchStream(stream)}
              index={i}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <div className="pt-4">
        <Link
          href="/pjazza/live-shop"
          className="flex items-center justify-between rounded-apple border border-line bg-white px-4 py-3 shadow-card transition-all hover:shadow-card-hover"
        >
          <span className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-live/10">
              <Radio size={20} className="text-live" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-ink">Live Shop</p>
              <p className="text-xs text-ink-muted">Video call any store · Browse & buy</p>
            </div>
          </span>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>
      </div>
    </div>
  );
}
