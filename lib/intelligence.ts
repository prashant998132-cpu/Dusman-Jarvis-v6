// lib/intelligence.ts — JARVIS v7.0 (Verified Sync)
import type { Message, UserProfile } from './memory'

export type Emotion = 'happy' | 'sad' | 'urgent' | 'frustrated' | 'excited' | 'neutral'

export async function detectEmotionSmart(input: string): Promise<Emotion> {
  const lower = input.toLowerCase();
  if (/😄|😊|happy|mast|badiya/.test(lower)) return 'happy';
  if (/😢|sad|dukhi/.test(lower)) return 'sad';
  return 'neutral';
}

export function detectMode(input: string) { return 'chat'; }

export function getGreeting(level: number, profile?: UserProfile): string {
  const name = profile?.name || 'Sir';
  return `Subh sandhya, ${name}. Main aaj aapki kaise madad kar sakta hoon?`;
}

export function getProactiveSuggestion(profile?: UserProfile): string | null {
  return "💡 Sir, aaj ke earning tips check karein?";
}

export function speak(text: string): void {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
}
