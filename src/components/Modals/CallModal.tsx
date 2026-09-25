import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Volume2, 
  VolumeX, 
  ShieldCheck 
} from 'lucide-react';
import { Contact } from '../../types/whatsapp';
import { startRingtoneSound, stopRingtoneSound } from '../../utils/audio';

interface CallModalProps {
  contact: Contact;
  type: 'voice' | 'video';
  onEndCall: (durationSeconds: number) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  contact,
  type,
  onEndCall,
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected'>('ringing');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(type === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Handle ringtone and auto-connect simulation
  useEffect(() => {
    startRingtoneSound();

    const connectTimer = setTimeout(() => {
      stopRingtoneSound();
      setCallState('connected');
    }, 3500);

    return () => {
      stopRingtoneSound();
      clearTimeout(connectTimer);
    };
  }, []);

  // Handle duration counter when connected
  useEffect(() => {
    let timer: number | null = null;
    if (callState === 'connected') {
      timer = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleHangup = () => {
    stopRingtoneSound();
    onEndCall(duration);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111b21]/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 sm:p-10 select-none text-white animate-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between max-w-xl">
        <div className="flex items-center gap-2 bg-[#202c33] px-3 py-1.5 rounded-full text-xs text-[#8696a0] border border-[#222e35]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
          <span>End-to-end encrypted call with @username keys</span>
        </div>

        <button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className="p-2 rounded-full bg-[#202c33] hover:bg-[#374248] text-[#aebac1]"
          title="Speaker"
        >
          {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Center Video or Avatar Stage */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 max-w-xl w-full">
        {type === 'video' && isVideoOn ? (
          /* Video Call Viewport */
          <div className="relative w-full aspect-video sm:aspect-square max-h-[420px] rounded-2xl overflow-hidden bg-[#202c33] border border-[#222e35] shadow-2xl flex items-center justify-center">
            {/* Main Remote User Feed Simulation */}
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-full h-full object-cover filter brightness-95"
              referrerPolicy="no-referrer"
            />

            {/* In-Call HUD details */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="font-semibold text-sm">{contact.name}</span>
              <span className="font-mono text-xs text-[#00a884]">{contact.username}</span>
            </div>

            {/* Self PIP Thumbnail preview */}
            <div className="absolute bottom-4 right-4 w-28 h-36 rounded-xl bg-black/80 border-2 border-white/20 overflow-hidden shadow-lg flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Self PIP"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 left-2 font-mono text-[9px] text-[#00a884]">
                You (@tayyab_official)
              </span>
            </div>
          </div>
        ) : (
          /* Voice Call Avatar View */
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5">
              <div className={`p-1.5 rounded-full ${callState === 'ringing' ? 'animate-pulse ring-4 ring-[#00a884]/40' : 'ring-2 ring-[#00a884]'}`}>
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold mb-1">
              {contact.name}
            </h2>

            {/* Prominent Unique Username Identifier */}
            <div className="flex items-center gap-1.5 bg-[#00a884]/15 px-3 py-1 rounded-full mb-3 border border-[#00a884]/30">
              <span className="font-mono text-sm text-[#00a884] font-medium">
                {contact.username}
              </span>
            </div>

            <p className="text-sm font-medium text-[#8696a0]">
              {callState === 'ringing' ? (
                <span className="animate-pulse">Calling @username...</span>
              ) : (
                <span className="text-[#00a884] font-mono text-base">{formatDuration(duration)}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center gap-4 bg-[#202c33] px-6 py-3.5 rounded-full shadow-2xl border border-[#222e35]">
        {/* Toggle Mute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-full transition-colors ${
            isMuted ? 'bg-rose-500 text-white' : 'bg-[#111b21] hover:bg-[#374248] text-white'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Toggle Video */}
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full transition-colors ${
            !isVideoOn ? 'bg-rose-500 text-white' : 'bg-[#111b21] hover:bg-[#374248] text-white'
          }`}
          title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={() => alert("Screen share: Sharing screen with " + contact.username)}
          className="p-3 rounded-full bg-[#111b21] hover:bg-[#374248] text-white transition-colors"
          title="Share screen"
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* Hangup button (Red) */}
        <button
          onClick={handleHangup}
          className="p-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform hover:scale-105 shadow-lg"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
