import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  ArrowLeft, 
  UserCheck, 
  BellOff, 
  Trash2, 
  XSquare,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Contact } from '../../types/whatsapp';

interface ChatHeaderProps {
  contact: Contact;
  onOpenInfo: () => void;
  onStartVoiceCall: (contact: Contact) => void;
  onStartVideoCall: (contact: Contact) => void;
  onSearchChat: () => void;
  onClearChat: () => void;
  onDeleteChat: () => void;
  onBackMobile: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  contact,
  onOpenInfo,
  onStartVoiceCall,
  onStartVideoCall,
  onSearchChat,
  onClearChat,
  onDeleteChat,
  onBackMobile,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-16 px-4 flex items-center justify-between bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222e35] select-none transition-colors shrink-0 z-10">
      {/* Contact Profile & @username preview */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={onBackMobile}
          className="md:hidden p-1.5 -ml-1 text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-white rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
          onClick={onOpenInfo}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
          title="Click for contact info"
        >
          <div className="relative shrink-0">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover group-hover:opacity-90 transition-opacity"
              referrerPolicy="no-referrer"
            />
            {contact.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] rounded-full border-2 border-[#f0f2f5] dark:border-[#202c33]" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[15px] text-[#111b21] dark:text-[#e9edef] truncate">
                {contact.name}
              </span>
              {/* Unique Username shown prominently */}
              <span className="text-[11px] font-mono text-[#00a884] dark:text-[#00a884] font-semibold bg-[#00a884]/10 dark:bg-[#00a884]/15 px-1.5 py-0.5 rounded shrink-0">
                {contact.username}
              </span>
            </div>

            <span className="text-[12px] truncate">
              {contact.isTyping ? (
                <span className="text-[#00a884] font-medium animate-pulse">typing...</span>
              ) : contact.isOnline ? (
                <span className="text-[#00a884] font-medium">online</span>
              ) : (
                <span className="text-[#667781] dark:text-[#8696a0]">
                  {contact.lastSeen ? `last seen ${contact.lastSeen}` : 'offline'}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons on the right */}
      <div className="flex items-center gap-1 sm:gap-2 text-[#54656f] dark:text-[#aebac1]">
        {/* Video Call */}
        <button
          onClick={() => onStartVideoCall(contact)}
          className="p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors"
          title={`Video call with ${contact.username}`}
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Voice Call */}
        <button
          onClick={() => onStartVoiceCall(contact)}
          className="p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors"
          title={`Voice call with ${contact.username}`}
        >
          <Phone className="w-4.5 h-4.5" />
        </button>

        {/* Search in chat */}
        <button
          onClick={onSearchChat}
          className="p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors"
          title="Search in chat"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* 3-dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors"
            title="Chat options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-[#233138] rounded shadow-xl py-2 z-50 border border-[#e9edef] dark:border-[#222e35] text-sm animate-in fade-in duration-100">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenInfo();
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                <UserCheck className="w-4 h-4 text-[#8696a0]" />
                <span>Contact info</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  alert(`Encryption verified with ${contact.username}'s public key.`);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                <ShieldCheck className="w-4 h-4 text-[#00a884]" />
                <span>Verify @username key</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  alert("Disappearing messages: Messages sent to this username will stay forever unless configured.");
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                <Clock className="w-4 h-4 text-[#8696a0]" />
                <span>Disappearing messages</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  alert(`Notifications for ${contact.username} muted.`);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                <BellOff className="w-4 h-4 text-[#8696a0]" />
                <span>Mute notifications</span>
              </button>

              <div className="my-1 border-t border-[#e9edef] dark:border-[#222e35]" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onClearChat();
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                <XSquare className="w-4 h-4 text-[#8696a0]" />
                <span>Clear messages</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteChat();
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-rose-500 flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete chat</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
