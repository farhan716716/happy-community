import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial DB seed data
const SEED_DATA = {
  users: [
    {
      id: 'user_tayyab',
      name: 'Tayyab Malik',
      username: '@tayyab_official',
      pin: '1234',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      about: 'Available on @tayyab_official | Full stack developer',
      createdAt: new Date().toISOString(),
      lastSeen: 'online'
    },
    {
      id: 'user_ayesha',
      name: 'Ayesha Khan',
      username: '@ayesha.khan',
      pin: '1234',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      about: 'Designing the future 🎨 ✨ | Find me on @ayesha.khan',
      createdAt: new Date().toISOString(),
      lastSeen: 'online'
    },
    {
      id: 'user_zain',
      name: 'Zain Ahmed',
      username: '@zain_dev',
      pin: '1234',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      about: 'Code. Ship. Repeat. 💻 🚀 Reach me at @zain_dev',
      createdAt: new Date().toISOString(),
      lastSeen: 'today at 11:42 AM'
    },
    {
      id: 'user_hamza',
      name: 'Hamza Ali',
      username: '@hamza_99',
      pin: '1234',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      about: 'Capturing moments 📸 Northern expeditions. DM @hamza_99',
      createdAt: new Date().toISOString(),
      lastSeen: 'online'
    },
    {
      id: 'user_fatima',
      name: 'Fatima Noor',
      username: '@fatima_tech',
      pin: '1234',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      about: 'Researching neural models & multi-agent systems 🤖',
      createdAt: new Date().toISOString(),
      lastSeen: 'today at 8:05 AM'
    }
  ],
  messages: [
    {
      id: 'msg_init_1',
      chatId: '@ayesha.khan',
      senderId: 'user_ayesha',
      senderName: 'Ayesha Khan',
      senderUsername: '@ayesha.khan',
      receiverUsername: '@tayyab_official',
      text: 'Hey Tayyab! Did you notice the new username feature? Anyone in the world can now register their own @username and message us without phone numbers! 🚀',
      timestamp: '10:14 AM',
      dateLabel: 'TODAY',
      status: 'read' as const,
      isOutgoing: false,
      reactions: [{ emoji: '🔥', count: 1, users: ['@tayyab_official'] }]
    },
    {
      id: 'msg_init_2',
      chatId: '@ayesha.khan',
      senderId: 'user_tayyab',
      senderName: 'Tayyab Malik',
      senderUsername: '@tayyab_official',
      receiverUsername: '@ayesha.khan',
      text: 'Yes! It is completely global now. Anyone who opens the web app creates an account with their unique handle and we can talk directly.',
      timestamp: '10:16 AM',
      dateLabel: 'TODAY',
      status: 'read' as const,
      isOutgoing: true,
      reactions: [{ emoji: '💯', count: 1, users: ['@ayesha.khan'] }]
    }
  ],
  userContacts: {
    '@tayyab_official': ['@ayesha.khan', '@zain_dev', '@hamza_99', '@fatima_tech'],
    '@ayesha.khan': ['@tayyab_official', '@zain_dev'],
    '@zain_dev': ['@tayyab_official', '@ayesha.khan']
  },
  statuses: []
};

// Database helper functions
interface Database {
  users: Array<{
    id: string;
    name: string;
    username: string;
    pin?: string;
    avatar: string;
    about: string;
    createdAt: string;
    lastSeen: string;
  }>;
  messages: Array<{
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    senderUsername: string;
    receiverUsername: string;
    text: string;
    timestamp: string;
    dateLabel?: string;
    status: 'sent' | 'delivered' | 'read';
    isOutgoing?: boolean;
    type?: 'text' | 'image' | 'voice' | 'doc';
    mediaUrl?: string;
    audioDuration?: number;
    docName?: string;
    docSize?: string;
    reactions?: Array<{ emoji: string; count: number; users: string[] }>;
  }>;
  userContacts: Record<string, string[]>; // username -> list of contact usernames
  statuses: Array<any>;
}

function getDB(): Database {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
      return SEED_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return SEED_DATA;
  }
}

