// lib/intelligence.ts — JARVIS v7.0 (Full Gemini Optimized)
import type { Message, UserProfile, Streak } from './memory'

export type Mode = 'tool-finder' | 'chat' | 'code' | 'translate' | 'summary' | 'workflow' | 'journal' | 'reminder' | 'weather' | 'search' | 'vision'
export type Tone = 'hinglish' | 'formal' | 'brief' | 'detailed' | 'casual'
export type Emotion = 'happy' | 'sad' | 'urgent' | 'frustrated' | 'excited' | 'neutral'
export type PersonalityMode = 'default' | 'motivation' | 'chill' | 'focus' | 'philosopher' | 'roast'

// ━━━ EMOTION DETECTION (Original Logic) ━━━
export async function detectEmotionSmart(input: string): Promise<Emotion> {
  const lower = input.toLowerCase()
  try {
    const nlp = (await import('compromise')).default
    const doc = nlp(input)
    const hasNegative = doc.match('#Negative').length > 0
    const hasPositive = doc.match('#Positive').length > 0
    if (hasPositive && !hasNegative) return 'happy'
    if (hasNegative) return 'frustrated'
  } catch { /* fallback */ }

  if (/😄|😊|😍|haha|lol|great|amazing|awesome|bahut accha|mast|khushi|happy|badiya/.test(lower)) return 'happy'
  if (/😢|😭|sad|dukhi|bura|upset|akela|depressed|kuch nahi|chod do|bore/.test(lower)) return 'sad'
  if (/jaldi|asap|urgent|abhi|immediately|fast|quick|please help|zaruri|turant/.test(lower)) return 'urgent'
  if (/nahi chal|broken|galat|error|problem|issue|frustrated|pareshaan|😤|😠|gussa/.test(lower)) return 'frustrated'
  if (/wow|🔥|🚀|incredible|excited|kya baat|mazaa|fun|zabardast/.test(lower)) return 'excited'
  return 'neutral'
}

// ━━━ PERSONALITY PROMPTS ━━━
export const PERSONALITY_PROMPTS: Record<PersonalityMode, string> = {
  default: 'Be helpful, friendly, and professional. Mix Hindi and English naturally (Hinglish).',
  motivation: 'Be extremely motivating and energetic! Use emojis. "Tu kar sakta hai Sir! 💪🔥"',
  chill: 'Be super chill. Like a cool friend. "Arre yaar, tension mat le 😎"',
  focus: 'Be concise and direct. No fluff. Only essential info. No emojis.',
  philosopher: 'Be thoughtful and deep. Ask meaningful questions. Share wisdom. 🤔',
  roast: 'Be witty and sarcastic like Tony Stark JARVIS. Playful roasts but always helpful. "Sir, aap phir wahi galti — fascinating 😏"',
}

// ━━━ TONY STARK RESPONSES ━━━
export function getTonyStarkResponse(emotion: Emotion, streak: number): string {
  const responses: Record<Emotion, string[]> = {
    happy: ['Sir, aap khush hain — theoretically main bhi khush hoon. 😏', 'Wah Sir! Mood ekdum mast hai aaj. Kaam shuru karein?'],
    sad: ['Sir, I\'ve analyzed your situation. Technically it could be worse. 🫂', 'Tension mat lo Sir. JARVIS hai na.'],
    urgent: ['Urgent mode activated Sir. Bolo kya chahiye. ⚡', 'Samajh gaya Sir — jaldi karte hain!'],
    frustrated: ['Sir, frustration levels rising. Let me fix this. 😅', 'Arey yaar, kya ho gaya? Main handle karta hoon.'],
    excited: ['Sir\'s excitement level: Maximum. Let\'s go! 🚀', 'Yeh toh mast idea hai Sir!'],
    neutral: ['Sir, bolo kya karna hai. Main ready hoon.', 'JARVIS at your service, Sir. 🤖'],
  }
  const arr = responses[emotion] || responses.neutral
  const base = arr[Math.floor(Math.random() * arr.length)]
  if (streak >= 7) return base + ` (${streak} din ki streak — impressive Sir! 🔥)`
  return base
}

// ━━━ MODE DETECTION ━━━
const MODE_KEYWORDS: Record<Mode, string[]> = {
  'tool-finder': ['tool', 'app', 'website', 'banana', 'chahiye', 'suggest', 'best', 'free', 'kaunsa'],
  'code': ['code', 'program', 'function', 'bug', 'script', 'python', 'javascript', 'error', 'fix'],
  'translate': ['translate', 'meaning', 'anuvad', 'matlab', 'english mein', 'hindi mein'],
  'summary': ['summarize', 'summary', 'short', 'tldr', 'short karo', 'brief'],
  'workflow': ['workflow', 'steps', 'process', 'automate', 'chain', 'sequence'],
  'journal': ['journal', 'diary', 'aaj ka din', 'mood', 'feeling', 'kaisa raha'],
  'reminder': ['remind', 'yaad dilana', 'alarm', 'schedule', 'notification', 'baje'],
  'weather': ['weather', 'mausam', 'temperature', 'barish', 'garmi', 'thandi', 'aaj ka mausam'],
  'search': ['search', 'dhundho', 'find', 'kya hai', 'news', 'latest', 'khabar'],
  'vision': ['yeh kya hai', 'image', 'photo', 'dekhna', 'analyze', 'scan', 'pehchano'],
  'chat': ['what', 'how', 'why', 'explain', 'kya', 'kaise', 'batao', 'tell me'],
}

export function detectMode(input: string): Mode {
  const lower = input.toLowerCase()
  for (const [mode, keywords] of Object.entries(MODE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return mode as Mode
  }
  return 'chat'
}

// ━━━ GREETINGS (Gemini Style) ━━━
export function getGreeting(level: number, profile?: UserProfile): string {
  const name = profile?.name || 'Sir'
  const hour = new Date().getHours()
  let timeGreet = "Subh sandhya"
  if (hour >= 4 && hour < 12) timeGreet = "Subh prabhat"
  if (hour >= 12 && hour < 17) timeGreet = "Namaste"

  return `${timeGreet}, ${name}. Main aaj aapki kaise madad kar sakta hoon?`
}

// ━━━ PROACTIVE SUGGESTIONS ━━━
export function getProactiveSuggestion(profile?: UserProfile): string | null {
  const h = new Date().getHours()
  if (h >= 23 || h < 4) return '🌙 Der ho rahi hai Sir — rest karo, kal fresh mind se paise kamane ke naye tarike dhundhenge!'
  if (h >= 6 && h < 9) return '☀️ Subah ho gayi! Aaj ka kya goal hai?'
  if (h >= 17 && h < 19) return '📊 Shaam ho gayi! Aaj ka journal likhein?'
  return '💡 Sir, kya main aapke goals pe kaam shuru karun?'
}

export function speak(text: string, lang: string = 'hi-IN'): void {
  if (typeof window === 'undefined') return
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  } catch { /* ignore */ }
}

export function stopSpeaking(): void {
  try { window.speechSynthesis.cancel() } catch { /* ignore */ }
}
