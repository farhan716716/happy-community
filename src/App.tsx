import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Contact, 
  CurrentUser, 
  Message, 
  UserStatus, 
  CallRecord 
} from './types/whatsapp';
import { 
  INITIAL_STATUSES, 
  INITIAL_CALLS 
} from './data/mockData';
import { SidebarHeader } from './components/Sidebar/SidebarHeader';
import { SearchBar } from './components/Sidebar/SearchBar';
import { ChatList } from './components/Sidebar/ChatList';
import { CallsView } from './components/Sidebar/CallsView';
import { ChatHeader } from './components/Chat/ChatHeader';
import { MessageList } from './components/Chat/MessageList';
import { ChatInput } from './components/Chat/ChatInput';
import { ContactInfoDrawer } from './components/Chat/ContactInfoDrawer';
import { NewChatModal } from './components/Modals/NewChatModal';
import { StatusViewerModal } from './components/Modals/StatusViewerModal';
import { CallModal } from './components/Modals/CallModal';
import { QRCodeModal } from './components/Modals/QRCodeModal';
import { SettingsDrawer } from './components/Modals/SettingsDrawer';
import { StarredMessagesDrawer } from './components/Modals/StarredMessagesDrawer';
import { ImagePreviewModal } from './components/Modals/ImagePreviewModal';
import { AuthScreen } from './components/Auth/AuthScreen';
import { playMessageSentSound, playMessageReceivedSound } from './utils/audio';
import { 
  fetchUserContacts, 
  fetchMessages, 
  sendServerMessage, 
  sendReaction, 
  addContactByUsername,
  subscribeToRealtimeEvents 
} from './services/api';
import { Laptop, Lock, ShieldCheck, MessageSquarePlus } from 'lucide-react';

const AUTH_STORAGE_KEY = 'whatsapp_unique_auth_user';