function saveDB(data: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

// SSE Clients for instant push notifications
interface SSEClient {
  username: string;
  res: Response;
}
let sseClients: SSEClient[] = [];

function broadcastToUser(targetUsername: string, event: string, payload: any) {
  const normTarget = targetUsername.toLowerCase();
  sseClients.forEach((client) => {
    if (client.username.toLowerCase() === normTarget) {
      try {
        client.res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
      } catch (err) {
        // Handle disconnect
      }
    }
  });
}

function broadcastGlobal(event: string, payload: any) {
  sseClients.forEach((client) => {
    try {
      client.res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
    } catch (err) {
      // Handle disconnect
    }
  });
}

// ================= API ROUTES =================

// 1. Check if a username is available
app.get('/api/auth/check-username', (req: Request, res: Response) => {
  const rawHandle = (req.query.username as string || '').trim().toLowerCase();
  const username = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;
  const db = getDB();
  const exists = db.users.some(u => u.username.toLowerCase() === username);
  res.json({ username, available: !exists });
});

// 2. Register new account with unique username
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, username: rawHandle, pin, avatar, about } = req.body;

  if (!name || !rawHandle) {
    res.status(400).json({ error: 'Display Name and unique @username are required.' });
    return;
  }

  const cleanHandle = (rawHandle as string).trim().toLowerCase();
  const username = cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`;

  // Validate format
  if (!/^@[a-z0-9_.]+$/.test(username) || username.length < 3) {
    res.status(400).json({ error: 'Username must contain at least 3 alphanumeric characters, periods, or underscores.' });
    return;
  }

  const db = getDB();
  const exists = db.users.some(u => u.username.toLowerCase() === username);

  if (exists) {
    res.status(409).json({ error: `Username ${username} is already registered by someone else. Please choose another unique username.` });
    return;
  }

  // Create new user
  const newUser = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    username,
    pin: pin ? String(pin).trim() : '1234',
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    about: about ? about.trim() : `Available on WhatsApp with unique ${username}`,
    createdAt: new Date().toISOString(),
    lastSeen: 'online'
  };

  db.users.push(newUser);

  // Initialize contact list with verified starter contacts
  if (!db.userContacts[username]) {
    db.userContacts[username] = ['@ayesha.khan', '@zain_dev'];
  }

  // Send a welcome message from Ayesha Khan
  const welcomeMsg = {
    id: `msg_welcome_${Date.now()}`,
    chatId: '@ayesha.khan',
    senderId: 'user_ayesha',
    senderName: 'Ayesha Khan',
    senderUsername: '@ayesha.khan',
    receiverUsername: username,
    text: `Welcome to WhatsApp Web (Username Edition), ${newUser.name}! Your account is now active with unique username ${username}. Anyone worldwide can find you and chat! 🎉`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dateLabel: 'TODAY',
    status: 'delivered' as const,
    isOutgoing: false
  };
  db.messages.push(welcomeMsg);

  saveDB(db);

  // Broadcast new user joined to other active users
  broadcastGlobal('user_registered', { user: newUser });

  res.status(201).json({ user: newUser });
});

// 3. Login with username
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username: rawHandle, pin } = req.body;

  if (!rawHandle) {
    res.status(400).json({ error: 'Please enter your unique @username.' });
    return;
  }

  const cleanHandle = (rawHandle as string).trim().toLowerCase();
  const username = cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`;

  const db = getDB();
  const user = db.users.find(u => u.username.toLowerCase() === username);

  if (!user) {
    res.status(404).json({ error: `Account with ${username} was not found. Please create a new account first.` });
    return;
  }

  // Optional PIN check
  if (user.pin && pin && user.pin !== String(pin).trim()) {
    res.status(401).json({ error: 'Incorrect 4-digit PIN. Please try again.' });
    return;
  }

  // Update last seen
  user.lastSeen = 'online';
  saveDB(db);

  res.json({ user });
});

// 4. Get all users or search users (Global directory)
app.get('/api/users', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const db = getDB();

  let results = db.users.map(({ pin, ...safeUser }) => safeUser);

  if (query) {
    results = results.filter(
      u => u.username.toLowerCase().includes(query) || u.name.toLowerCase().includes(query)
    );
  }

  res.json({ users: results });
});

// 5. Get saved contacts for a user
app.get('/api/contacts', (req: Request, res: Response) => {
  const rawHandle = (req.query.username as string || '').trim().toLowerCase();
  const username = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;

  const db = getDB();
  const contactHandles = db.userContacts[username] || [];

  const contactUsers = db.users
    .filter(u => contactHandles.includes(u.username) && u.username !== username)
    .map(({ pin, ...safeUser }) => safeUser);

  res.json({ contacts: contactUsers });
});

// 6. Add contact to user's list by username
app.post('/api/contacts/add', (req: Request, res: Response) => {
  const { myUsername: rawMy, targetUsername: rawTarget } = req.body;

  if (!rawMy || !rawTarget) {
    res.status(400).json({ error: 'Both usernames are required.' });
    return;
  }

  const myUsername = (rawMy as string).trim().toLowerCase();
  const targetUsername = (rawTarget as string).trim().toLowerCase();

  const db = getDB();
  const targetUser = db.users.find(u => u.username.toLowerCase() === targetUsername);

  if (!targetUser) {
    res.status(404).json({ error: `User with handle ${targetUsername} does not exist in the database.` });
    return;
  }

  if (!db.userContacts[myUsername]) {
    db.userContacts[myUsername] = [];
  }

  if (!db.userContacts[myUsername].includes(targetUser.username)) {
    db.userContacts[myUsername].push(targetUser.username);
  }

  // Also add reversely so both see each other
  if (!db.userContacts[targetUser.username]) {
    db.userContacts[targetUser.username] = [];
  }
  if (!db.userContacts[targetUser.username].includes(myUsername)) {
    db.userContacts[targetUser.username].push(myUsername);
  }

  saveDB(db);

  const { pin, ...safeTarget } = targetUser;
  res.json({ success: true, contact: safeTarget });
});

