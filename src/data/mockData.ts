import { Contact, CurrentUser, Message, UserStatus, CallRecord } from '../types/whatsapp';

export const INITIAL_USER: CurrentUser = {
  id: 'current_user',
  name: 'Tayyab Malik',
  username: '@tayyab_official',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  about: 'Available on @tayyab_official | Ping me for projects'
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact_1',
    name: 'Ayesha Khan',
    username: '@ayesha.khan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    about: 'Designing the future 🎨 ✨ | Find me on @ayesha.khan',
    isOnline: true,
    lastSeen: 'online',
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: 'contact_2',
    name: 'Zain Ahmed',
    username: '@zain_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    about: 'Code. Ship. Repeat. 💻 🚀 Reach me at @zain_dev',
    isOnline: false,
    lastSeen: 'today at 11:42 AM',
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: 'contact_3',
    name: 'Tech Innovators Guild',
    username: '@tech_innovators_group',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    about: 'Official tech collaboration hub | All members verified by @username',
    isOnline: true,
    lastSeen: 'online',
    unreadCount: 5,
    isGroup: true,
    groupMembers: [
      { id: 'm1', name: 'Tayyab Malik', username: '@tayyab_official', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', isAdmin: true },
      { id: 'm2', name: 'Ayesha Khan', username: '@ayesha.khan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', isAdmin: true },
      { id: 'm3', name: 'Zain Ahmed', username: '@zain_dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { id: 'm4', name: 'Hamza Ali', username: '@hamza_99', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { id: 'm5', name: 'Fatima Noor', username: '@fatima_tech', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'contact_4',
    name: 'Sarah Jenkins',
    username: '@sarah.design',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    about: 'UX Architect @ San Francisco. Always free on @sarah.design',
    isOnline: false,
    lastSeen: 'yesterday at 9:15 PM',
    unreadCount: 0,
  },
  {
    id: 'contact_5',
    name: 'Hamza Ali',
    username: '@hamza_99',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    about: 'Capturing moments 📸 Northern expeditions. DM @hamza_99',
    isOnline: true,
    lastSeen: 'online',
    unreadCount: 1,
  },
  {
    id: 'contact_6',
    name: 'Fatima Noor',
    username: '@fatima_tech',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    about: 'Researching neural models & multi-agent systems 🤖',
    isOnline: false,
    lastSeen: 'today at 8:05 AM',
    unreadCount: 0,
  },
  {
    id: 'contact_7',
    name: 'Bilal Iqbal',
    username: '@bilal_iqbal',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    about: 'Founder @ HyperScale ventures. Message @bilal_iqbal',
    isOnline: false,
    lastSeen: 'today at 2:30 PM',
    unreadCount: 0,
  },
  {
    id: 'contact_8',
    name: 'Dr. Farhan Malik',
    username: '@dr_farhan',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    about: 'Medical Consultations & Wellness. Verify username: @dr_farhan',
    isOnline: false,
    lastSeen: 'yesterday at 6:40 PM',
    unreadCount: 0,
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  contact_1: [
    {
      id: 'msg_101',
      chatId: 'contact_1',
      senderId: 'contact_1',
      senderName: 'Ayesha Khan',
      senderUsername: '@ayesha.khan',
      text: 'Hey Tayyab! Did you notice the new username feature? Now anyone can reach us directly with @ayesha.khan and @tayyab_official without sharing personal phone numbers! 🚀',
      timestamp: '10:14 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: false,
      reactions: [{ emoji: '🔥', count: 1, users: ['@tayyab_official'] }]
    },
    {
      id: 'msg_102',
      chatId: 'contact_1',
      senderId: 'current_user',
      senderName: 'Tayyab Malik',
      senderUsername: '@tayyab_official',
      text: 'Yes! It is brilliant and 100% private. No more leaking phone numbers anywhere. Everything is tied directly to unique usernames.',
      timestamp: '10:16 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: true,
      reactions: [{ emoji: '💯', count: 1, users: ['@ayesha.khan'] }]
    },
    {
      id: 'msg_103',
      chatId: 'contact_1',
      senderId: 'contact_1',
      senderName: 'Ayesha Khan',
      senderUsername: '@ayesha.khan',
      text: 'I just recorded a quick voice preview for our new prototype concept. Take a listen:',
      timestamp: '10:18 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: false,
    },
    {
      id: 'msg_104',
      chatId: 'contact_1',
      senderId: 'contact_1',
      senderName: 'Ayesha Khan',
      senderUsername: '@ayesha.khan',
      text: 'Voice note (0:14)',
      timestamp: '10:19 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: false,
      type: 'voice',
      audioDuration: 14,
    },
    {
      id: 'msg_105',
      chatId: 'contact_1',
      senderId: 'contact_1',
      senderName: 'Ayesha Khan',
      senderUsername: '@ayesha.khan',
      text: 'Let me know if we can sync on call later today! ✨',
      timestamp: '10:20 AM',
      dateLabel: 'TODAY',
      status: 'delivered',
      isOutgoing: false,
    }
  ],

  contact_2: [
    {
      id: 'msg_201',
      chatId: 'contact_2',
      senderId: 'contact_2',
      senderName: 'Zain Ahmed',
      senderUsername: '@zain_dev',
      text: 'Hey bro, I pushed the repository update. You can clone the branch or invite contributors by searching their unique username.',
      timestamp: 'Yesterday',
      dateLabel: 'YESTERDAY',
      status: 'read',
      isOutgoing: false,
    },
    {
      id: 'msg_202',
      chatId: 'contact_2',
      senderId: 'current_user',
      senderName: 'Tayyab Malik',
      senderUsername: '@tayyab_official',
      text: 'Awesome Zain! I will test it today. Send me the updated document if you have it ready.',
      timestamp: 'Yesterday',
      dateLabel: 'YESTERDAY',
      status: 'read',
      isOutgoing: true,
    },
    {
      id: 'msg_203',
      chatId: 'contact_2',
      senderId: 'contact_2',
      senderName: 'Zain Ahmed',
      senderUsername: '@zain_dev',
      text: 'Here is the system architecture doc:',
      timestamp: '11:42 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: false,
      type: 'doc',
      docName: 'Architecture_Spec_v3.pdf',
      docSize: '2.4 MB'
    }
  ],

  contact_3: [
    {
      id: 'msg_301',
      chatId: 'contact_3',
      senderId: 'm4',
      senderName: 'Hamza Ali',
      senderUsername: '@hamza_99',
      text: 'Hello everyone! Welcome to the new WhatsApp Web where every member is represented by their unique username instead of phone numbers!',
      timestamp: '9:00 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: false,
    },
    {
      id: 'msg_302',
      chatId: 'contact_3',
      senderId: 'm5',
      senderName: 'Fatima Noor',
      senderUsername: '@fatima_tech',
      text: 'This is great for community privacy! No strangers getting personal mobile numbers. 👏',
      timestamp: '9:12 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: false,
      reactions: [{ emoji: '👏', count: 3, users: ['@tayyab_official', '@ayesha.khan', '@zain_dev'] }]
    },
    {
      id: 'msg_303',
      chatId: 'contact_3',
      senderId: 'current_user',
      senderName: 'Tayyab Malik',
      senderUsername: '@tayyab_official',
      text: 'Agreed! To add anyone just click Add Member and type their @username. Simple and secure.',
      timestamp: '9:30 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: true,
    },
    {
      id: 'msg_304',
      chatId: 'contact_3',
      senderId: 'm2',
      senderName: 'Ayesha Khan',
      senderUsername: '@ayesha.khan',
      text: 'Sharing a quick snapshot from our UX wireframe deck:',
      timestamp: '10:05 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: false,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80'
    }
  ],

  contact_5: [
    {
      id: 'msg_501',
      chatId: 'contact_5',
      senderId: 'contact_5',
      senderName: 'Hamza Ali',
      senderUsername: '@hamza_99',
      text: 'Check out the view from Hunza valley! 🏔️',
      timestamp: '8:45 AM',
      dateLabel: 'TODAY',
      status: 'read',
      isOutgoing: false,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'msg_502',
      chatId: 'contact_5',
      senderId: 'contact_5',
      senderName: 'Hamza Ali',
      senderUsername: '@hamza_99',
      text: 'Are you joining the winter trek this weekend?',
      timestamp: '8:46 AM',
      dateLabel: 'TODAY',
      status: 'delivered',
      isOutgoing: false,
    }
  ]
};

export const INITIAL_STATUSES: UserStatus[] = [
  {
    id: 'status_user',
    userId: 'current_user',
    name: 'My Status',
    username: '@tayyab_official',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    updatedAt: 'Tap to add status update',
    items: [],
  },
  {
    id: 'status_1',
    userId: 'contact_1',
    name: 'Ayesha Khan',
    username: '@ayesha.khan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    updatedAt: '35 minutes ago',
    items: [
      {
        id: 'st_1',
        timestamp: '35m ago',
        caption: 'Final touches on the design system! Verified with @ayesha.khan 🎨',
        mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      }
    ],
    allViewed: false
  },
  {
    id: 'status_5',
    userId: 'contact_5',
    name: 'Hamza Ali',
    username: '@hamza_99',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    updatedAt: 'Today at 7:15 AM',
    items: [
      {
        id: 'st_2',
        timestamp: 'Today at 7:15 AM',
        caption: 'Sunrise over mountain peaks! 🌄',
        mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
      }
    ],
    allViewed: false
  },
  {
    id: 'status_6',
    userId: 'contact_6',
    name: 'Fatima Noor',
    username: '@fatima_tech',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    updatedAt: 'Yesterday at 11:20 PM',
    items: [
      {
        id: 'st_3',
        timestamp: 'Yesterday at 11:20 PM',
        text: '"Privacy is not an option, and it shouldn’t be the price we accept for just getting on the Internet." ✨ Reach me via @fatima_tech',
        bgColor: '#005c4b',
      }
    ],
    allViewed: true
  }
];

export const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'call_1',
    contactId: 'contact_1',
    contactName: 'Ayesha Khan',
    contactUsername: '@ayesha.khan',
    contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'video',
    direction: 'incoming',
    timestamp: 'Today, 10:02 AM',
    duration: '14 min 32 sec'
  },
  {
    id: 'call_2',
    contactId: 'contact_2',
    contactName: 'Zain Ahmed',
    contactUsername: '@zain_dev',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'voice',
    direction: 'outgoing',
    timestamp: 'Yesterday, 8:20 PM',
    duration: '5 min 10 sec'
  },
  {
    id: 'call_3',
    contactId: 'contact_5',
    contactName: 'Hamza Ali',
    contactUsername: '@hamza_99',
    contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'voice',
    direction: 'missed',
    timestamp: 'September 24, 3:15 PM'
  }
];
