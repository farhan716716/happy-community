import React from 'react';
import { Archive, Lock, MessageSquare } from 'lucide-react';
import { Contact, Message, UserStatus } from '../../types/whatsapp';
import { ChatItem } from './ChatItem';

interface ChatListProps {
  contacts: Contact[];
  messages: Record<string, Message[]>;
  activeContactId: string | null;
  onSelectContact: (contact: Contact) => void;
  onTogglePin: (contactId: string) => void;
  onToggleMute: (contactId: string) => void;
  onDeleteChat: (contactId: string) => void;
  statuses: UserStatus[];
  onOpenStory: (contactId: string) => void;
  onOpenNewChat: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  contacts,
  messages,
  activeContactId,
  onSelectContact,
  onTogglePin,
  onToggleMute,
  onDeleteChat,
  statuses,
  onOpenStory,
  onOpenNewChat,
}) => {
  // Sort contacts: pinned first, then by last message timestamp
  const sortedContacts = [...contacts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#111b21] divide-y-0">
      {/* Archived Chats Header row (WhatsApp Web standard) */}
      <button 
        onClick={() => alert("Archived chats: No chats currently archived.")}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] border-b border-[#e9edef]/50 dark:border-[#222e35]/50 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <Archive className="w-5 h-5 text-[#00a884]" />
          <span className="text-[14px] font-medium text-[#111b21] dark:text-[#e9edef]">
            Archived
          </span>
        </div>
        <span className="text-xs text-[#8696a0]">0</span>
      </button>

      {/* Contact List */}
      {sortedContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-[#667781] dark:text-[#8696a0] h-64">
          <MessageSquare className="w-10 h-10 mb-3 text-[#8696a0]/50" />
          <p className="text-sm font-medium text-[#111b21] dark:text-[#d1d7db]">No chats found</p>
          <p className="text-xs mt-1 max-w-[220px]">
            Start a new conversation by searching for any unique @username.
          </p>
          <button
            onClick={onOpenNewChat}
            className="mt-4 px-4 py-1.5 bg-[#00a884] text-white text-xs font-medium rounded-full shadow hover:bg-[#008f6f] transition-all"
          >
            Find by @username
          </button>
        </div>
      ) : (
        sortedContacts.map((contact) => {
          const chatMsgs = messages[contact.id] || [];
          const lastMsg = chatMsgs[chatMsgs.length - 1];
          const hasStory = statuses.some(s => s.userId === contact.id && s.items.length > 0 && !s.allViewed);

          return (
            <ChatItem
              key={contact.id}
              contact={contact}
              lastMessage={lastMsg}
              isActive={activeContactId === contact.id}
              onSelect={() => onSelectContact(contact)}
              onTogglePin={onTogglePin}
              onToggleMute={onToggleMute}
              onDeleteChat={onDeleteChat}
              hasStatusStory={hasStory}
              onOpenStory={onOpenStory}
            />
          );
        })
      )}

      {/* End of list privacy notice */}
      <div className="p-4 text-center border-t border-[#e9edef]/40 dark:border-[#222e35]/40 text-[#8696a0] text-[11px] flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3 text-[#8696a0]" />
        <span>Your personal messages are end-to-end encrypted with unique @usernames</span>
      </div>
    </div>
  );
};
