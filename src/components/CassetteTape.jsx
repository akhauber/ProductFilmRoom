import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CassetteTape({ episode, isNewest = false, onPlay, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const tapeRef = useRef(null)

  const accentColor = index % 2 === 0 ? 'var(--orange)' : 'var(--purple)'

  const handleClick = () => {
    if (!onPlay) return
    const rect = tapeRef.current?.getBoundingClientRect()
    onPlay(episode.id, rect)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 200,
              background: 'var(--bg-container)',
              border: '1px solid var(--green)',
              boxShadow: '0 0 12px var(--glow-green), 0 0 24px var(--glow-green)',
              padding: '12px',
              zIndex: 100,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: 'var(--orange)',
              lineHeight: 1.8,
              marginBottom: 8,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {episode.title}
            </div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              marginBottom: 8,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {episode.description}
            </div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}>
              {episode.date}
            </div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: 'var(--green)',
              textTransform: 'uppercase',
            }}>
              {'> PLAY EPISODE'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={tapeRef}
        onClick={handleClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          rotateX: -15,
          y: -8,
          transition: { duration: 0.12, ease: 'easeOut' },
        }}
        style={{
          width: 120,
          height: 20,
          background: 'var(--bg-container)',
          border: hovered ? '1px solid var(--green)' : '1px solid var(--border)',
          boxShadow: hovered
            ? '0 0 12px var(--glow-green), 0 0 24px var(--glow-green)'
            : 'none',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          perspective: 300,
          transformStyle: 'preserve-3d',
          display: 'flex',
          flexDirection: 'column',
          transition: 'border-color 0.12s ease-out, box-shadow 0.12s ease-out',
        }}
      >
        {/* Accent stripe */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: accentColor,
        }} />

        {/* Spine content */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 4px 0',
          flex: 1,
          overflow: 'hidden',
        }}>
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 6,
            color: 'var(--gold)',
            whiteSpace: 'nowrap',
            lineHeight: 1.8,
            flexShrink: 0,
          }}>
            {episode.episode}
          </span>

          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.8,
            flex: 1,
            textTransform: 'uppercase',
          }}>
            {episode.title}
          </span>

          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 9,
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {episode.date}
          </span>

          {isNewest && (
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 6,
              color: 'var(--green)',
              animation: 'blink 1s step-end infinite',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              ● NEW
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
