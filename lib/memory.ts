// lib/memory.ts — JARVIS v7.0 (Verified Sync)
export const KEYS = {
  CHATS: 'jarvis_chats',
  ACTIVE: 'jarvis_active_chat',
  PREFS: 'jarvis_preferences',
  RELATIONSHIP: 'jarvis_relationship',
  PROFILE: 'jarvis_user_profile',
  STREAK: 'jarvis_streak',
}

export interface Message {
  id: string; role: 'user' | 'jarvis'; content: string;
  timestamp: number; emotion?: string; mode?: string;
  model?: string; imageUrl?: string;
}

export interface Chat {
  id: string; title: string; messages: Message[];
  createdAt: number; updatedAt: number;
}

export interface UserProfile {
  name?: string; community: string; category: string;
  annualIncome: string; language: 'hindi' | 'english' | 'hinglish';
  goals: string[]; likes: string[]; dislikes: string[]; habits: string[];
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Sir', community: 'Patel', category: 'OBC',
  annualIncome: '1-2 Lakhs', language: 'hinglish',
  goals: [], likes: [], dislikes: [], habits: []
}

export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : fallback;
}

export function lsSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getProfile(): UserProfile { return lsGet<UserProfile>(KEYS.PROFILE, DEFAULT_PROFILE); }
export function getChats(): Chat[] { return lsGet<Chat[]>(KEYS.CHATS, []); }
export function saveChat(chat: Chat): void {
  const chats = getChats();
  const idx = chats.findIndex(c => c.id === chat.id);
  if (idx >= 0) chats[idx] = chat; else chats.push(chat);
  lsSet(KEYS.CHATS, chats);
}
export function newChat(): Chat {
  const chat: Chat = { id: `chat_${Date.now()}`, title: 'New Conversation', messages: [], createdAt: Date.now(), updatedAt: Date.now() };
  saveChat(chat);
  lsSet(KEYS.ACTIVE, chat.id);
  return chat;
}
export function getActiveChat(): Chat | null {
  const id = lsGet<string>(KEYS.ACTIVE, '');
  return getChats().find(c => c.id === id) || null;
}
export function getRelationship() { return lsGet(KEYS.RELATIONSHIP, { totalInteractions: 0, level: 1, xp: 0 }); }
export function incrementInteraction() {
  const r = getRelationship(); r.totalInteractions++; r.xp += 10;
  if (r.totalInteractions >= 25) r.level = 2;
  lsSet(KEYS.RELATIONSHIP, r);
}
export function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const s = lsGet(KEYS.STREAK, { currentStreak: 0, lastActiveDate: '' });
  if (s.lastActiveDate !== today) { s.currentStreak++; s.lastActiveDate = today; lsSet(KEYS.STREAK, s); }
}
export function getPreferences() { return lsGet(KEYS.PREFS, { theme: 'dark', ttsEnabled: false, hapticEnabled: true }); }
export function isPINEnabled() { return false; } // Temporary fallback to avoid crash
export function verifyPIN(pin: string) { return true; }
