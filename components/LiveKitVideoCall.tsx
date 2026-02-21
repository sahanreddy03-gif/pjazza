'use client';

import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

type LiveKitVideoCallProps = {
  token: string;
  serverUrl: string;
  onDisconnected?: () => void;
  className?: string;
  video?: boolean;
};

export default function LiveKitVideoCall({
  token,
  serverUrl,
  onDisconnected,
  className,
  video = true,
}: LiveKitVideoCallProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      video={video}
      audio={true}
      connect={true}
      onDisconnected={onDisconnected}
      className={className}
      style={{ width: '100%', height: '100%', minHeight: 300 }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
