import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  CheckCheck, 
  Play, 
  Pause, 
  FileText, 
  Download, 
  Smile, 
  MoreVertical, 
  Star, 
  Trash2, 
  Copy, 
  Reply,
  Mic
} from 'lucide-react';
import { Message } from '../../types/whatsapp';

interface MessageBubbleProps {
  message: Message;
  isGroup?: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onToggleStar: (messageId: string) => void;
  onImageClick?: (url: string) => void;
}

const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isGroup,
  onReact,
  onDeleteMessage,
  onToggleStar,
  onImageClick,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const audioTimerRef = useRef<number | null>(null);

  // Simulated Voice Note playback
  const duration = message.audioDuration || 12;

  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const stepTime = 100 / playbackSpeed;
      audioTimerRef.current = window.setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            clearInterval(audioTimerRef.current!);
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + (100 / (duration * 10));
        });
      }, stepTime);
    }
  };

  useEffect(() => {
    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, []);

  const copyText = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setShowActionsMenu(false);
    }
  };

  const renderStatusTicks = () => {
    if (!message.isOutgoing) return null;
    if (message.status === 'read') {
      return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />;
    }
    return <Check className="w-3.5 h-3.5 text-[#8696a0]" />;
  };

  const bubbleBg = message.isOutgoing
    ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef]'
    : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef]';

  return (
    <div
      className={`group relative flex mb-2 px-2 select-text ${
        message.isOutgoing ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Hover action bar (Reactions & Options) */}
      <div
        className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-20 ${
          message.isOutgoing ? 'right-full mr-1.5' : 'left-full ml-1.5'
        }`}
      >
        {/* Quick Reaction button */}
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="p-1.5 rounded-full bg-white dark:bg-[#202c33] text-[#54656f] dark:text-[#aebac1] hover:text-[#00a884] shadow-md border border-[#e9edef]/60 dark:border-[#222e35]"
            title="React"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          {showReactionPicker && (
            <div className="absolute top-8 left-0 flex items-center gap-1 bg-white dark:bg-[#233138] rounded-full p-1.5 shadow-xl border border-[#e9edef] dark:border-[#222e35] z-30">
              {COMMON_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji);
                    setShowReactionPicker(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center hover:scale-125 transition-transform text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="p-1.5 rounded-full bg-white dark:bg-[#202c33] text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-white shadow-md border border-[#e9edef]/60 dark:border-[#222e35]"
            title="Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showActionsMenu && (
            <div className="absolute top-8 right-0 w-36 bg-white dark:bg-[#233138] rounded shadow-xl py-1 z-30 border border-[#e9edef] dark:border-[#222e35] text-xs">
              <button
                onClick={copyText}
                className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => {
                  onToggleStar(message.id);
                  setShowActionsMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2"
              >
                <Star className="w-3.5 h-3.5" />
                <span>{message.isStarred ? 'Unstar' : 'Star message'}</span>
              </button>
              <button
                onClick={() => {
                  onDeleteMessage(message.id);
                  setShowActionsMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-rose-500 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete message</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] rounded-lg px-3 py-1.5 shadow-xs ${bubbleBg} ${
          message.isOutgoing
            ? 'rounded-tr-none'
            : 'rounded-tl-none'
        }`}
      >
        {/* Group Sender info: Name and Unique Username */}
        {isGroup && !message.isOutgoing && (
          <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-black/5 dark:border-white/5">
            <span className="text-[12px] font-semibold text-[#00a884] dark:text-[#53bdeb] truncate">
              {message.senderName}
            </span>
            <span className="text-[10px] font-mono text-[#8696a0] truncate">
              {message.senderUsername}
            </span>
          </div>
        )}

        {/* Message Content by Type */}
        {message.type === 'voice' ? (
          /* Voice Note Player */
          <div className="flex items-center gap-3 py-1 min-w-[240px]">
            <div className="relative">
              <button
                onClick={toggleAudio}
                className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:bg-[#008f6f] transition-all shadow-xs"
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#202c33] dark:bg-[#111b21] rounded-full flex items-center justify-center text-[#00a884]">
                <Mic className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-0.5 h-6 cursor-pointer">
                {Array.from({ length: 24 }).map((_, idx) => {
                  const percent = (idx / 24) * 100;
                  const isPassed = percent <= audioProgress;
                  // pseudorandom bar heights
                  const barHeight = 6 + ((idx * 7) % 16);
                  return (
                    <span
                      key={idx}
                      style={{ height: `${barHeight}px` }}
                      className={`w-1 rounded-full transition-colors ${
                        isPassed
                          ? 'bg-[#00a884]'
                          : 'bg-[#8696a0]/40 dark:bg-[#8696a0]/50'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#667781] dark:text-[#8696a0] mt-0.5">
                <span>
                  {isPlayingAudio
                    ? `0:${Math.floor((audioProgress / 100) * duration).toString().padStart(2, '0')}`
                    : `0:${duration.toString().padStart(2, '0')}`}
                </span>

                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                  className="px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[10px] font-semibold"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>
          </div>
        ) : message.type === 'image' && message.mediaUrl ? (
          /* Photo Attachment */
          <div className="mb-1 rounded overflow-hidden">
            <img
              src={message.mediaUrl}
              alt="Shared attachment"
              className="max-h-72 w-full object-cover rounded cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick?.(message.mediaUrl!)}
              referrerPolicy="no-referrer"
            />
            {message.text && (
              <p className="mt-1.5 text-[14px] leading-relaxed break-words whitespace-pre-wrap">
                {message.text}
              </p>
            )}
          </div>
        ) : message.type === 'doc' ? (
          /* Document Attachment */
          <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-black/20 rounded-md mb-1 min-w-[200px]">
            <div className="w-10 h-10 rounded bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                {message.docName || 'Document.pdf'}
              </p>
              <p className="text-[11px] text-[#8696a0]">
                {message.docSize || '1.8 MB'}
              </p>
            </div>
            <button 
              onClick={() => alert(`Downloading document: ${message.docName}`)}
              className="p-1.5 text-[#54656f] dark:text-[#aebac1] hover:text-[#00a884] rounded-full"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Standard Text Message */
          <p className="text-[14.2px] leading-[19px] break-words whitespace-pre-wrap">
            {message.text}
          </p>
        )}

        {/* Message Footer: Timestamp, Star, Delivery Tick */}
        <div className="flex items-center justify-end gap-1 mt-0.5 ml-3 float-right select-none">
          {message.isStarred && (
            <Star className="w-3 h-3 text-[#eab308] fill-current mr-0.5" />
          )}

          <span className="text-[11px] text-[#667781] dark:text-[#8696a0]/90 tabular-nums">
            {message.timestamp}
          </span>

          {renderStatusTicks()}
        </div>

        {/* Active Emoji Reactions Strip */}
        {message.reactions && message.reactions.length > 0 && (
          <div
            className={`absolute -bottom-2.5 flex items-center gap-0.5 bg-white dark:bg-[#202c33] rounded-full px-1.5 py-0.5 shadow-sm border border-[#e9edef] dark:border-[#222e35] cursor-pointer hover:scale-105 transition-transform z-10 ${
              message.isOutgoing ? 'right-2' : 'left-2'
            }`}
            title={`Reactions: ${message.reactions.map(r => `${r.emoji} by ${r.users.join(', ')}`).join(' | ')}`}
          >
            {message.reactions.map((r, i) => (
              <span key={i} className="text-xs">
                {r.emoji} {r.count > 1 ? r.count : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
