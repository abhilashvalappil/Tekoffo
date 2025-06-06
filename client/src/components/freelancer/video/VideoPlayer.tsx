import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
    stream: MediaStream | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />;
};

export default VideoPlayer;
