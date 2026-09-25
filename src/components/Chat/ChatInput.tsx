import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  Image as ImageIcon, 
  FileText, 
  Camera, 
  UserCheck, 
  BarChart2, 
  Trash2, 
  Check,
  X
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendVoiceNote: (duration: number) => void;
  onSendImage: (imageUrl: string, caption?: string) => void;
  onSendDoc: (docName: string, docSize: string) => void;
}

const EMOJI_CATEGORIES = [
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'] },
  { name: 'Gestures', emojis: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪'] },
  { name: 'Hearts', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🔥', '✨', '⭐', '🌟', '💥', '💫'] },
  { name: 'Activities', emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🥊', '🥋', '🎯', '🎮', '🎲', '🧩', '🎨', '🎬', '🎤', '🎧', '🎸', '🎹'] }
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendVoiceNote,
  onSendImage,
  onSendDoc,
}) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const recordIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
        setShowAttachmentMenu(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      recordIntervalRef.current = window.setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [isRecording]);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleFinishVoiceRecord = () => {
    const finalDuration = Math.max(recordSeconds, 2);
    setIsRecording(false);
    onSendVoiceNote(finalDuration);
  };

  const handleCancelVoiceRecord = () => {
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const handleSampleImage = (type: string) => {
    setShowAttachmentMenu(false);
    if (type === 'design') {
      onSendImage(
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        'Here is the verified mockup concept! 🚀'
      );
    } else {
      onSendImage(
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
        'Coding sprint setup today! 💻'
      );
    }
  };

  const handleSampleDoc = () => {
    setShowAttachmentMenu(false);
    onSendDoc('Username_Architecture_Protocol_v2.pdf', '3.8 MB');
  };

  return (
    <div className="relative bg-[#f0f2f5] dark:bg-[#202c33] px-3 py-2 border-t border-[#e9edef] dark:border-[#222e35] transition-colors shrink-0">
      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div
          ref={emojiRef}
          className="absolute bottom-16 left-3 w-80 sm:w-96 h-80 bg-white dark:bg-[#233138] rounded-xl shadow-2xl border border-[#e9edef] dark:border-[#222e35] p-3 z-50 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#e9edef] dark:border-[#222e35]">
            <span className="text-xs font-semibold text-[#111b21] dark:text-[#e9edef]">
              WhatsApp Emojis
            </span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-2 space-y-3">
            {EMOJI_CATEGORIES.map((cat) => (
              <div key={cat.name}>
                <p className="text-[11px] font-semibold text-[#8696a0] uppercase mb-1">
                  {cat.name}
                </p>
                <div className="grid grid-cols-8 gap-1">
                  {cat.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setText((prev) => prev + emoji);
                        textareaRef.current?.focus();
                      }}
                      className="w-8 h-8 flex items-center justify-center text-lg hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Menu Popup */}
      {showAttachmentMenu && (
        <div
          ref={attachmentRef}
          className="absolute bottom-16 left-12 w-56 bg-white dark:bg-[#233138] rounded-xl shadow-2xl border border-[#e9edef] dark:border-[#222e35] p-2 z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-150 text-xs"
        >
          <button
            onClick={() => handleSampleImage('design')}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#e9edef] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="font-medium">Photos & Videos</span>
          </button>

          <button
            onClick={handleSampleDoc}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#e9edef] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-medium">Document</span>
          </button>

          <button
            onClick={() => handleSampleImage('camera')}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#e9edef] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-medium">Camera Snapshot</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentMenu(false);
              alert("Share Contact: Select any verified @username to share directly in chat.");
            }}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#e9edef] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="font-medium">Contact (@username)</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentMenu(false);
              alert("Poll: Create a poll among username participants.");
            }}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#e9edef] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span className="font-medium">Poll</span>
          </button>
        </div>
      )}

      {/* Input or Voice Recording Bar */}
      {isRecording ? (
        /* Active Voice Recording UI */
        <div className="flex items-center justify-between py-1 px-3 bg-white dark:bg-[#2a3942] rounded-lg shadow-inner">
          <div className="flex items-center gap-3">
            {/* Blinking red mic dot */}
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-semibold text-rose-500 tabular-nums">
              0:{recordSeconds.toString().padStart(2, '0')}
            </span>

            {/* Pulsing audio wave bars */}
            <div className="flex items-center gap-1 ml-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  className="w-1 bg-[#00a884] rounded-full recording-bar"
                />
              ))}
            </div>

            <span className="text-xs text-[#8696a0] ml-3 hidden sm:inline">
              Recording voice note for this username...
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelVoiceRecord}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors"
              title="Cancel recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleFinishVoiceRecord}
              className="p-2 bg-[#00a884] text-white hover:bg-[#008f6f] rounded-full transition-colors shadow-xs"
              title="Send voice note"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Regular Message Typing UI */
        <div className="flex items-end gap-2">
          {/* Emoji toggle */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-white rounded-full transition-colors"
            title="Emoji"
          >
            <Smile className="w-6 h-6" />
          </button>

          {/* Attachment toggle */}
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2 text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-white rounded-full transition-colors"
            title="Attach"
          >
            <Paperclip className="w-5 h-5 rotate-45" />
          </button>

          {/* Input text box */}
          <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg px-4 py-2 shadow-xs focus-within:ring-1 focus-within:ring-[#00a884]">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type a message (or mention @username)"
              className="w-full bg-transparent text-[14.5px] text-[#111b21] dark:text-[#d1d7db] placeholder-[#54656f] dark:placeholder-[#8696a0] focus:outline-none resize-none max-h-32 leading-5"
            />
          </div>

          {/* Mic (when text empty) or Send button (when text present) */}
          {text.trim().length > 0 ? (
            <button
              onClick={handleSend}
              className="p-2.5 bg-[#00a884] text-white hover:bg-[#008f6f] rounded-full transition-colors shadow-xs shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4 fill-current ml-0.5" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(true)}
              className="p-2 text-[#54656f] dark:text-[#aebac1] hover:text-[#00a884] rounded-full transition-colors shrink-0"
              title="Record voice note"
            >
              <Mic className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
