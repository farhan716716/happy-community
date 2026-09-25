import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Users, UserPlus, AtSign, Check, AlertCircle, Globe, UserCheck } from 'lucide-react';
import { Contact } from '../../types/whatsapp';
import { fetchAllUsers } from '../../services/api';

interface NewChatModalProps {
  contacts: Contact[];
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
  onAddNewContact: (newContact: { name: string; username: string; about: string }) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  contacts,
  onClose,
  onSelectContact,
  onAddNewContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newAbout, setNewAbout] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Global registered users fetched from server
  const [globalUsers, setGlobalUsers] = useState<Contact[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoadingGlobal(true);
    fetchAllUsers(searchQuery).then((users) => {
      if (active) {
        setGlobalUsers(users);
        setIsLoadingGlobal(false);
      }
    });
    return () => {
      active = false;
    };
  }, [searchQuery]);

  // Combine or prioritize contacts vs other global users
  const myContactHandles = new Set(contacts.map(c => c.username.toLowerCase()));

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) {
      setErrorMsg('Please enter both a display name and unique @username.');
      return;
    }

    const cleanUsername = newUsername.startsWith('@')
      ? newUsername.trim().toLowerCase()
      : `@${newUsername.trim().toLowerCase()}`;

    // Validate alphanumeric and underscores
    if (!/^@[a-zA-Z0-9_.]+$/.test(cleanUsername)) {
      setErrorMsg('Username must only contain letters, numbers, periods or underscores.');
      return;
    }

    onAddNewContact({
      name: newName.trim(),
      username: cleanUsername,
      about: newAbout.trim() || 'Available on WhatsApp with unique username'
    });
    setShowAddForm(false);
  };

  return (
    <div className="absolute inset-0 bg-white dark:bg-[#111b21] z-30 flex flex-col animate-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="h-28 bg-[#008069] dark:bg-[#202c33] text-white px-4 flex flex-col justify-end pb-3">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
            title="Back to chats"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xl font-medium">New chat</span>
            <p className="text-xs text-white/80">Search anyone in the world by @username</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-white dark:bg-[#111b21] border-b border-[#e9edef] dark:border-[#222e35]">
        <div className="flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#00a884]">
          <Search className="w-4 h-4 text-[#54656f] dark:text-[#aebac1] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any user's unique @username worldwide..."
            className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#d1d7db] placeholder-[#54656f] dark:placeholder-[#8696a0] focus:outline-none"
            autoFocus
          />
        </div>
      </div>

      {/* Action items or Add Contact Form */}
      <div className="flex-1 overflow-y-auto">
        {!showAddForm ? (
          <>
            {/* Primary Action Buttons */}
            <div className="p-2 space-y-1 border-b border-[#e9edef]/60 dark:border-[#222e35]/60">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] rounded-lg text-left transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#111b21] dark:text-[#e9edef]">
                    Add new contact by @username
                  </p>
                  <p className="text-xs text-[#8696a0]">
                    Save anyone's handle to your contacts without phone numbers
                  </p>
                </div>
              </button>

              <button
                onClick={() => alert("New Group: Group participants will be identified by @username.")}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] rounded-lg text-left transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#111b21] dark:text-[#e9edef]">
                    New group
                  </p>
                  <p className="text-xs text-[#8696a0]">
                    Create a group with unique handles
                  </p>
                </div>
              </button>
            </div>

            {/* Global Directory list */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-[#00a884] uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Global Users Directory ({globalUsers.length})</span>
                </p>
                {isLoadingGlobal && (
                  <span className="text-[10px] text-[#8696a0] animate-pulse">Syncing...</span>
                )}
              </div>

              <div className="divide-y divide-[#e9edef]/40 dark:divide-[#222e35]/40">
                {globalUsers.map((user) => {
                  const isAlreadyContact = myContactHandles.has(user.username.toLowerCase());
                  return (
                    <div
                      key={user.id || user.username}
                      onClick={() => onSelectContact(user)}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-11 h-11 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                            {user.name}
                          </p>
                          <p className="font-mono text-xs text-[#00a884]">
                            {user.username}
                          </p>
                          <p className="text-[11px] text-[#8696a0] truncate mt-0.5">
                            {user.about || 'Available on WhatsApp'}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isAlreadyContact ? (
                          <span className="text-[11px] text-[#8696a0] flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-[#00a884]" /> Saved
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddNewContact({
                                name: user.name,
                                username: user.username,
                                about: user.about || '',
                              });
                            }}
                            className="px-2.5 py-1 bg-[#00a884]/15 hover:bg-[#00a884] hover:text-white text-[#00a884] rounded-md text-xs font-medium transition-colors"
                          >
                            + Add Contact
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Add Contact Form */
          <div className="p-4 max-w-md mx-auto">
            <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-4 rounded-xl border border-[#e9edef] dark:border-[#222e35]">
              <h3 className="text-base font-semibold text-[#111b21] dark:text-[#e9edef] mb-1">
                Save Person by Unique @username
              </h3>
              <p className="text-xs text-[#8696a0] mb-4">
                No mobile phone number needed. Just type their registered unique handle.
              </p>

              {errorMsg && (
                <div className="mb-3 p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateContact} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#54656f] dark:text-[#aebac1] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan Tariq"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111b21] text-[#111b21] dark:text-[#e9edef] border border-[#e9edef] dark:border-[#222e35] rounded-lg focus:outline-none focus:border-[#00a884]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#54656f] dark:text-[#aebac1] mb-1">
                    Unique Username
                  </label>
                  <div className="relative flex items-center">
                    <AtSign className="w-4 h-4 text-[#8696a0] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="farhan_tariq"
                      value={newUsername.replace(/^@/, '')}
                      onChange={(e) => {
                        setErrorMsg('');
                        setNewUsername(`@${e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '')}`);
                      }}
                      className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-white dark:bg-[#111b21] text-[#00a884] border border-[#e9edef] dark:border-[#222e35] rounded-lg focus:outline-none focus:border-[#00a884]"
                    />
                  </div>
                  <p className="text-[10px] text-[#8696a0] mt-1">
                    Unique identifier used to message & call on WhatsApp Web.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#54656f] dark:text-[#aebac1] mb-1">
                    About / Bio (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Available on WhatsApp"
                    value={newAbout}
                    onChange={(e) => setNewAbout(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111b21] text-[#111b21] dark:text-[#e9edef] border border-[#e9edef] dark:border-[#222e35] rounded-lg focus:outline-none focus:border-[#00a884]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-xs font-medium text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00a884] text-white text-xs font-medium rounded-lg hover:bg-[#008f6f] flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Contact</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
