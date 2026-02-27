function ChatBubble({ msg, isNew, ttsEnabled }: { msg: Message; isNew: boolean; ttsEnabled: boolean }) {
  const isJarvis = msg.role === 'jarvis' || msg.role === 'assistant'
  
  useEffect(() => {
    if (isNew && isJarvis && ttsEnabled) speakUtil(msg.content)
  }, [isNew, isJarvis, ttsEnabled, msg.content])

  // मॉडल के हिसाब से कलर चुनना (Subtle Colors)
  const statusColor = msg.model === 'groq' ? '#f97316' : '#00d4ff';
  const modelLabel = msg.model === 'groq' ? 'Secondary Link' : 'Neural Link';

  return (
    <motion.div
      initial={isNew ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex',
        justifyContent: isJarvis ? 'flex-start' : 'flex-end',
        marginBottom: 20,
        gap: 12,
        alignItems: 'flex-end',
      }}
    >
      {isJarvis && (
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,26,136,0.1)', border: '1px solid rgba(255,26,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
          🤖
        </div>
      )}
      
      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        {/* --- PREMIUM NEURAL INDICATOR --- */}
        {isJarvis && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4, opacity: 0.5 }}>
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }} 
            />
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', color: '#6b6b8a', textTransform: 'uppercase' }}>
              {modelLabel}
            </span>
          </div>
        )}

        <div style={{
          padding: '12px 16px',
          borderRadius: isJarvis ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
          background: isJarvis 
            ? 'rgba(255, 255, 255, 0.03)' // Ultra-minimal glass
            : 'linear-gradient(135deg, #ff1a88, #7c3aed)',
          border: isJarvis ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          backdropFilter: isJarvis ? 'blur(10px)' : 'none',
          boxShadow: isJarvis ? '0 4px 15px rgba(0,0,0,0.1)' : '0 4px 15px rgba(255,26,136,0.2)',
          color: '#f0f0ff',
        }}>
          {msg.imageUrl && (
            <img src={msg.imageUrl} alt="uploaded" style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 10 }} />
          )}
          
          <div style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 400 }}>
            {isNew && isJarvis ? <TypewriterText text={msg.content} /> : msg.content}
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: 8,
            borderTop: isJarvis ? '1px solid rgba(255,255,255,0.05)' : 'none',
            paddingTop: 4
          }}>
             <span style={{ fontSize: '9px', color: isJarvis ? '#4a4a6a' : 'rgba(255,255,255,0.5)' }}>
               {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
             {isJarvis && msg.model === 'gemini' && (
               <span style={{ fontSize: '9px', color: '#00d4ff', fontWeight: 600, opacity: 0.8 }}>v2.0 Flash</span>
             )}
          </div>
        </div>
      </div>

      {!isJarvis && (
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
          👤
        </div>
      )}
    </motion.div>
  )
}
