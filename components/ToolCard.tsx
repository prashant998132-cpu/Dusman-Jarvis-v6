'use client'
import { motion } from 'framer-motion'
import type { Tool } from '@/lib/links'
import { trackToolClick, getToolUsage } from '@/lib/memory'

interface Props { tool: Tool }

const catEmoji: Record<string, string> = {
  image: '🎨', video: '🎬', audio: '🎵', code: '💻',
  design: '✏️', writing: '✍️', productivity: '📋',
  learning: '📚', chat: '🤖', 'image-edit': '✂️',
  upscale: '⬆️', visual: '🎭', tts: '🗣️'
}

export default function ToolCard({ tool }: Props) {
  const usage = getToolUsage(tool.id)

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        trackToolClick(tool.id)
        window.open(tool.url, '_blank', 'noopener,noreferrer')
      }}
      style={{
        cursor: 'pointer',
        padding: 12,
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(255,26,136,0.08), rgba(124,58,237,0.06))',
        border: '1px solid rgba(255,26,136,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minHeight: 120,
      }}
    >
      <div style={{
        fontSize: 28, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,26,136,0.08)', borderRadius: 10,
      }}>
        {catEmoji[tool.category] || '🛠️'}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: '#f0f0ff', flex: 1, lineHeight: 1.2 }}>
          {tool.name}
        </span>
        {tool.trending && (
          <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            🔥
          </motion.span>
        )}
      </div>

      <span style={{ fontSize: 10, color: '#6b6b8a', lineHeight: 1.3 }}>
        {tool.tag}
      </span>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{
          fontSize: 9, padding: '2px 7px',
          background: 'rgba(0,212,255,0.12)', color: '#00d4ff',
          borderRadius: 8, border: '1px solid rgba(0,212,255,0.25)',
        }}>
          {tool.free}
        </span>
        {usage.usageCount > 0 && (
          <span style={{ fontSize: 9, color: '#6b6b8a' }}>{usage.usageCount}x</span>
        )}
      </div>
    </motion.div>
  )
}