export default function App() {
  // Theme state (Dark mode default matching WhatsApp Web)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Core Data states
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [statuses, setStatuses] = useState<UserStatus[]>(INITIAL_STATUSES);
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);

  // Active UI Navigation states
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'favourites' | 'groups'>('all');

  // Modals & Panels states
  const [activeSidebarView, setActiveSidebarView] = useState<'chats' | 'status' | 'calls' | 'settings' | 'new_chat' | 'starred'>('chats');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showStatusViewer, setShowStatusViewer] = useState(false);
  const [statusViewerContactId, setStatusViewerContactId] = useState<string | undefined>(undefined);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [activeCall, setActiveCall] = useState<{ contact: Contact; type: 'voice' | 'video' } | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Apply dark class to HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  // Load contacts and messages from server for authenticated user
  const syncServerData = useCallback(async (user: CurrentUser) => {
    try {
      const [fetchedContacts, fetchedMsgs] = await Promise.all([
        fetchUserContacts(user.username),
        fetchMessages(user.username),
      ]);

      setContacts(fetchedContacts);

      // Group messages by partner handle
      const grouped: Record<string, Message[]> = {};
      fetchedMsgs.forEach((msg) => {
        const isOut = msg.senderUsername.toLowerCase() === user.username.toLowerCase();
        const partnerHandle = (isOut ? (msg.receiverUsername || msg.chatId) : (msg.senderUsername || msg.chatId)) || '';
        if (!partnerHandle) return;
        if (!grouped[partnerHandle]) grouped[partnerHandle] = [];
        grouped[partnerHandle].push({
          ...msg,
          isOutgoing: isOut,
        });
      });

      setMessages(grouped);

      // If no active chat selected and contacts exist, select the first
      setActiveContactId((prev) => {
        if (prev) return prev;
        return fetchedContacts.length > 0 ? fetchedContacts[0].id : null;
      });
    } catch (err) {
      console.error('Error syncing server data:', err);
    }
  }, []);

  // When user logs in or mounts with saved user
  useEffect(() => {
    if (!currentUser) return;

    syncServerData(currentUser);

    // Subscribe to SSE real-time events
    const unsubscribe = subscribeToRealtimeEvents(
      currentUser.username,
      (newMsg: Message) => {
        playMessageReceivedSound();

        const isOut = newMsg.senderUsername.toLowerCase() === currentUser.username.toLowerCase();
        const partnerHandle = (isOut ? (newMsg.receiverUsername || newMsg.chatId) : (newMsg.senderUsername || newMsg.chatId)) || '';
        if (!partnerHandle) return;

        setMessages((prev) => ({
          ...prev,
          [partnerHandle]: [...(prev[partnerHandle] || []), { ...newMsg, isOutgoing: isOut }],
        }));

        // If partner not in contacts, re-sync contacts
        setContacts((prev) => {
          if (!prev.some((c) => c.username.toLowerCase() === partnerHandle.toLowerCase())) {
            fetchUserContacts(currentUser.username).then(setContacts);
          }
          return prev.map((c) => {
            if (c.username.toLowerCase() === partnerHandle.toLowerCase()) {
              return {
                ...c,
                unreadCount: activeContactId === c.id ? 0 : c.unreadCount + 1,
              };
            }
            return c;
          });
        });
      },
      (_newRegisteredUser: any) => {
        // Optional notification when someone registers
      }
    );

    // Polling fallback every 3.5s to ensure guaranteed sync across tabs/devices
    const pollInterval = setInterval(() => {
      syncServerData(currentUser);
    }, 3500);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [currentUser, syncServerData, activeContactId]);

  // Auth handler
  const handleAuthSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (err) {
      console.error('Error saving user to storage:', err);
    }
  };

  // Logout handler
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out of your @username account?")) {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {}
      setCurrentUser(null);
      setActiveContactId(null);
      setMessages({});
      setContacts([]);
    }
  };

  // Switch demo user
  const handleSwitchUser = () => {
    if (!currentUser) return;
    if (currentUser.username === '@tayyab_official') {
      const ayeshaUser: CurrentUser = {
        id: 'user_ayesha',
        name: 'Ayesha Khan',
        username: '@ayesha.khan',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        about: 'Designing the future 🎨 ✨ | Find me on @ayesha.khan'
      };
      handleAuthSuccess(ayeshaUser);
      alert("Switched account to @ayesha.khan!");
    } else {
      const tayyabUser: CurrentUser = {
        id: 'user_tayyab',
        name: 'Tayyab Malik',
        username: '@tayyab_official',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        about: 'Available on @tayyab_official | Full stack developer'
      };
      handleAuthSuccess(tayyabUser);
      alert("Switched account to @tayyab_official!");
    }
  };

  // Selected contact
  const activeContact = contacts.find((c) => c.id === activeContactId || c.username === activeContactId) || null;
  const activePartnerHandle = activeContact?.username || activeContactId || '';
  const activeMessages = activePartnerHandle ? messages[activePartnerHandle] || [] : [];

  // Filtered contacts for sidebar
  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return c.unreadCount > 0;
    if (activeFilter === 'favourites') return c.isPinned;
    if (activeFilter === 'groups') return c.isGroup;
    return true;
  });

  // Send message handler with global server transmission
  const handleSendMessage = async (text: string) => {
    if (!activeContact || !currentUser) return;

    playMessageSentSound();

    const partnerHandle = activeContact.username;

    // Optimistic UI update
    const optimisticMsg: Message = {
      id: `msg_opt_${Date.now()}`,
      chatId: partnerHandle,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderUsername: currentUser.username,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateLabel: 'TODAY',
      status: 'sent',
      isOutgoing: true,
    };

    setMessages((prev) => ({
      ...prev,
      [partnerHandle]: [...(prev[partnerHandle] || []), optimisticMsg],
    }));

    // Post to server
    await sendServerMessage({
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      receiverUsername: partnerHandle,
      text,
      type: 'text',
    });
  };

  // Send voice note
  const handleSendVoiceNote = async (duration: number) => {
    if (!activeContact || !currentUser) return;
    playMessageSentSound();

    const partnerHandle = activeContact.username;

    const optimisticMsg: Message = {
      id: `voice_opt_${Date.now()}`,
      chatId: partnerHandle,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderUsername: currentUser.username,
      text: `Voice message (${duration}s)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateLabel: 'TODAY',
      status: 'sent',
      isOutgoing: true,
      type: 'voice',
      audioDuration: duration,
    };

    setMessages((prev) => ({
      ...prev,
      [partnerHandle]: [...(prev[partnerHandle] || []), optimisticMsg],
    }));

    await sendServerMessage({
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      receiverUsername: partnerHandle,
      text: `Voice message (${duration}s)`,
      type: 'voice',
      audioDuration: duration,
    });
  };

  // Send image
  const handleSendImage = async (imageUrl: string, caption?: string) => {
    if (!activeContact || !currentUser) return;
    playMessageSentSound();

    const partnerHandle = activeContact.username;

    const optimisticMsg: Message = {
      id: `img_opt_${Date.now()}`,
      chatId: partnerHandle,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderUsername: currentUser.username,
      text: caption || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateLabel: 'TODAY',
      status: 'sent',
      isOutgoing: true,
      type: 'image',
      mediaUrl: imageUrl,
    };

    setMessages((prev) => ({
      ...prev,
      [partnerHandle]: [...(prev[partnerHandle] || []), optimisticMsg],
    }));

    await sendServerMessage({
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      receiverUsername: partnerHandle,
      text: caption || '',
      type: 'image',
      mediaUrl: imageUrl,
    });
  };

  // Send document
  const handleSendDoc = async (docName: string, docSize: string) => {
    if (!activeContact || !currentUser) return;
    playMessageSentSound();

    const partnerHandle = activeContact.username;

    const optimisticMsg: Message = {
      id: `doc_opt_${Date.now()}`,
      chatId: partnerHandle,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderUsername: currentUser.username,
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateLabel: 'TODAY',
      status: 'sent',
      isOutgoing: true,
      type: 'doc',
      docName,
      docSize,
    };

    setMessages((prev) => ({
      ...prev,
      [partnerHandle]: [...(prev[partnerHandle] || []), optimisticMsg],
    }));

    await sendServerMessage({
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      receiverUsername: partnerHandle,
      text: '',
      type: 'doc',
      docName,
      docSize,
    });
  };

  // React to message
  const handleReactToMessage = async (messageId: string, emoji: string) => {
    if (!activePartnerHandle || !currentUser) return;

    setMessages((prev) => {
      const chatMsgs = prev[activePartnerHandle] || [];
      return {
        ...prev,
        [activePartnerHandle]: chatMsgs.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = m.reactions || [];
          const existing = currentReactions.find((r) => r.emoji === emoji);

          let updatedReactions;
          if (existing) {
            updatedReactions = currentReactions.map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, users: [...r.users, currentUser.username] }
                : r
            );
          } else {
            updatedReactions = [
              ...currentReactions,
              { emoji, count: 1, users: [currentUser.username] },
            ];
          }
          return { ...m, reactions: updatedReactions };
        }),
      };
    });

    await sendReaction(messageId, emoji, currentUser.username);
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    if (!activePartnerHandle) return;
    setMessages((prev) => ({
      ...prev,
      [activePartnerHandle]: (prev[activePartnerHandle] || []).filter((m) => m.id !== messageId),
    }));
  };

  // Toggle star
  const handleToggleStar = (messageId: string) => {
    if (!activePartnerHandle) return;
    setMessages((prev) => ({
      ...prev,
      [activePartnerHandle]: (prev[activePartnerHandle] || []).map((m) =>
        m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
      ),
    }));
  };

  // Clear messages
  const handleClearChat = () => {
    if (!activePartnerHandle) return;
    if (confirm("Are you sure you want to clear all messages in this chat?")) {
      setMessages((prev) => ({
        ...prev,
        [activePartnerHandle]: [],
      }));
    }
  };

  // Delete contact chat
  const handleDeleteChat = (contactId?: string) => {
    const id = contactId || activeContactId;
    if (!id) return;
    setContacts((prev) => prev.filter((c) => c.id !== id && c.username !== id));
    if (activeContactId === id) {
      setActiveContactId(null);
      setShowContactInfo(false);
    }
  };

  // Toggle pin
  const handleTogglePin = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId || c.username === contactId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Toggle mute
  const handleToggleMute = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId || c.username === contactId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  // Block contact
  const handleBlockContact = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId || c.username === contactId);
    if (!contact) return;
    alert(`Blocked ${contact.username}. You will no longer receive calls or messages from this handle.`);
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId || c.username === contactId ? { ...c, isBlocked: true } : c))
    );
  };

  // Add group member by username
  const handleAddGroupMember = (newUsername: string) => {
    if (!activeContactId) return;
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id !== activeContactId) return c;
        const currentMembers = c.groupMembers || [];
        const newMember = {
          id: `m_${Date.now()}`,
          name: newUsername.replace('@', ''),
          username: newUsername,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newUsername}`,
        };
        return {
          ...c,
          groupMembers: [...currentMembers, newMember],
        };
      })
    );
    alert(`Added ${newUsername} to the group!`);
  };

  // Add new contact by unique @username globally
  const handleAddNewContact = async (newContactData: { name: string; username: string; about: string }) => {
    if (!currentUser) return;

    // Persist to server
    const res = await addContactByUsername(currentUser.username, newContactData.username);

    if (res.contact) {
      setContacts((prev) => {
        if (prev.some((c) => c.username.toLowerCase() === res.contact!.username.toLowerCase())) {
          return prev;
        }
        return [res.contact!, ...prev];
      });
      setActiveContactId(res.contact.username);
    } else {
      // Local fallback
      const fallbackContact: Contact = {
        id: newContactData.username,
        name: newContactData.name,
        username: newContactData.username,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newContactData.username}`,
        about: newContactData.about,
        isOnline: true,
        lastSeen: 'online',
        unreadCount: 0,
      };
      setContacts((prev) => [fallbackContact, ...prev]);
      setActiveContactId(fallbackContact.username);
    }

    setActiveSidebarView('chats');
  };

  // Start voice call
  const handleStartVoiceCall = (contact: Contact) => {
    setActiveCall({ contact, type: 'voice' });
  };

  // Start video call
  const handleStartVideoCall = (contact: Contact) => {
    setActiveCall({ contact, type: 'video' });
  };

  // End call
  const handleEndCall = (durationSeconds: number) => {
    if (activeCall) {
      const newCallRecord: CallRecord = {
        id: `call_${Date.now()}`,
        contactId: activeCall.contact.id,
        contactName: activeCall.contact.name,
        contactUsername: activeCall.contact.username,
        contactAvatar: activeCall.contact.avatar,
        type: activeCall.type,
        direction: 'outgoing',
        timestamp: 'Just now',
        duration: `${durationSeconds}s`,
      };
      setCalls((prev) => [newCallRecord, ...prev]);
    }
    setActiveCall(null);
  };

  // Check if unread status stories exist
  const hasUnreadStatus = statuses.some((s) => s.items.length > 0 && !s.allViewed);

  // If user is not authenticated, show AuthScreen
  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={`w-screen h-screen overflow-hidden flex flex-col ${theme === 'dark' ? 'dark' : ''} bg-[#efeae2] dark:bg-[#0c1317] font-sans antialiased text-[#111b21] dark:text-[#e9edef]`}>
      {/* Top Emerald Header Accent Bar (Signature WhatsApp Web) */}
      <div className="h-2.5 w-full bg-[#00a884] dark:bg-[#00a884] shrink-0" />

      {/* Main WhatsApp Application Container */}
      <div className="flex-1 w-full h-[calc(100vh-10px)] max-w-[1720px] mx-auto flex overflow-hidden shadow-2xl relative">
        {/* ================= LEFT SIDEBAR (Chats, Contacts, Stories, Settings) ================= */}
        <div
          className={`w-full md:w-[400px] lg:w-[450px] shrink-0 h-full flex flex-col bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222e35] relative z-20 transition-all ${
            activeContactId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Sidebar Top Header */}
          <SidebarHeader
            currentUser={currentUser}
            onOpenProfile={() => setActiveSidebarView('settings')}
            onOpenStatus={() => setShowStatusViewer(true)}
            onOpenNewChat={() => setActiveSidebarView('new_chat')}
            onOpenCalls={() => setActiveSidebarView('calls')}
            onOpenQRCode={() => setShowQRCodeModal(true)}
            onOpenSettings={() => setActiveSidebarView('settings')}
            onOpenStarred={() => setActiveSidebarView('starred')}
            onSwitchUser={handleSwitchUser}
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            hasUnreadStatus={hasUnreadStatus}
            activeTab={activeSidebarView === 'calls' ? 'calls' : activeSidebarView === 'status' ? 'status' : 'chats'}
          />

          {/* Search bar & filter pills */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Primary Chat List */}
          <ChatList
            contacts={filteredContacts}
            messages={messages}
            activeContactId={activeContact?.id || activeContactId}
            onSelectContact={(c) => {
              setActiveContactId(c.username || c.id);
              // mark read
              setContacts((prev) =>
                prev.map((item) => (item.username === c.username ? { ...item, unreadCount: 0 } : item))
              );
            }}
            onTogglePin={handleTogglePin}
            onToggleMute={handleToggleMute}
            onDeleteChat={handleDeleteChat}
            statuses={statuses}
            onOpenStory={(contactId) => {
              setStatusViewerContactId(contactId);
              setShowStatusViewer(true);
            }}
            onOpenNewChat={() => setActiveSidebarView('new_chat')}
          />

          {/* Slide-over Views in Sidebar */}
          {activeSidebarView === 'calls' && (
            <CallsView
              calls={calls}
              contacts={contacts}
              onClose={() => setActiveSidebarView('chats')}
              onStartVoiceCall={handleStartVoiceCall}
              onStartVideoCall={handleStartVideoCall}
            />
          )}

          {activeSidebarView === 'new_chat' && (
            <NewChatModal
              contacts={contacts}
              onClose={() => setActiveSidebarView('chats')}
              onSelectContact={(c) => {
                setActiveContactId(c.username || c.id);
                setActiveSidebarView('chats');
              }}
              onAddNewContact={handleAddNewContact}
            />
          )}

          {activeSidebarView === 'settings' && (
            <SettingsDrawer
              currentUser={currentUser}
              onUpdateProfile={(updated) => {
                setCurrentUser((prev) => {
                  if (!prev) return null;
                  const newUser = { ...prev, ...updated };
                  try {
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
                  } catch {}
                  return newUser;
                });
              }}
              onClose={() => setActiveSidebarView('chats')}
              theme={theme}
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          )}

          {activeSidebarView === 'starred' && (
            <StarredMessagesDrawer
              messages={messages}
              contacts={contacts}
              onClose={() => setActiveSidebarView('chats')}
              onSelectChat={(id) => {
                setActiveContactId(id);
                setActiveSidebarView('chats');
              }}
            />
          )}
        </div>

        {/* ================= CENTER / RIGHT CHAT WINDOW ================= */}
        {activeContact ? (
          <div
            className={`flex-1 h-full flex flex-col relative z-10 transition-all ${
              activeContactId ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Chat Top Bar */}
            <ChatHeader
              contact={activeContact}
              onOpenInfo={() => setShowContactInfo(!showContactInfo)}
              onStartVoiceCall={handleStartVoiceCall}
              onStartVideoCall={handleStartVideoCall}
              onSearchChat={() => alert(`Search within chat of ${activeContact.username}`)}
              onClearChat={handleClearChat}
              onDeleteChat={() => handleDeleteChat()}
              onBackMobile={() => setActiveContactId(null)}
            />

            {/* Chat Messages Body with WhatsApp Doodle Wallpaper */}
            <div className="flex-1 overflow-hidden flex flex-col relative whatsapp-chat-wallpaper">
              <MessageList
                contact={activeContact}
                messages={activeMessages}
                onReact={handleReactToMessage}
                onDeleteMessage={handleDeleteMessage}
                onToggleStar={handleToggleStar}
                onImageClick={(url) => setPreviewImageUrl(url)}
              />

              {/* Chat Bottom Typing & Attachment Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                onSendVoiceNote={handleSendVoiceNote}
                onSendImage={handleSendImage}
                onSendDoc={handleSendDoc}
              />
            </div>
          </div>
        ) : (
          /* Empty Chat Splash Placeholder (Authentic WhatsApp Web) */
          <div className="hidden md:flex flex-1 h-full bg-[#f0f2f5] dark:bg-[#222e35] flex-col items-center justify-center p-8 text-center select-none border-b-6 border-[#00a884]">
            <div className="max-w-md flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#00a884]/15 flex items-center justify-center text-[#00a884] mb-6">
                <Laptop className="w-10 h-10" />
              </div>

              <h1 className="text-3xl font-light text-[#111b21] dark:text-[#e9edef] mb-3">
                WhatsApp Web
              </h1>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00a884]/15 rounded-full text-xs font-mono text-[#00a884] font-medium mb-4">
                <span>Logged in as {currentUser.username}</span>
              </div>

              <p className="text-sm text-[#667781] dark:text-[#8696a0] leading-relaxed mb-6">
                Send and receive messages without sharing personal telephone numbers. Anyone worldwide who creates an account with their unique <strong>@username</strong> can chat with you here!
              </p>

              <button
                onClick={() => setActiveSidebarView('new_chat')}
                className="px-5 py-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white text-sm font-medium rounded-full shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Search or Chat by @username</span>
              </button>

              <div className="mt-12 flex items-center gap-1.5 text-xs text-[#8696a0]">
                <Lock className="w-3.5 h-3.5 text-[#8696a0]" />
                <span>End-to-end encrypted with @username keys</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= RIGHT DRAWER: CONTACT INFO ================= */}
        {showContactInfo && activeContact && (
          <ContactInfoDrawer
            contact={activeContact}
            onClose={() => setShowContactInfo(false)}
            onBlockContact={handleBlockContact}
            onAddGroupMember={handleAddGroupMember}
            onOpenQRCodeForUser={(_handle) => {
              setShowQRCodeModal(true);
            }}
          />
        )}
      </div>

      {/* ================= GLOBAL OVERLAYS & MODALS ================= */}
      {/* 1. Status / Story Viewer Modal */}
      {showStatusViewer && (
        <StatusViewerModal
          statuses={statuses}
          initialContactId={statusViewerContactId}
          onClose={() => {
            setShowStatusViewer(false);
            setStatusViewerContactId(undefined);
          }}
          onReplyToStory={(cId, reply) => {
            setActiveContactId(cId);
            handleSendMessage(reply);
          }}
        />
      )}

      {/* 2. Audio / Video Call Simulation Modal */}
      {activeCall && (
        <CallModal
          contact={activeCall.contact}
          type={activeCall.type}
          onEndCall={handleEndCall}
        />
      )}

      {/* 3. Personal QR Code & Username Share Modal */}
      {showQRCodeModal && (
        <QRCodeModal
          user={currentUser}
          onClose={() => setShowQRCodeModal(false)}
        />
      )}

      {/* 4. Full-Screen Image Preview Modal */}
      {previewImageUrl && (
        <ImagePreviewModal
          imageUrl={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />
      )}
    </div>
  );
}
