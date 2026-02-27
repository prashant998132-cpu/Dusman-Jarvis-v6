'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Plus, Settings, History, Wrench, Camera, Search, X, Menu } from 'lucide-react'
import JarvisAvatar from '@/components/JarvisAvatar'
import SoundWave from '@/components/SoundWave'
import ToolCard from '@/components/ToolCard'
import TypewriterText from '@/components/TypewriterText'
import CommandPalette from '@/components/CommandPalette'
import SmartStorageAlert from '@/components/SmartStorageAlert'
import SmartSettings from '@/components/SmartSettings'
import { BadgeToast } from '@/components/SmartGamification'
import { TOOLS } from '@/lib/links'
import {
  lsSet, getActiveChat, newChat, saveChat,
  getRelationship, incrementInteraction, updateStreak, getLevelProgress,
  getPreferences, extractProfileInfo, exportAllData,
  getProfile, trackBehavior, checkAndAwardBadges,
  getChats, deleteChat,
  type Message, type Chat, type Relationship, type Badge,
} from '@/lib/memory'
import {
  detectMode, detectEmotionSmart,
  getGreeting, getProactiveSuggestion, keywordFallback,
  getTonyStarkResponse, PERSONALITY_PROMPTS, getAmbientConfig, getAutoTheme,
  speak as speakUtil, stopSpeaking,
} from '@/lib/intelligence'

// ━━━ YOUR ORIGINAL CHAT BUBBLE (STABLE) ━━━
function ChatBubble({ msg, isNew, ttsEnabled }: { msg: Message; isNew: boolean; ttsEnabled: boolean }) {
  const isJarvis = msg.role === 'jarvis' || msg.role === 'assistant'
  
  useEffect(() => {
    if (isNew && isJarvis && ttsEnabled) {
      speakUtil(msg.content)
    }
  }, [isNew, isJarvis, ttsEnabled, msg.content])

  return (
    <motion.div
      initial={isNew ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex',
        justifyContent: isJarvis ? 'flex-start' : 'flex-end',
        marginBottom: 12,
        gap: 8,
        alignItems: 'flex-end',
      }}
    >
      {isJarvis && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,26,136,0.1)', border: '1px solid rgba(255,26,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
          🤖
        </div>
      )}
      
      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column' }}>
        {msg.confidence !== undefined && isJarvis && (
          <div style={{ fontSize: 10, color: '#6b6b8a', marginBottom: 4 }}>
             {msg.model} · {Math.round((msg.confidence || 0) * 100)}%
          </div>
        )}

        <div style={{
          padding: '10px 14px',
          borderRadius: isJarvis ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          background: isJarvis 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'linear-gradient(135deg, #ff1a88, #7c3aed)',
          border: isJarvis ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          color: '#f0f0ff',
        }}>
          {msg.imageUrl && (
            <img src={msg.imageUrl} alt="uploaded" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 8 }} />
          )}
          
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            {isNew && isJarvis ? <TypewriterText text={msg.content} /> : msg.content}
          </div>

          <div style={{ fontSize: 9, color: isJarvis ? '#4a4a6a' : 'rgba(255,255,255,0.5)', marginTop: 4, textAlign: isJarvis ? 'left' : 'right' }}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {!isJarvis && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
          👤
        </div>
      )}
    </motion.div>
  )
}

// ... (Rest of the original file logic you provided)
