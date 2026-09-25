import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Check, 
  Moon, 
  Sun, 
  Bell, 
  Lock, 
  HelpCircle, 
  AtSign, 
  AlertCircle 
} from 'lucide-react';
import { CurrentUser } from '../../types/whatsapp';

interface SettingsDrawerProps {
  currentUser: CurrentUser;
  onUpdateProfile: (updated: Partial<CurrentUser>) => void;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  currentUser,
  onUpdateProfile,
  onClose,
  theme,
  onToggleTheme,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(currentUser.name);

  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState(currentUser.username);
  const [usernameError, setUsernameError] = useState('');

  const [editingAbout, setEditingAbout] = useState(false);
  const [about, setAbout] = useState(currentUser.about);

  const handleSaveName = () => {
    if (name.trim()) {
      onUpdateProfile({ name: name.trim() });
      setEditingName(false);
    }
  };

  const handleSaveUsername = () => {
    const cleanUsername = username.startsWith('@')
      ? username.trim().toLowerCase()
      : `@${username.trim().toLowerCase()}`;

    if (!/^@[a-zA-Z0-9_.]+$/.test(cleanUsername) || cleanUsername.length < 3) {
      setUsernameError('Username must be at least 3 chars (letters, numbers, underscores).');
      return;
    }

    setUsernameError('');
    onUpdateProfile({ username: cleanUsername });
    setEditingUsername(false);
  };

  const handleSaveAbout = () => {
    onUpdateProfile({ about: about.trim() });
    setEditingAbout(false);
  };

  return (
    <div className="absolute inset-0 bg-[#f0f2f5] dark:bg-[#111b21] z-30 flex flex-col select-none animate-in slide-in-from-left duration-200 overflow-y-auto">
      {/* Green Header */}
      <div className="h-28 bg-[#008069] dark:bg-[#202c33] text-white px-4 flex flex-col justify-end pb-3 shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-xl font-medium">Profile & Settings</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 pb-8">
        {/* Profile Avatar Card */}
        <div className="bg-white dark:bg-[#202c33] py-6 flex flex-col items-center shadow-xs">
          <div className="relative group cursor-pointer">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-36 h-36 rounded-full object-cover shadow-sm border-2 border-[#00a884]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-xs font-medium">
              <span>Change Photo</span>
            </div>
          </div>
        </div>

        {/* Display Name Section */}
        <div className="bg-white dark:bg-[#202c33] px-6 py-4 shadow-xs">
          <p className="text-xs font-semibold text-[#00a884] uppercase tracking-wider mb-2">
            Your name
          </p>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-base bg-transparent text-[#111b21] dark:text-[#e9edef] border-b-2 border-[#00a884] pb-1 focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-1 text-[#00a884] hover:text-[#008f6f]"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-base text-[#111b21] dark:text-[#e9edef]">
                {currentUser.name}
              </p>
              <button
                onClick={() => setEditingName(true)}
                className="text-[#8696a0] hover:text-[#00a884]"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-[11px] text-[#8696a0] mt-2">
            This is not your username. This name will be visible to your WhatsApp contacts.
          </p>
        </div>

        {/* Unique Username Section (Key Feature: replaces phone number!) */}
        <div className="bg-white dark:bg-[#202c33] px-6 py-4 shadow-xs">
          <p className="text-xs font-semibold text-[#00a884] uppercase tracking-wider mb-2">
            Unique Username (Replaces Phone Number)
          </p>
          {editingUsername ? (
            <div className="space-y-2">
              <div className="relative flex items-center">
                <AtSign className="w-4 h-4 text-[#8696a0] absolute left-2 pointer-events-none" />
                <input
                  type="text"
                  value={username.replace(/^@/, '')}
                  onChange={(e) => {
                    setUsernameError('');
                    setUsername(`@${e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '')}`);
                  }}
                  className="w-full text-base font-mono pl-7 bg-transparent text-[#00a884] border-b-2 border-[#00a884] pb-1 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveUsername}
                  className="p-1 text-[#00a884] hover:text-[#008f6f] ml-2"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
              {usernameError && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{usernameError}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-mono text-base font-semibold text-[#00a884]">
                  {currentUser.username}
                </p>
                <span className="text-[10px] bg-[#00a884]/15 text-[#00a884] px-1.5 py-0.5 rounded font-medium">
                  Verified Unique
                </span>
              </div>
              <button
                onClick={() => setEditingUsername(true)}
                className="text-[#8696a0] hover:text-[#00a884]"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-[11px] text-[#8696a0] mt-2 leading-relaxed">
            People can search, message, and call you using this unique @username. Your personal telephone number is never shared or displayed.
          </p>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-[#202c33] px-6 py-4 shadow-xs">
          <p className="text-xs font-semibold text-[#00a884] uppercase tracking-wider mb-2">
            About
          </p>
          {editingAbout ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full text-sm bg-transparent text-[#111b21] dark:text-[#e9edef] border-b-2 border-[#00a884] pb-1 focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveAbout}
                className="p-1 text-[#00a884] hover:text-[#008f6f]"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#111b21] dark:text-[#e9edef]">
                {currentUser.about}
              </p>
              <button
                onClick={() => setEditingAbout(true)}
                className="text-[#8696a0] hover:text-[#00a884]"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-[#202c33] px-6 py-3 shadow-xs">
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between text-left py-2"
          >
            <div className="flex items-center gap-4">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-[#00a884]" />
              ) : (
                <Sun className="w-5 h-5 text-[#eab308]" />
              )}
              <div>
                <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                  Theme
                </p>
                <p className="text-xs text-[#8696a0]">
                  {theme === 'dark' ? 'Dark theme (Active)' : 'Light theme (Active)'}
                </p>
              </div>
            </div>
            <span className="text-xs text-[#00a884] font-medium">Switch</span>
          </button>
        </div>

        {/* Notifications & Privacy */}
        <div className="bg-white dark:bg-[#202c33] px-6 py-3 shadow-xs space-y-2">
          <div className="flex items-center gap-4 py-2 border-b border-[#e9edef]/60 dark:border-[#222e35]/60">
            <Bell className="w-5 h-5 text-[#8696a0]" />
            <div>
              <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                Notifications
              </p>
              <p className="text-xs text-[#8696a0]">
                Sounds, reaction alerts, incoming chime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-2 border-b border-[#e9edef]/60 dark:border-[#222e35]/60">
            <Lock className="w-5 h-5 text-[#8696a0]" />
            <div>
              <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                Privacy & Encryption
              </p>
              <p className="text-xs text-[#8696a0]">
                All chats bound to public keys of unique usernames
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <HelpCircle className="w-5 h-5 text-[#8696a0]" />
            <div>
              <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                Help
              </p>
              <p className="text-xs text-[#8696a0]">
                WhatsApp Web (Username Edition) v2.26
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
