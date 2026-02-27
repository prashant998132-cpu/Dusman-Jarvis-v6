'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getRelationship, updateStreak, getAllMemories, getProfile, getBadges, lsGet, KEYS, type MemoryEntry, type Badge } from '@/lib/memory'

export default function JarvisKnows() {
  const [relationship] = useState(getRelationship())
  const [streak] = useState(updateStreak())
  const [memories, setMemories] = useState<MemoryEntry[]>([])
  const [profile] = useState(getProfile())
  const [badges] = useState<Badge[]>(getBadges())
  const [storageSize, setStorageSize] = useState(0)

  useEffect(() => {
    getAllMemories().then(setMemories).catch(() => setMemories([]))

    // Calculate storage
    let size = 0
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        size += (localStorage[key].length + key.length) * 2
      }
    }
    setStorageSize(Math.round(size / 1024))
  }, [])

  const LEVEL_NAMES = ['', 'Stranger 👋', 'Acquaintance 🤝', 'Friend 😊', 'Best Friend 🔥', 'JARVIS MODE 🤖']

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(255,26,136,0.06)', border: '1px solid rgba(255,26,136,0.15)', borderRadius: 14, padding: 16, marginBottom: 14 }}
    >
      <div style={{ fontSize: 11, color: '#6b6b8a', marginBottom: 10, letterSpacing: 1, fontWeight: 600 }}>{title}</div>
      {children}
    </motion.div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#05050f', color: '#f0f0ff', padding: '20px 16px 40px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontFamily: 'Courier New', color: '#ff1a88', fontSize: 20, letterSpacing: 2, marginBottom: 6 }}>
        👁️ WHAT JARVIS KNOWS
      </h1>
      <p style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 20 }}>Yeh sab data sirf aapke device pe hai. Koi server nahi.</p>

      {/* Profile */}
      {profile.name && (
        <Section title="PROFILE">
          <div style={{ fontSize: 14 }}>👤 {profile.name}</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>🌐 Language: {profile.language}</div>
          {profile.goals?.length > 0 && <div style={{ fontSize: 14, marginTop: 4 }}>🎯 Goals: {profile.goals.join(', ')}</div>}
          {profile.likes?.length > 0 && <div style={{ fontSize: 14, marginTop: 4 }}>❤️ Likes: {profile.likes.join(', ')}</div>}
          {profile.nightOwl && <div style={{ fontSize: 14, marginTop: 4 }}>🌙 Night owl detected</div>}
          {profile.usesVoice && <div style={{ fontSize: 14, marginTop: 4 }}>🎤 Voice user</div>}
        </Section>
      )}

      {/* Relationship */}
      <Section title="RELATIONSHIP">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: '⭐ Level', value: `${relationship.level} — ${LEVEL_NAMES[relationship.level]}` },
            { label: '💬 Chats', value: relationship.totalInteractions },
            { label: '🔥 Streak', value: `${streak.currentStreak} days` },
            { label: '🏆 Best Streak', value: `${streak.longestStreak} days` },
            { label: '⚡ XP', value: relationship.xp },
            { label: '📅 Since', value: new Date(relationship.firstMet).toLocaleDateString('hi-IN') },
          ].map(item => (
            <div key={item.label} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: '#6b6b8a' }}>{item.label}</div>
              <div style={{ fontSize: 14, marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Badges */}
      {badges.length > 0 && (
        <Section title={`BADGES (${badges.length})`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {badges.map(b => (
              <div key={b.id} style={{ padding: '6px 12px', background: 'rgba(255,26,136,0.12)', borderRadius: 20, border: '1px solid rgba(255,26,136,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{b.icon}</span>
                <span style={{ fontSize: 12, color: '#f0f0ff' }}>{b.name}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Memories */}
      {memories.length > 0 && (
        <Section title={`MEMORIES (${memories.length})`}>
          {memories.slice(0, 15).map((m, i) => (
            <div key={i} style={{ fontSize: 13, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 10, color: '#ff1a88', padding: '2px 6px', background: 'rgba(255,26,136,0.1)', borderRadius: 10, whiteSpace: 'nowrap', height: 'fit-content', marginTop: 2 }}>{m.type}</span>
              <span style={{ color: '#f0f0ff' }}>{m.text}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Storage */}
      <Section title="STORAGE">
        <div style={{ fontSize: 14 }}>💾 localStorage: ~{storageSize} KB used</div>
        <div style={{ fontSize: 12, color: '#6b6b8a', marginTop: 6 }}>
          Data stored: chats, preferences, profile, relationship, streak, badges
        </div>
        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(0,212,255,0.06)', borderRadius: 10, border: '1px solid rgba(0,212,255,0.15)' }}>
          <div style={{ fontSize: 12, color: '#00d4ff' }}>🔒 Privacy Guarantee</div>
          <div style={{ fontSize: 11, color: '#6b6b8a', marginTop: 4 }}>Koi bhi data server pe nahi jaata. Sab kuch aapke phone mein hai. JARVIS ka koi account nahi, koi tracking nahi.</div>
        </div>
      </Section>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <a href="/" style={{ color: '#ff1a88', fontSize: 14, textDecoration: 'none' }}>← JARVIS wapas jao</a>
      </div>
    </div>
  )
}
