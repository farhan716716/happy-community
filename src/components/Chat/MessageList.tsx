import React, { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { Contact, Message } from '../../types/whatsapp';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  contact: Contact;
  messages: Message[];
  onReact: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onToggleStar: (messageId: string) => void;
  onImageClick?: (url: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  contact,
  messages,
  onReact,
  onDeleteMessage,
  onToggleStar,
  onImageClick,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-3 space-y-2 z-0 relative">
      {/* WhatsApp Encryption Notice Banner */}
      <div className="flex justify-center my-3">
        <div className="max-w-md bg-[#ffeecd] dark:bg-[#182229] border border-[#ffdda1] dark:border-[#222e35] text-[#54656f] dark:text-[#ffd279] rounded-lg px-3.5 py-2 text-center text-[12px] leading-relaxed shadow-xs flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0 text-[#8696a0] dark:text-[#ffd279]" />
          <span>
            Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Verified by unique <strong>{contact.username}</strong> handle.
          </span>
        </div>
      </div>

      {/* Date badge */}
      <div className="flex justify-center my-3">
        <span className="bg-white/90 dark:bg-[#182229]/90 text-[#54656f] dark:text-[#8696a0] text-[11px] font-medium uppercase px-3 py-1 rounded-md shadow-xs border border-[#e9edef]/40 dark:border-[#222e35]/40 select-none">
          Today
        </span>
      </div>

      {/* Render messages */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isGroup={contact.isGroup}
          onReact={onReact}
          onDeleteMessage={onDeleteMessage}
          onToggleStar={onToggleStar}
          onImageClick={onImageClick}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};
