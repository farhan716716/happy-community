import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  Bell, 
  Clock, 
  Star, 
  Ban, 
  ThumbsDown, 
  UserPlus, 
  QrCode,
  Image as ImageIcon
} from 'lucide-react';
import { Contact } from '../../types/whatsapp';

interface ContactInfoDrawerProps {
  contact: Contact;
  onClose: () => void;
  onBlockContact: (contactId: string) => void;
  onAddGroupMember?: (username: string) => void;
  onOpenQRCodeForUser?: (username: string) => void;
}

export const ContactInfoDrawer: React.FC<ContactInfoDrawerProps> = ({
  contact,
  onClose,
  onBlockContact,
  onAddGroupMember,
  onOpenQRCodeForUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [showAddMemberInput, setShowAddMemberInput] = useState(false);

  const copyUsername = () => {
    navigator.clipboard.writeText(contact.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberUsername.trim()) return;
    const cleanUsername = newMemberUsername.startsWith('@') 
      ? newMemberUsername.trim() 
      : `@${newMemberUsername.trim()}`;
    onAddGroupMember?.(cleanUsername);
    setNewMemberUsername('');
    setShowAddMemberInput(false);
  };

  return (
    <div className="w-80 sm:w-96 h-full bg-[#f0f2f5] dark:bg-[#111b21] border-l border-[#e9edef] dark:border-[#222e35] flex flex-col z-20 transition-all select-none overflow-y-auto">
      {/* Header */}
      <div className="h-16 px-4 bg-white dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222e35] flex items-center gap-6 shrink-0">
        <button
          onClick={onClose}
          className="text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-white"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="font-semibold text-[16px] text-[#111b21] dark:text-[#e9edef]">
          {contact.isGroup ? 'Group info' : 'Contact info'}
        </span>
      </div>

      <div className="space-y-2.5 pb-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#202c33] py-6 px-4 flex flex-col items-center shadow-xs">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-36 h-36 rounded-full object-cover shadow-sm mb-4 border-2 border-[#00a884]"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-xl font-medium text-[#111b21] dark:text-[#e9edef] text-center">
            {contact.name}
          </h2>

          {/* Primary Unique Username Identifier (Replaces phone number completely) */}
          <div className="mt-1 flex items-center gap-1.5 bg-[#00a884]/10 dark:bg-[#00a884]/15 px-3 py-1 rounded-full border border-[#00a884]/20">
            <span className="font-mono text-sm font-semibold text-[#00a884]">
              {contact.username}
            </span>
            <button
              onClick={copyUsername}
              className="p-1 hover:text-[#008f6f] text-[#00a884] transition-colors"
              title="Copy unique username"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          
          <span className="text-[12px] text-[#667781] dark:text-[#8696a0] mt-1">
            {contact.isOnline ? 'Online' : contact.lastSeen ? `Last seen ${contact.lastSeen}` : 'Offline'}
          </span>
        </div>

        {/* Username Details Card (Replaces traditional Phone Number section) */}
        <div className="bg-white dark:bg-[#202c33] p-4 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#00a884] uppercase tracking-wider">
            Unique Username (No Phone Number)
          </span>
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-mono text-base font-medium text-[#111b21] dark:text-[#e9edef]">
                {contact.username}
              </p>
              <p className="text-[11px] text-[#8696a0]">
                Verified unique ID · No phone number required
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={copyUsername}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#00a884]"
                title="Copy username"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onOpenQRCodeForUser?.(contact.username)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#54656f] dark:text-[#aebac1]"
                title="View QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* About / Bio Card */}
        <div className="bg-white dark:bg-[#202c33] p-4 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#667781] dark:text-[#8696a0] uppercase tracking-wider">
            About
          </span>
          <p className="text-sm text-[#111b21] dark:text-[#e9edef] leading-relaxed pt-1">
            {contact.about || 'Hey there! I am using WhatsApp with @username.'}
          </p>
        </div>

        {/* Group Participants Section (if group chat) */}
        {contact.isGroup && (
          <div className="bg-white dark:bg-[#202c33] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#667781] dark:text-[#8696a0] uppercase tracking-wider">
                {contact.groupMembers?.length || 0} participants (all @usernames)
              </span>
              <button
                onClick={() => setShowAddMemberInput(!showAddMemberInput)}
                className="text-xs text-[#00a884] font-medium hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add member</span>
              </button>
            </div>

            {/* Input to add member by @username */}
            {showAddMemberInput && (
              <form onSubmit={handleAddMember} className="flex items-center gap-2 p-2 bg-[#f0f2f5] dark:bg-[#111b21] rounded-lg">
                <input
                  type="text"
                  placeholder="Type @username to add..."
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#111b21] dark:text-[#d1d7db] focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-[#00a884] text-white text-xs font-medium rounded hover:bg-[#008f6f]"
                >
                  Add
                </button>
              </form>
            )}

            <div className="divide-y divide-[#e9edef]/60 dark:divide-[#222e35]/60 max-h-56 overflow-y-auto">
              {contact.groupMembers?.map((member) => (
                <div key={member.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                        {member.name}
                      </p>
                      <p className="font-mono text-xs text-[#00a884]">
                        {member.username}
                      </p>
                    </div>
                  </div>
                  {member.isAdmin && (
                    <span className="text-[10px] bg-[#00a884]/15 text-[#00a884] px-1.5 py-0.5 rounded font-medium">
                      Group Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media, Links & Docs Card */}
        <div className="bg-white dark:bg-[#202c33] p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667781] dark:text-[#8696a0] uppercase tracking-wider">
              Media, links and docs
            </span>
            <span className="text-xs text-[#00a884] font-medium cursor-pointer hover:underline">
              12 items
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <img
              src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80"
              alt="Media item"
              className="w-full h-20 object-cover rounded"
              referrerPolicy="no-referrer"
            />
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80"
              alt="Media item"
              className="w-full h-20 object-cover rounded"
              referrerPolicy="no-referrer"
            />
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80"
              alt="Media item"
              className="w-full h-20 object-cover rounded"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Security & Encryption Card */}
        <div className="bg-white dark:bg-[#202c33] p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00a884] shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                Encryption
              </p>
              <p className="text-xs text-[#8696a0] leading-snug">
                Messages and calls are end-to-end encrypted with {contact.username}'s keys.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-[#e9edef]/60 dark:border-[#222e35]/60">
            <Clock className="w-5 h-5 text-[#8696a0] shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                Disappearing messages
              </p>
              <p className="text-xs text-[#8696a0]">Off</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-[#e9edef]/60 dark:border-[#222e35]/60">
            <Bell className="w-5 h-5 text-[#8696a0] shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                Mute notifications
              </p>
              <p className="text-xs text-[#8696a0]">Unmuted</p>
            </div>
          </div>
        </div>

        {/* Block & Report Actions */}
        <div className="bg-white dark:bg-[#202c33] p-2 shadow-xs space-y-1">
          <button
            onClick={() => onBlockContact(contact.id)}
            className="w-full p-2.5 flex items-center gap-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition-colors text-sm font-medium"
          >
            <Ban className="w-4 h-4" />
            <span>Block {contact.username}</span>
          </button>

          <button
            onClick={() => alert(`Reported ${contact.username}. WhatsApp safety team will review.`)}
            className="w-full p-2.5 flex items-center gap-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition-colors text-sm font-medium"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>Report {contact.username}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
