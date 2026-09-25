import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  CircleDashed, 
  MessageSquarePlus, 
  MoreVertical, 
  Moon, 
  Sun, 
  QrCode, 
  Settings, 
  Star, 
  LogOut,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { CurrentUser } from '../../types/whatsapp';

interface SidebarHeaderProps {
  currentUser: CurrentUser;
  onOpenProfile: () => void;
  onOpenStatus: () => void;
  onOpenNewChat: () => void;
  onOpenCalls: () => void;
  onOpenQRCode: () => void;
  onOpenSettings: () => void;
  onOpenStarred: () => void;
  onSwitchUser: () => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  hasUnreadStatus: boolean;
  activeTab: 'chats' | 'status' | 'calls';
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  currentUser,
  onOpenProfile,
  onOpenStatus,
  onOpenNewChat,
  onOpenCalls,
  onOpenQRCode,
  onOpenSettings,
  onOpenStarred,
  onSwitchUser,
  onLogout,
  theme,
  onToggleTheme,
  hasUnreadStatus,
  activeTab,
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
    <div className="h-16 px-4 flex items-center justify-between bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222e35] select-none transition-colors">
      {/* Current User Avatar & Username badge */}
      <button 
        onClick={onOpenProfile}
        className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        title={`Profile: ${currentUser.name} (${currentUser.username})`}
      >
        <div className="relative">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full object-cover border border-transparent group-hover:border-[#00a884] transition-all"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#25d366] rounded-full border-2 border-[#f0f2f5] dark:border-[#202c33]" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-[#111b21] dark:text-[#e9edef] truncate max-w-[110px]">
            {currentUser.name}
          </span>
          <span className="text-[11px] font-mono text-[#00a884] dark:text-[#00a884] font-medium truncate max-w-[110px]">
            {currentUser.username}
          </span>
        </div>
      </button>

      {/* Header Action Icons */}
      <div className="flex items-center gap-1 text-[#54656f] dark:text-[#aebac1]">
        {/* Calls Tab Button */}
        <button
          onClick={onOpenCalls}
          className={`p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors ${
            activeTab === 'calls' ? 'text-[#00a884]' : ''
          }`}
          title="Calls by Username"
        >
          <PhoneCall className="w-5 h-5" />
        </button>

        {/* Status / Stories Button */}
        <button
          onClick={onOpenStatus}
          className={`p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors relative ${
            activeTab === 'status' ? 'text-[#00a884]' : ''
          }`}
          title="Status Updates"
        >
          <CircleDashed className="w-5 h-5" />
          {hasUnreadStatus && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00a884] ring-2 ring-[#f0f2f5] dark:ring-[#202c33]" />
          )}
        </button>

        {/* Communities / Guilds button */}
        <button
          onClick={() => alert("Communities feature: All group members are strictly identified by @username rather than mobile numbers.")}
          className="p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors"
          title="Communities"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* New Chat Button */}
        <button
          onClick={onOpenNewChat}
          className="p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors"
          title="New Chat by @username"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </button>

        {/* Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-[#d1d7db] dark:hover:bg-[#374248] transition-colors"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#233138] rounded-md shadow-xl py-2 z-50 border border-[#e9edef] dark:border-[#222e35] text-sm animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenNewChat();
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center justify-between"
              >
                <span>New group</span>
                <span className="text-[10px] text-[#8696a0]">with @usernames</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenStarred();
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                <Star className="w-4 h-4 text-[#8696a0]" />
                <span>Starred messages</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenQRCode();
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                <QrCode className="w-4 h-4 text-[#8696a0]" />
                <span>Share your @username QR</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onToggleTheme();
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-[#eab308]" />
                    <span>Switch to Light theme</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#8696a0]" />
                    <span>Switch to Dark theme</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#111b21] dark:text-[#d1d7db] flex items-center gap-3"
              >
                <Settings className="w-4 h-4 text-[#8696a0]" />
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-[#e9edef] dark:border-[#222e35]" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onSwitchUser();
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-[#00a884] flex items-center gap-3 font-medium"
              >
                <UserCheck className="w-4 h-4" />
                <span>Switch demo profile</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] text-rose-500 flex items-center gap-3 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out / Switch Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
