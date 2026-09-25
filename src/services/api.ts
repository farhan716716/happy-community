import { Contact, CurrentUser, Message } from '../types/whatsapp';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    return !!data.available;
  } catch (err) {
    console.error('Error checking username:', err);
    return true;
  }
}

export async function registerAccount(
  name: string,
  username: string,
  pin?: string,
  about?: string
): Promise<{ user?: CurrentUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, pin, about }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || 'Failed to create account.' };
    }
    return { user: data.user };
  } catch (err: any) {
    return { error: err.message || 'Network error during registration.' };
  }
}

export async function loginAccount(
  username: string,
  pin?: string
): Promise<{ user?: CurrentUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || 'Login failed.' };
    }
    return { user: data.user };
  } catch (err: any) {
    return { error: err.message || 'Network error during login.' };
  }
}

export async function fetchAllUsers(query: string = ''): Promise<Contact[]> {
  try {
    const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return (data.users || []).map((u: any) => ({
      id: u.username,
      name: u.name,
      username: u.username,
      avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`,
      about: u.about || '',
      isOnline: u.lastSeen === 'online',
      lastSeen: u.lastSeen,
      unreadCount: 0,
    }));
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

export async function fetchUserContacts(username: string): Promise<Contact[]> {
  try {
    const res = await fetch(`/api/contacts?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    return (data.contacts || []).map((u: any) => ({
      id: u.username,
      name: u.name,
      username: u.username,
      avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`,
      about: u.about || '',
      isOnline: u.lastSeen === 'online',
      lastSeen: u.lastSeen,
      unreadCount: 0,
    }));
  } catch (err) {
    console.error('Error fetching contacts:', err);
    return [];
  }
}

export async function addContactByUsername(
  myUsername: string,
  targetUsername: string
): Promise<{ success: boolean; contact?: Contact; error?: string }> {
  try {
    const res = await fetch('/api/contacts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ myUsername, targetUsername }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error };
    }
    const c = data.contact;
    return {
      success: true,
      contact: {
        id: c.username,
        name: c.name,
        username: c.username,
        avatar: c.avatar,
        about: c.about,
        isOnline: c.lastSeen === 'online',
        lastSeen: c.lastSeen,
        unreadCount: 0,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchMessages(username: string): Promise<Message[]> {
  try {
    const res = await fetch(`/api/messages?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    return data.messages || [];
  } catch (err) {
    console.error('Error fetching messages:', err);
    return [];
  }
}

export async function sendServerMessage(payload: {
  senderUsername: string;
  senderName: string;
  receiverUsername: string;
  text?: string;
  type?: 'text' | 'image' | 'voice' | 'doc';
  mediaUrl?: string;
  audioDuration?: number;
  docName?: string;
  docSize?: string;
}): Promise<Message | null> {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.message || null;
  } catch (err) {
    console.error('Error sending message:', err);
    return null;
  }
}

export async function sendReaction(
  messageId: string,
  emoji: string,
  username: string
): Promise<void> {
  try {
    await fetch(`/api/messages/${encodeURIComponent(messageId)}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji, username }),
    });
  } catch (err) {
    console.error('Error sending reaction:', err);
  }
}

export function subscribeToRealtimeEvents(
  username: string,
  onNewMessage: (msg: Message) => void,
  onNewUserRegistered: (user: any) => void
): () => void {
  try {
    const eventSource = new EventSource(`/api/events?username=${encodeURIComponent(username)}`);

    eventSource.addEventListener('new_message', (e) => {
      try {
        const msg = JSON.parse(e.data);
        onNewMessage(msg);
      } catch (err) {
        console.error('Error parsing sse msg:', err);
      }
    });

    eventSource.addEventListener('user_registered', (e) => {
      try {
        const data = JSON.parse(e.data);
        onNewUserRegistered(data.user);
      } catch (err) {
        console.error('Error parsing sse user:', err);
      }
    });

    return () => {
      eventSource.close();
    };
  } catch (err) {
    console.error('SSE not supported or error:', err);
    return () => {};
  }
}
