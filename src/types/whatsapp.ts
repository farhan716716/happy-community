export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // usernames who reacted
}

export interface GroupMember {
  id: string;
  name: string;
  username: string; // e.g. @hamza_99
  avatar: string;
  isAdmin?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderUsername: string; // e.g. @tayyab_official or @ayesha.khan
  receiverUsername?: string; // target recipient
  text: string;
  timestamp: string; // e.g. 10:42 AM
  dateLabel?: string; // 'TODAY' or specific date
  status: MessageStatus;
  isOutgoing: boolean;
  type?: 'text' | 'image' | 'voice' | 'doc' | 'location';
  mediaUrl?: string;
  audioDuration?: number; // seconds
  docName?: string;
  docSize?: string;
  reactions?: Reaction[];
  replyTo?: {
    id: string;
    text: string;
    senderUsername: string;
  };
  isStarred?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  username: string; // unique, e.g. @ayesha.khan
  avatar: string;
  about: string;
  isOnline: boolean;
  lastSeen: string; // e.g. 'today at 11:20 AM'
  isTyping?: boolean;
  isGroup?: boolean;
  groupMembers?: GroupMember[];
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  isBlocked?: boolean;
}

export interface StoryItem {
  id: string;
  timestamp: string;
  caption?: string;
  text?: string;
  bgColor?: string;
  mediaUrl?: string;
}

export interface UserStatus {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatar: string;
  updatedAt: string;
  items: StoryItem[];
  allViewed?: boolean;
}

export interface CallRecord {
  id: string;
  contactId: string;
  contactName: string;
  contactUsername: string;
  contactAvatar: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  username: string; // e.g. @tayyab_official
  avatar: string;
  about: string;
}
