import React, { useState, useRef, useEffect } from 'react';
import { Check, CheckCheck, Pin, VolumeX, ChevronDown, Trash2, BellOff, Bookmark } from 'lucide-react';
import { Contact, Message } from '../../types/whatsapp';

interface ChatItemProps {
  contact: Contact;
  lastMessage?: Message;
  isActive: boolean;
  onSelect: () => void;
  onTogglePin?: (contactId: string) => void;
  onToggleMute?: (contactId: string) => void;
  onDeleteChat?: (contactId: string) => void;
  hasStatusStory?: boolean;
  onOpenStory?: (contactId: string) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  contact,
  lastMessage,
  isActive,
  onSelect,
  onTogglePin,
  onToggleMute,
  onDeleteChat,
  hasStatusStory,
  onOpenStory,
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

  const renderStatusTicks = () => {
    if (!lastMessage || !lastMessage.isOutgoing) return null;
    if (lastMessage.status === 'read') {
      return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0 inline mr-1" />;
    }
    if (lastMessage.status === 'delivered') {
      return <CheckCheck className="w-3.5 h-3.5 text-[#8696a0] shrink-0 inline mr-1" />;
    }
    return <Check className="w-3.5 h-3.5 text-[#8696a0] shrink-0 inline mr-1" />;
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center gap-3 px-3 py-3 cursor-pointer select-none border-b border-[#e9edef]/60 dark:border-[#222e35]/60 transition-colors ${
        isActive
          ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
          : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] bg-white dark:bg-[#111b21]'
      }`}
    >
      {/* Avatar with optional WhatsApp Status ring */}
      <div 
        className="relative shrink-0"
        onClick={(e) => {
          if (hasStatusStory && onOpenStory) {
            e.stopPropagation();
            onOpenStory(contact.id);
          }
        }}
      >
        <div className={`p-0.5 rounded-full ${hasStatusStory ? 'ring-2 ring-[#00a884]' : ''}`}>
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-12 h-12 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        {contact.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] rounded-full border-2 border-white dark:border-[#111b21]" />
        )}
      </div>

      {/* Chat Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Row 1: Name and Timestamp */}
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-medium text-[15px] text-[#111b21] dark:text-[#e9edef] truncate">
              {contact.name}
            </span>
            {/* Unique Username shown instead of phone number */}
            <span className="text-[11px] font-mono text-[#00a884] dark:text-[#00a884] bg-[#00a884]/10 px-1.5 py-0.2 rounded font-medium shrink-0">
              {contact.username}
            </span>
          </div>

          <span className={`text-[12px] tabular-nums shrink-0 ml-2 ${
            contact.unreadCount > 0 ? 'text-[#00a884] font-medium' : 'text-[#667781] dark:text-[#8696a0]'
          }`}>
            {lastMessage ? lastMessage.timestamp : 'New'}
          </span>
        </div>

        {/* Row 2: Message preview and Indicators */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center text-[13px] text-[#667781] dark:text-[#8696a0] truncate">
            {contact.isTyping ? (
              <span className="text-[#00a884] font-medium animate-pulse">typing...</span>
            ) : (
              <>
                {renderStatusTicks()}
                <span className="truncate">
                  {lastMessage ? (
                    lastMessage.type === 'voice' ? (
                      '🎤 Voice note'
                    ) : lastMessage.type === 'image' ? (
                      '📷 Photo'
                    ) : lastMessage.type === 'doc' ? (
                      `📄 ${lastMessage.docName || 'Document'}`
                    ) : (
                      lastMessage.text
                    )
                  ) : (
                    <span className="italic text-[#8696a0]">Tap to chat with {contact.username}</span>
                  )}
                </span>
              </>
            )}
          </div>

          {/* Right badges: Pinned, Muted, Unread Count & Dropdown trigger */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {contact.isMuted && (
              <VolumeX className="w-3.5 h-3.5 text-[#8696a0]" />
            )}
            {contact.isPinned && (
              <Pin className="w-3.5 h-3.5 text-[#8696a0] rotate-45" />
            )}
            {contact.unreadCount > 0 && (
              <span className="min-w-[19px] h-[19px] px-1 bg-[#25d366] text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                {contact.unreadCount}
              </span>
            )}

            {/* Hover Chevron */}
            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1 hover:text-[#111b21] dark:hover:text-white"
              >
                <ChevronDown className="w-4 h-4 text-[#8696a0]" />
              </button>

              {menuOpen && (
                <div 
                  className="absolute right-0 top-6 w-44 bg-white dark:bg-[#233138] rounded shadow-lg py-1 z-30 border border-[#e9edef] dark:border-[#222e35] text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      onTogglePin?.(contact.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2 text-[#111b21] dark:text-[#d1d7db]"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{contact.isPinned ? 'Unpin chat' : 'Pin chat'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleMute?.(contact.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2 text-[#111b21] dark:text-[#d1d7db]"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                    <span>{contact.isMuted ? 'Unmute' : 'Mute notifications'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onDeleteChat?.(contact.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] flex items-center gap-2 text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete chat</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