// 7. Get messages for a user
app.get('/api/messages', (req: Request, res: Response) => {
  const rawHandle = (req.query.username as string || '').trim().toLowerCase();
  const username = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;

  const db = getDB();
  const userMessages = db.messages.filter(
    m => m.senderUsername.toLowerCase() === username || m.receiverUsername.toLowerCase() === username
  );

  res.json({ messages: userMessages });
});

// 8. Send a message
app.post('/api/messages', (req: Request, res: Response) => {
  const {
    senderUsername,
    senderName,
    receiverUsername,
    text,
    type = 'text',
    mediaUrl,
    audioDuration,
    docName,
    docSize,
  } = req.body;

  if (!senderUsername || !receiverUsername || (!text && !mediaUrl && !audioDuration)) {
    res.status(400).json({ error: 'Sender, receiver, and message content are required.' });
    return;
  }

  const db = getDB();

  const newMsg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    chatId: receiverUsername,
    senderId: senderUsername,
    senderName: senderName || senderUsername,
    senderUsername,
    receiverUsername,
    text: text || '',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dateLabel: 'TODAY',
    status: 'delivered' as const,
    type,
    mediaUrl,
    audioDuration,
    docName,
    docSize,
    reactions: []
  };

  db.messages.push(newMsg);

  // Auto-save contact relationships if not saved
  if (!db.userContacts[senderUsername]) db.userContacts[senderUsername] = [];
  if (!db.userContacts[senderUsername].includes(receiverUsername)) {
    db.userContacts[senderUsername].push(receiverUsername);
  }
  if (!db.userContacts[receiverUsername]) db.userContacts[receiverUsername] = [];
  if (!db.userContacts[receiverUsername].includes(senderUsername)) {
    db.userContacts[receiverUsername].push(senderUsername);
  }

  saveDB(db);

  // Push instant SSE to receiver if online
  broadcastToUser(receiverUsername, 'new_message', newMsg);

  // If receiver is one of the built-in bot personalities, trigger an automated reply after 2s
  const botUsernames = ['@ayesha.khan', '@zain_dev', '@hamza_99', '@fatima_tech'];
  if (botUsernames.includes(receiverUsername.toLowerCase())) {
    setTimeout(() => {
      const db2 = getDB();
      const botUser = db2.users.find(u => u.username.toLowerCase() === receiverUsername.toLowerCase());
      const replies = [
        `Received loud and clear from ${senderUsername}! Verified through your unique handle. 💬`,
        `Thanks for messaging my username ${receiverUsername}! Everything works seamlessly without phone numbers.`,
        `Got it! Great to connect with ${senderUsername} here on WhatsApp Web. 🚀`,
        `100% verified username messaging! How is your day going?`
      ];
      const botText = replies[Math.floor(Math.random() * replies.length)];

      const botReply = {
        id: `reply_${Date.now()}`,
        chatId: senderUsername,
        senderId: botUser?.id || receiverUsername,
        senderName: botUser?.name || receiverUsername,
        senderUsername: receiverUsername,
        receiverUsername: senderUsername,
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateLabel: 'TODAY',
        status: 'delivered' as const,
        type: 'text' as const,
        reactions: []
      };

      db2.messages.push(botReply);
      saveDB(db2);

      // Send to sender
      broadcastToUser(senderUsername, 'new_message', botReply);
    }, 2000);
  }

  res.status(201).json({ message: newMsg });
});

// 9. React to a message
app.post('/api/messages/:id/react', (req: Request, res: Response) => {
  const { id } = req.params;
  const { emoji, username } = req.body;

  const db = getDB();
  const msg = db.messages.find(m => m.id === id);

  if (!msg) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  if (!msg.reactions) msg.reactions = [];

  const existing = msg.reactions.find(r => r.emoji === emoji);
  if (existing) {
    if (!existing.users.includes(username)) {
      existing.count += 1;
      existing.users.push(username);
    }
  } else {
    msg.reactions.push({ emoji, count: 1, users: [username] });
  }

  saveDB(db);

  // Broadcast reaction update
  broadcastToUser(msg.senderUsername, 'message_reaction', { messageId: id, reactions: msg.reactions });
  broadcastToUser(msg.receiverUsername, 'message_reaction', { messageId: id, reactions: msg.reactions });

  res.json({ message: msg });
});

// 10. Server-Sent Events (SSE) for Real-Time global updates
app.get('/api/events', (req: Request, res: Response) => {
  const rawHandle = (req.query.username as string || '').trim().toLowerCase();
  const username = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const client: SSEClient = { username, res };
  sseClients.push(client);

  // Heartbeat every 20s
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients = sseClients.filter(c => c !== client);
  });
});

// ================= VITE DEV / PRODUCTION STATIC MOUNT =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WhatsApp Web server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
