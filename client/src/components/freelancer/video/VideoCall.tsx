import React, { useCallback, useEffect, useRef, useState } from 'react';
import socket from '../../../utils/socket';
import { handleApiError } from '../../../utils/errors/errorHandler';

interface VideoCallProps {
  roomId: string;
  onCallEnd?: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, onCallEnd }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  // ICE candidate queue - THIS IS THE KEY FIX
  const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSetRef = useRef<boolean>(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [callInitiated, setCallInitiated] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Check if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Debug mobile environment
  useEffect(() => {
    const debugInfo = {
      userAgent: navigator.userAgent,
      isIOS: isIOS,
      isAndroid: /Android/.test(navigator.userAgent),
      isMobile: isMobile,
      hasGetUserMedia: !!navigator.mediaDevices?.getUserMedia,
      isSecureContext: window.isSecureContext,
      hasCamera: !!navigator.mediaDevices,
    };
    console.log('Mobile Debug Info:', debugInfo);
  }, [isMobile, isIOS]);

  // Check media permissions
  const checkMediaPermissions = async () => {
    try {
      if ('permissions' in navigator) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        
        console.log('Camera permission:', cameraPermission.state);
        console.log('Microphone permission:', microphonePermission.state);
        
        if (cameraPermission.state === 'denied' || microphonePermission.state === 'denied') {
          setPermissionError('Camera or microphone access denied. Please enable permissions and refresh.');
          return false;
        }
      }
      return true;
    } catch (error) {
      handleApiError(error)
      console.log('Permission API not supported, proceeding anyway');
      return true;
    }
  };

  // Process queued ICE candidates after remote description is set
  const processQueuedIceCandidates = async () => {
    if (!pcRef.current || !remoteDescriptionSetRef.current) {
      console.log('Cannot process ICE candidates yet - peer connection or remote description not ready');
      return;
    }

    console.log(`Processing ${iceCandidateQueueRef.current.length} queued ICE candidates`);
    
    while (iceCandidateQueueRef.current.length > 0) {
      const candidate = iceCandidateQueueRef.current.shift();
      if (candidate) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log('Successfully added queued ICE candidate');
        } catch (error) {
          console.error('Error adding queued ICE candidate:', error);
        }
      }
    }
  };

  //* PeerConnection
  const initializePeerConnection = useCallback(() => {
    // Reset ICE candidate queue and remote description flag
    iceCandidateQueueRef.current = [];
    remoteDescriptionSetRef.current = false;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
        // Add more TURN servers for production reliability
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
      ],
      // Add configuration for better production performance
      iceCandidatePoolSize: 10,
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
    });

    //* Listen for remote tracks
    pc.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind);
      const [remoteStream] = event.streams;
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
        setIsConnected(true);
        
        // Ensure remote video plays
        remoteVideoRef.current.play().catch(e => 
          console.log('Remote video play failed:', e)
        );
      }
    };

    //* Send ICE candidates to peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate.type);
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      } else {
        console.log('ICE candidate gathering complete');
      }
    };

    //* Connection state monitoring
    pc.onconnectionstatechange = () => {
      console.log('Connection state changed:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        console.log('✅ Peer connection established successfully');
      } else if (pc.connectionState === 'failed') {
        console.log('❌ Peer connection failed');
        // Attempt to restart ICE
        pc.restartIce();
      } else if (pc.connectionState === 'disconnected') {
        console.log('⚠️ Peer connection disconnected');
      }
    };

    //* ICE connection state monitoring
    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed') {
        console.log('ICE connection failed, restarting...');
        pc.restartIce();
      }
    };

    //* ICE gathering state monitoring
    pc.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', pc.iceGatheringState);
    };

    return pc;
  }, [roomId]);

  const handleCallCleanup = useCallback(() => {
    setIsCallActive(false);
    setIsConnected(false);
    setIsIncomingCall(false);
    setIncomingOffer(null);
    setCallInitiated(false);
    setIsAnswering(false);
    setPermissionError(null);

    // Reset ICE candidate queue and remote description flag
    iceCandidateQueueRef.current = [];
    remoteDescriptionSetRef.current = false;

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

    //* incoming call notification
    const handleIncomingCall = (data: { sender: string }) => {
      console.log('Incoming call received from:', data.sender);
      setIsIncomingCall(true);
    };

    //* receiving offer
    const handleOffer = (data: { offer: RTCSessionDescriptionInit; sender: string }) => {
      console.log('Offer received from:', data.sender);
      setIncomingOffer(data.offer);
      setIsIncomingCall(true);
    };

    //* receiving answer
    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit; sender: string }) => {
      console.log('Answer received from:', data.sender);
      if (pcRef.current && data.answer) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          console.log('✅ Answer set successfully');
          
          // Mark remote description as set and process queued ICE candidates
          remoteDescriptionSetRef.current = true;
          await processQueuedIceCandidates();
          
          setIsCallActive(true);
          setCallInitiated(false);
        } catch (error) {
          console.error('❌ Error setting remote description (answer):', error);
        }
      }
    };

    // FIXED ICE CANDIDATE HANDLING
    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit; sender: string }) => {
      console.log('ICE candidate received from:', data.sender);
      
      if (!pcRef.current) {
        console.log('No peer connection available, ignoring ICE candidate');
        return;
      }

      // Check if remote description has been set
      if (!remoteDescriptionSetRef.current) {
        console.log('Remote description not set yet, queuing ICE candidate');
        iceCandidateQueueRef.current.push(data.candidate);
        return;
      }

      // Remote description is set, add candidate immediately
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log('✅ ICE candidate added successfully');
      } catch (error) {
        console.error('❌ Error adding ICE candidate:', error);
        // If it fails, queue it for later
        iceCandidateQueueRef.current.push(data.candidate);
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
      setPermissionError(null);
      
      // Check permissions first
      const hasPermissions = await checkMediaPermissions();
      if (!hasPermissions) {
        throw new Error('Media permissions denied');
      }

      // Mobile-friendly media constraints
      const constraints = {
        video: {
          width: { min: 320, ideal: 640, max: 1280 },
          height: { min: 240, ideal: 480, max: 720 },
          frameRate: { ideal: 15, max: 30 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 44100 }
        }
      };

      console.log('Requesting media with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => console.log('Local video play failed:', e));
      }

      if (pcRef.current && stream) {
        // Remove existing tracks first
        pcRef.current.getSenders().forEach(sender => {
          if (sender.track) {
            pcRef.current?.removeTrack(sender);
          }
        });

        // Add new tracks
        stream.getTracks().forEach((track) => {
          console.log('Adding track:', track.kind, track.label);
          pcRef.current?.addTrack(track, stream);
        });
      }
      
      console.log('✅ Media stream started successfully');
      return stream;
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      
      // Fallback: Try with more basic constraints
      try {
        console.log('Trying fallback constraints...');
        const fallbackConstraints = isMobile ? 
          { video: { facingMode: 'user' }, audio: true } : 
          { video: true, audio: true };
          
        const fallbackStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        
        localStreamRef.current = fallbackStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = fallbackStream;
          localVideoRef.current.play().catch(e => console.log('Fallback video play failed:', e));
        }
        
        if (pcRef.current && fallbackStream) {
          fallbackStream.getTracks().forEach((track) => {
            pcRef.current?.addTrack(track, fallbackStream);
          });
        }
        
        console.log('✅ Fallback stream started successfully');
        return fallbackStream;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        setPermissionError(`Unable to access camera/microphone: ${fallbackError.message}`);
        throw fallbackError;
      }
    }
  };

  const handleInitiateCall = async () => {
    console.log('🚀 Initiating call...');
    setCallInitiated(true);
    
    try {
      socket.emit('initiate_call', { roomId });
      
      await startLocalStream();
      if (!pcRef.current) {
        throw new Error('No peer connection available');
      }

      console.log('Creating offer...');
      const offer = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await pcRef.current.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
      
      console.log('✅ Offer sent successfully');
    } catch (error) {
      console.error('❌ Failed to initiate call:', error);
      setCallInitiated(false);
      alert(`Failed to start call: ${error.message}`);
    }
  };

  const handleAnswerCall = async () => {
    if (!incomingOffer) {
      console.error('No incoming offer available');
      return;
    }
    
    console.log('📞 Answering call...');
    setIsAnswering(true);
    
    try {
      setIsIncomingCall(false);
      
      console.log('Starting media stream...');
      await startLocalStream();
      
      if (!pcRef.current) {
        throw new Error('No peer connection available');
      }

      console.log('Setting remote description (offer)...');
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      
      // Mark remote description as set and process queued ICE candidates
      remoteDescriptionSetRef.current = true;
      await processQueuedIceCandidates();
      
      console.log('Creating answer...');
      const answer = await pcRef.current.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('Setting local description (answer)...');
      await pcRef.current.setLocalDescription(answer);
      
      console.log('Emitting answer...');
      socket.emit('answer', { roomId, answer });
      
      setIsCallActive(true);
      setIncomingOffer(null);
      setIsAnswering(false);
      
      console.log('✅ Call answered successfully');
    } catch (error) {
      console.error('❌ Failed to answer call:', error);
      
      setIsIncomingCall(true);
      setIsCallActive(false);
      setIsAnswering(false);
      remoteDescriptionSetRef.current = false;
      
      alert(`Failed to answer call: ${error.message}`);
    }
  };

  // Mobile-specific answer call handler
  const handleAnswerCallMobile = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const answerBtn = document.getElementById('answer-btn') as HTMLButtonElement;
    if (answerBtn) {
      answerBtn.disabled = true;
    }
    
    try {
      await handleAnswerCall();
    } finally {
      setTimeout(() => {
        if (answerBtn) {
          answerBtn.disabled = false;
        }
      }, 2000);
    }
  };

  const handleDeclineCall = () => {
    console.log('❌ Declining call...');
    setIsIncomingCall(false);
    setIncomingOffer(null);
    socket.emit('decline_call', { roomId });
    
    if (onCallEnd) {
      onCallEnd();
    }
  };

  const handleEndCall = () => {
    console.log('🔚 Ending call...');
    socket.emit('call_ended', { roomId });
    handleCallCleanup();
  };

  const toggleAudio = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsAudioMuted((prev) => !prev);
  };

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
    isConnected,
    isAnswering,
    isMobile,
    remoteDescriptionSet: remoteDescriptionSetRef.current,
    queuedCandidates: iceCandidateQueueRef.current.length
  });

  return (
    <div style={{ 
      maxWidth: isMobile ? '100%' : 800, 
      margin: 'auto', 
      padding: isMobile ? 10 : 20, 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Video Call</h2>

      {/* Permission Error */}
      {permissionError && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #e57373'
        }}>
          {permissionError}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: isMobile ? 10 : 20,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: isMobile ? 280 : 320,
              height: isMobile ? 210 : 240,
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
              fontSize: isMobile ? '12px' : '14px'
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
              width: isMobile ? 280 : 320,
              height: isMobile ? 210 : 240,
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
              fontSize: isMobile ? '12px' : '14px'
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
          gap: isMobile ? 10 : 15,
          flexWrap: 'wrap',
        }}
      >
        {/* Show Start Call button only if no call is active and no incoming call */}
        {!isCallActive && !isIncomingCall && !callInitiated && !isAnswering && (
          <button
            onClick={handleInitiateCall}
            style={{
              padding: isMobile ? '12px 20px' : '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: isMobile ? '16px' : '14px',
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
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
                padding: isMobile ? '12px 20px' : '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: isMobile ? '16px' : '14px',
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              Cancel Call
            </button>
          </div>
        )}

        {/* Show answering status */}
        {isAnswering && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: '#2196f3' }}>
              📞 Connecting...
            </p>
          </div>
        )}

        {/* Show incoming call options */}
        {isIncomingCall && !isAnswering && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              marginBottom: 10, 
              fontSize: isMobile ? '20px' : '18px', 
              fontWeight: 'bold' 
            }}>
              📞 Incoming call...
            </p>
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? 15 : 10, 
              justifyContent: 'center',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <button
                id="answer-btn"
                onClick={isMobile ? handleAnswerCallMobile : handleAnswerCall}
                onTouchStart={isMobile ? (e) => e.preventDefault() : undefined}
                style={{
                  padding: isMobile ? '16px 32px' : '12px 24px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '18px' : '16px',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  minWidth: isMobile ? '200px' : 'auto'
                }}
              >
                📞 Answer Call
              </button>
              <button
                onClick={handleDeclineCall}
                onTouchStart={isMobile ? (e) => e.preventDefault() : undefined}
                style={{
                  padding: isMobile ? '16px 32px' : '12px 24px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '18px' : '16px',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  minWidth: isMobile ? '200px' : 'auto'
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