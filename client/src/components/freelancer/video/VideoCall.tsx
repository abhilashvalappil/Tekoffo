
import React, { useCallback, useEffect, useRef, useState } from 'react';
import socket from '../../../utils/socket';

interface VideoCallProps {
  roomId: string;
  onCallEnd?: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, onCallEnd }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [callInitiated, setCallInitiated] = useState(false);

  //*PeerConnection
  const initializePeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    //* Listen for remote tracks
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
        setIsConnected(true);
      }
    };

    //* Send ICE candidates to peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    return pc;
  }, [roomId]);

   const handleCallCleanup = useCallback(() => {
    setIsCallActive(false);
    setIsConnected(false);
    setIsIncomingCall(false);
    setIncomingOffer(null);
    setCallInitiated(false);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = initializePeerConnection();
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (onCallEnd) {
      onCallEnd();
    }
  }, [initializePeerConnection, onCallEnd]);

  useEffect(() => {
    pcRef.current = initializePeerConnection();

    //*incoming call notification
    const handleIncomingCall = (data: { sender: string }) => {
      console.log('Incoming call received from:', data.sender);
      setIsIncomingCall(true);
    };

    //*receiving offer
    const handleOffer = (data: { offer: RTCSessionDescriptionInit; sender: string }) => {
      console.log('Offer received from:', data.sender);
      setIncomingOffer(data.offer);
      setIsIncomingCall(true); // Make sure incoming call state is set
    };

    //*receiving answer
    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit; sender: string }) => {
      console.log('Answer received from:', data.sender);
      if (pcRef.current && data.answer) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          console.log('Answer set successfully');
          setIsCallActive(true);
          setCallInitiated(false);
        } catch (error) {
          console.error('Error setting remote description:', error);
        }
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit; sender: string }) => {
      if (pcRef.current && data.candidate) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Error adding received ICE candidate', err);
        }
      }
    };
 
    const handleCallEnded = (data: { sender: string }) => {
      console.log('Call ended by:', data.sender);
      handleCallCleanup();
    };
 
    const handleCallDeclined = (data: { sender: string }) => {
      console.log('Call declined by:', data.sender);
      handleCallCleanup();
      setCallInitiated(false);
    };

    socket.on('incoming_call', handleIncomingCall);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call_ended', handleCallEnded);
    socket.on('call_declined', handleCallDeclined);

    // Join room on mount
    socket.emit('join_room', roomId);

    return () => {
      socket.off('incoming_call', handleIncomingCall);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('call_ended', handleCallEnded);
      socket.off('call_declined', handleCallDeclined);
      
      //* Clean up peer connection and streams
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [roomId, initializePeerConnection, handleCallCleanup]);
 
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (pcRef.current && stream) {
        stream.getTracks().forEach((track) => {
          pcRef.current?.addTrack(track, stream);
        });
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  const handleInitiateCall = async () => {
    console.log('Initiating call...');
    setCallInitiated(true);
    
    try {
      socket.emit('initiate_call', { roomId });
      
      //* Start local stream  create offer
      await startLocalStream();
      if (!pcRef.current) return;

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
      
      console.log('Offer sent successfully');
    } catch (error) {
      console.error('Failed to initiate call:', error);
      setCallInitiated(false);
    }
  };

  const handleAnswerCall = async () => {
    if (!incomingOffer) {
      console.error('No incoming offer available');
      return;
    }
    
    console.log('Answering call...');
    
    try {
      await startLocalStream();
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      
      socket.emit('answer', { roomId, answer });
      
      setIsIncomingCall(false);
      setIsCallActive(true);
      setIncomingOffer(null);
      
      console.log('Call answered successfully');
    } catch (error) {
      console.error('Failed to answer call:', error);
    }
  };

  const handleDeclineCall = () => {
    console.log('Declining call...');
    setIsIncomingCall(false);
    setIncomingOffer(null);
    socket.emit('decline_call', { roomId });
    
    if (onCallEnd) {
      onCallEnd();
    }
  };

  const handleEndCall = () => {
    console.log('Ending call...');
    socket.emit('call_ended', { roomId });
    handleCallCleanup();
  };

  //* audio mute/unmute
  const toggleAudio = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsAudioMuted((prev) => !prev);
  };

  //*video mute/unmute
  const toggleVideo = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoMuted((prev) => !prev);
  };

  console.log('Current state:', {
    isCallActive,
    isIncomingCall,
    callInitiated,
    hasIncomingOffer: !!incomingOffer,
    isConnected
  });

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Video Call</h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
        <div style={{ position: 'relative' }}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: 320,
              height: 240,
              borderRadius: 10,
              border: '3px solid #4caf50',
              backgroundColor: '#000',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              backgroundColor: '#4caf50',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: 6,
              fontWeight: 'bold',
            }}
          >
            You
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: 320,
              height: 240,
              borderRadius: 10,
              border: isConnected ? '3px solid #2196f3' : '3px dashed #aaa',
              backgroundColor: '#000',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              backgroundColor: isConnected ? '#2196f3' : '#aaa',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: 6,
              fontWeight: 'bold',
            }}
          >
            {isConnected ? 'Remote' : 'Waiting...'}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          gap: 15,
          flexWrap: 'wrap',
        }}
      >
        {/* Show Start Call button only if no call is active and no incoming call */}
        {!isCallActive && !isIncomingCall && !callInitiated && (
          <button
            onClick={handleInitiateCall}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Start Call
          </button>
        )}

        {/* Show calling status */}
        {callInitiated && !isCallActive && !isIncomingCall && (
          <div style={{ textAlign: 'center' }}>
            <p>Calling...</p>
            <button
              onClick={handleEndCall}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Cancel Call
            </button>
          </div>
        )}

        {/* Show incoming call options - This should now work properly */}
        {isIncomingCall && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: 10, fontSize: '18px', fontWeight: 'bold' }}>
              📞 Incoming call...
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={handleAnswerCall}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                📞 Answer Call
              </button>
              <button
                onClick={handleDeclineCall}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                ❌ Decline
              </button>
            </div>
          </div>
        )}

        {/* Show call controls when call is active */}
        {isCallActive && (
          <>
            <button
              onClick={handleEndCall}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              End Call
            </button>

            <button
              onClick={toggleAudio}
              style={{
                padding: '10px 20px',
                backgroundColor: isAudioMuted ? '#757575' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {isAudioMuted ? '🔇 Unmute Audio' : '🔊 Mute Audio'}
            </button>

            <button
              onClick={toggleVideo}
              style={{
                padding: '10px 20px',
                backgroundColor: isVideoMuted ? '#757575' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {isVideoMuted ? '📹 Enable Video' : '📹 Disable Video'}
            </button>
          </>
        )}
      </div>

      {/* Debug info - remove in production */}
      <div style={{ marginTop: 20, fontSize: '12px', color: '#666', textAlign: 'center' }}>
        Debug: Call Active: {isCallActive.toString()}, Incoming: {isIncomingCall.toString()}, 
        Initiated: {callInitiated.toString()}, Has Offer: {(!!incomingOffer).toString()}
      </div>
    </div>
  );
};

export default VideoCall;