import React from 'react';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { Message, Contact } from '../../types/whatsapp';

interface StarredMessagesDrawerProps {
  messages: Record<string, Message[]>;
  contacts: Contact[];
  onClose: () => void;
  onSelectChat: (contactId: string) => void;
}

export const StarredMessagesDrawer: React.FC<StarredMessagesDrawerProps> = ({
  messages,
  contacts,
  onClose,
  onSelectChat,
}) => {
  const starredList: { msg: Message; contact: Contact }[] = [];

  Object.entries(messages).forEach(([chatId, msgs]) => {
    const contact = contacts.find(c => c.id === chatId);
    if (contact) {
      msgs.forEach(m => {
        if (m.isStarred) {
          starredList.push({ msg: m, contact });
        }
      });
    }
  });

  return (
    <div className="absolute inset-0 bg-white dark:bg-[#111b21] z-30 flex flex-col select-none animate-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="h-28 bg-[#008069] dark:bg-[#202c33] text-white px-4 flex flex-col justify-end pb-3 shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-xl font-medium">Starred messages</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {starredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#8696a0] text-center">
            <Star className="w-12 h-12 mb-3 text-[#8696a0]/40" />
            <p className="text-sm font-medium text-[#111b21] dark:text-[#d1d7db]">
              No starred messages
            </p>
            <p className="text-xs mt-1 max-w-[240px]">
              Tap and star any message from your unique @username chats to keep it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {starredList.map(({ msg, contact }) => (
              <div
                key={msg.id}
                onClick={() => {
                  onSelectChat(contact.id);
                  onClose();
                }}
                className="p-3 bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg cursor-pointer hover:ring-1 hover:ring-[#00a884] transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#111b21] dark:text-[#e9edef]">
                      {contact.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#00a884]">
                      {contact.username}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8696a0]">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-[#54656f] dark:text-[#d1d7db] line-clamp-2">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
