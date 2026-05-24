import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const COLORS = ['#ff6b35', '#a78bfa', '#ffd700', '#39ff14', '#00bfff', '#ff3d8a']

export default function CassetteTape({ episode, isNewest = false, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const [cardPos, setCardPos] = useState(null)
  const leaveTimer = useRef(null)
  const spineRef = useRef(null)
  const navigate = useNavigate()
  const accentColor = COLORS[index % COLORS.length]

  const enter = () => {
    clearTimeout(leaveTimer.current)
    if (spineRef.current) {
      const rect = spineRef.current.getBoundingClientRect()
      setCardPos({ x: rect.left + rect.width / 2, y: rect.top - 14 })
    }
    setHovered(true)
  }

  const leave = () => {
    leaveTimer.current = setTimeout(() => setHovered(false), 130)
  }

  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  // Close card on scroll
  useEffect(() => {
    if (!hovered) return
    const close = () => setHovered(false)
    window.addEventListener('scroll', close, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', close, { capture: true })
  }, [hovered])

  const handleClick = () => navigate(`/episode/${episode.id}`)

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Spine */}
      <motion.div
        ref={spineRef}
        animate={hovered ? { rotateX: -14, y: -8, scale: 1.04 } : { rotateX: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleClick}
        onMouseEnter={enter}
        onMouseLeave={leave}
        style={{
          width: 38,
          height: 185,
          position: 'relative',
          cursor: 'pointer',
          transformOrigin: 'bottom center',
        }}
      >
        <TapeSpine episode={episode} accentColor={accentColor} hovered={hovered} isNewest={isNewest} />
      </motion.div>

      {/* VHS front-face card — portal escapes scrollable container overflow clipping */}
      {createPortal(
        <AnimatePresence>
          {hovered && cardPos && (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={enter}
              onMouseLeave={leave}
              onClick={handleClick}
              style={{
                position: 'fixed',
                left: cardPos.x,
                top: cardPos.y,
                transform: 'translate(-50%, -100%)',
                width: 230,
                zIndex: 9999,
                cursor: 'pointer',
                filter: `drop-shadow(0 0 18px ${accentColor}33)`,
              }}
            >
              <VHSFrontFace episode={episode} accentColor={accentColor} />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

function TapeSpine({ episode, accentColor, hovered, isNewest }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      // Plastic housing — darker at edges, slightly lighter in center
      background: 'linear-gradient(to right, #0c0c18 0%, #1c1c2c 18%, #1e1e2e 50%, #1c1c2c 82%, #0c0c18 100%)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s ease',
      boxShadow: hovered
        ? `0 0 22px ${accentColor}55, inset 0 0 0 1px rgba(255,255,255,0.1)`
        : 'inset 0 0 0 1px rgba(255,255,255,0.05), 1px 0 0 rgba(255,255,255,0.04)',
    }}>
      {/* Left bevel — raised plastic edge highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
        background: 'linear-gradient(to right, rgba(255,255,255,0.14), rgba(255,255,255,0.03))',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 3, bottom: 0, width: 1,
        background: 'rgba(0,0,0,0.55)',
      }} />

      {/* Right bevel — shadow drop */}
      <div style={{
        position: 'absolute', top: 0, right: 3, bottom: 0, width: 1,
        background: 'rgba(0,0,0,0.45)',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 3,
        background: 'linear-gradient(to left, rgba(255,255,255,0.09), rgba(255,255,255,0.02))',
      }} />

      {/* Housing seam — where the two cassette halves snap together */}
      <div style={{
        position: 'absolute', top: '44%', left: 0, right: 0, height: 1,
        background: 'rgba(0,0,0,0.65)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }} />

      {/* Paper label */}
      <div style={{
        position: 'absolute',
        top: 13, bottom: 13, left: 5, right: 5,
        background: 'linear-gradient(160deg, #ede5d2 0%, #e2d9c2 45%, #eae2ce 100%)',
        borderRadius: 1,
        boxShadow: '0 0 0 0.5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.75)',
        overflow: 'hidden',
      }}>
        {/* Faint paper grain */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.018) 2px, rgba(0,0,0,0.018) 3px),
            repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(0,0,0,0.012) 5px, rgba(0,0,0,0.012) 6px)
          `,
        }} />

        {/* Color bar — top of label */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 7,
          background: accentColor,
          opacity: 0.88,
        }} />

        {/* Color bar — bottom of label */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: accentColor,
          opacity: 0.55,
        }} />

        {/* Label text */}
        <div style={{
          position: 'absolute', top: 10, bottom: 5, left: 1, right: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 6,
            fontWeight: 'bold',
            color: '#251508',
            textAlign: 'center',
            lineHeight: 1,
            flexShrink: 0,
            letterSpacing: '0.02em',
          }}>
            {String(episode.id).padStart(3, '0')}
          </span>

          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 6.5,
            color: '#1a0e2a',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            lineHeight: 1,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            padding: '3px 0',
            display: 'block',
            width: '100%',
          }}>
            {episode.spineTitle || episode.title}
          </span>

          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 5.5,
            color: 'rgba(30,12,4,0.52)',
            lineHeight: 1,
            flexShrink: 0,
            textAlign: 'center',
          }}>
            {episode.date.slice(2, 7).replace('-', '/')}
          </span>
        </div>
      </div>

    </div>
  )
}

function VHSFrontFace({ episode, accentColor }) {
  return (
    <div style={{
      background: 'linear-gradient(155deg, #1c1c30 0%, #0d0d1c 100%)',
      border: `1px solid ${accentColor}44`,
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: `
        0 20px 50px rgba(0,0,0,0.9),
        0 0 0 1px rgba(255,255,255,0.07) inset,
        0 1px 0 rgba(255,255,255,0.1) inset
      `,
    }}>
      {/* Top plastic ridge */}
      <div style={{
        height: 4,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
        borderBottom: '1px solid rgba(0,0,0,0.4)',
      }} />

      {/* Label strip */}
      <div style={{
        background: `linear-gradient(105deg, ${accentColor}1a, ${accentColor}08)`,
        borderBottom: `1px solid ${accentColor}2a`,
        padding: '10px 14px 9px',
      }}>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 8,
          color: accentColor,
          letterSpacing: '0.1em',
          marginBottom: 5,
          opacity: 0.9,
        }}>
          {episode.episode} · {episode.date}
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8.5,
          color: '#f0ecfa',
          lineHeight: 1.7,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}>
          {episode.title}
        </div>
        {episode.subtitle && (
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 10,
            color: 'rgba(196,184,232,0.65)',
            lineHeight: 1.5,
            marginTop: 5,
            fontStyle: 'italic',
          }}>
            {episode.subtitle}
          </div>
        )}
      </div>

      {/* Reel window housing */}
      <div style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.4))',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <ReelWindow />
        {/* Tape path */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <div style={{ width: '100%', height: 1.5, background: 'rgba(80,60,40,0.6)', borderRadius: 1 }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.05em' }}>
            T-120
          </div>
          <div style={{ width: '100%', height: 1.5, background: 'rgba(80,60,40,0.6)', borderRadius: 1 }} />
        </div>
        <ReelWindow />
      </div>

      {/* Description + CTA */}
      <div style={{ padding: '11px 14px 13px' }}>
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          color: '#c4b8e8',
          lineHeight: 1.65,
          margin: '0 0 9px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {episode.description}
        </p>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7,
          color: accentColor,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ opacity: 0.7 }}>▶</span>
          {'WATCH EPISODE'}
        </div>
      </div>
    </div>
  )
}

function ReelWindow() {
  return (
    <div style={{
      width: 48, height: 48, flexShrink: 0,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #222, #080808)',
      border: '2px solid rgba(255,255,255,0.11)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      {[0, 60, 120, 180, 240, 300].map(angle => (
        <div key={angle} style={{
          position: 'absolute',
          width: 1.5,
          height: '36%',
          background: 'linear-gradient(to top, rgba(255,255,255,0.22), rgba(255,255,255,0.05))',
          transformOrigin: 'bottom center',
          bottom: '50%',
          left: '50%',
          marginLeft: -0.75,
          transform: `rotate(${angle}deg)`,
          borderRadius: 1,
        }} />
      ))}
      {/* Hub */}
      <div style={{
        width: 12, height: 12, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #555, #222)',
        border: '1px solid rgba(255,255,255,0.15)',
        zIndex: 1,
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)',
      }} />
    </div>
  )
}
