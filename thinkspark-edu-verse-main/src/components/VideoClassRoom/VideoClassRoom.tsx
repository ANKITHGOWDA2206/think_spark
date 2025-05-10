
import React from 'react';

interface VideoClassRoomProps {
  roomUrl: string;
  className?: string;
}

const VideoClassRoom: React.FC<VideoClassRoomProps> = ({ roomUrl, className = '' }) => {
  if (!roomUrl) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No video room URL available</p>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video ${className}`}>
      <iframe
        src={roomUrl}
        allow="camera; microphone; fullscreen; speaker; display-capture"
        className="absolute inset-0 w-full h-full rounded-lg border border-gray-200"
        style={{ height: '100%', width: '100%' }}
        title="Live Class"
      />
    </div>
  );
};

export default VideoClassRoom;
