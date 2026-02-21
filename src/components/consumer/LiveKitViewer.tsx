'use client';

import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

type LiveKitViewerProps = {
  token: string;
  serverUrl: string;
  streamName?: string;
  onDisconnected?: () => void;
};

export default function LiveKitViewer({
  token,
  serverUrl,
  streamName,
  onDisconnected,
}: LiveKitViewerProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      video={true}
      audio={true}
      connect={true}
      onDisconnected={onDisconnected}
      style={{ width: '100%', height: '100%', minHeight: '100vh' }}
    >
      <div className="lk-room-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {streamName && (
          <div
            style={{
              position: 'absolute',
              bottom: 80,
              left: 16,
              right: 16,
              zIndex: 10,
              padding: '10px 14px',
              borderRadius: 'var(--pj-radius-pill, 12px)',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              fontSize: 14,
              fontWeight: 600,
              color: 'white',
            }}
          >
            {streamName}
          </div>
        )}
        <VideoConference />
      </div>
    </LiveKitRoom>
  );
}
