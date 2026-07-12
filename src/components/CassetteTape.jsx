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
      // Anchor the card below-right of the tape so it never covers neighboring tapes.
      const CARD_W = 230
      const CARD_H = 390
      const x = Math.max(12, Math.min(rect.right - 26, window.innerWidth - CARD_W - 12))
      const y = Math.min(rect.bottom + 26, window.innerHeight - CARD_H - 12)
      setCardPos({ x, y })
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
          width: 72,
          height: 280,
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

// Deterministic seeded random — same pattern as HomePage.jsx
function sr(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function TapeSpine({ episode, accentColor, hovered, isNewest }) {
  const seed = episode.id
  const labelTilt   = (sr(seed * 3 + 1) - 0.5) * 2.4          // −1.2° … +1.2°
  const stickerTilt = (sr(seed * 3 + 2) - 0.5) * 16           // −8° … +8°
  const wornCorner  = sr(seed * 3 + 3) > 0.5 ? 'tl' : 'br'    // which label corner peeled

  const TOP = 12      // height of the receding top face
  const SPINE_W = 62  // spine face width (top face overhangs to the right)

  return (
    <div style={{ position: 'absolute', inset: 0 }}>

      {/* ── Top face — cassette top receding toward the shelf back ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: SPINE_W, height: TOP,
        transform: 'skewX(-38deg)',
        transformOrigin: 'bottom left',
        background: 'linear-gradient(to bottom, #060610 0%, #14141f 100%)',
        borderTop: '1px solid rgba(255,255,255,0.10)',
        borderRight: '1px solid rgba(0,0,0,0.7)',
      }}>
        {/* Flap seam ridge on the top face */}
        <div style={{
          position: 'absolute', top: 4, left: 0, right: 0, height: 1,
          background: 'rgba(255,255,255,0.05)',
        }} />
      </div>

      {/* ── Spine face — the plastic shell ── */}
      <div style={{
        position: 'absolute', top: TOP, left: 0, bottom: 0,
        width: SPINE_W,
        borderRadius: 2,
        // Molded black plastic: near-black edges, charcoal center
        background: `
          linear-gradient(to right,
            #05050c 0%, #16161f 12%, #1b1b26 30%, #22222e 50%, #1b1b26 70%, #14141d 88%, #05050c 100%)
        `,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        boxShadow: hovered
          ? `0 0 22px ${accentColor}55, inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -2px 3px rgba(0,0,0,0.6)`
          : 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 3px rgba(0,0,0,0.6), inset -1px 0 1px rgba(0,0,0,0.5), 2px 3px 6px rgba(0,0,0,0.55)',
      }}>
        {/* Glossy sheen streak — molded plastic highlight */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '12%', width: 7,
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.10) 50%, transparent)',
        }} />

        {/* Brand print — like "RCA T-120" on the shell itself */}
        <div style={{
          position: 'absolute', top: 7, left: 0, right: 0,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: 'rgba(240,236,250,0.85)',
            lineHeight: 1,
            letterSpacing: '0.05em',
          }}>
            PFR
          </div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 7,
            fontWeight: 'bold',
            color: 'rgba(240,236,250,0.5)',
            lineHeight: 1,
            marginTop: 4,
            letterSpacing: '0.08em',
          }}>
            T-120
          </div>
        </div>

        {/* ── Long paper label — runs nearly the full spine like the reference ── */}
        <div style={{
          position: 'absolute',
          top: 32, bottom: 32, left: 5, right: 5,
          transform: `rotate(${labelTilt}deg)`,
          background: 'linear-gradient(165deg, #f4efe2 0%, #eae3d0 55%, #f0eadb 100%)',
          borderRadius: 1,
          boxShadow: '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8)',
          overflow: 'hidden',
          clipPath: wornCorner === 'tl'
            ? 'polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 5px)'
            : 'polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 6px) 100%, 0 100%)',
        }}>
          {/* Stripe stack — top of label, like the color bands in the reference */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
            <div style={{ height: 5, background: accentColor, opacity: 0.9 }} />
            <div style={{ height: 4, background: accentColor, opacity: 0.55, marginTop: 2 }} />
            <div style={{ height: 3, background: accentColor, opacity: 0.3, marginTop: 2 }} />
          </div>

          {/* Title — vertical, fills the label */}
          <div style={{
            position: 'absolute', top: 22, bottom: 40, left: 1, right: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <span style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: 13,
              color: '#241831',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {episode.spineTitle || episode.title}
            </span>
          </div>

          {/* Episode number — label bottom */}
          <span style={{
            position: 'absolute', bottom: 20, left: 0, right: 0,
            fontFamily: "'Permanent Marker', cursive",
            fontSize: 10,
            color: '#251508', lineHeight: 1,
            textAlign: 'center',
          }}>
            {String(episode.id).padStart(3, '0')}
          </span>

          {/* Date — very bottom of label */}
          <span style={{
            position: 'absolute', bottom: 6, left: 0, right: 0,
            fontFamily: "'Permanent Marker', cursive",
            fontSize: 8,
            color: 'rgba(30,12,4,0.6)',
            lineHeight: 1,
            textAlign: 'center',
          }}>
            {(() => { const [y, m, d] = episode.date.split('-'); return `${m}/${d}/${y.slice(2)}` })()}
          </span>
        </div>

        {/* ── VHS logo sticker — bottom black area, classic rainbow-over-VHS mark ── */}
        <div style={{
          position: 'absolute', bottom: 6, left: '50%',
          transform: `translateX(-50%) rotate(${stickerTilt * 0.3}deg)`,
          width: 34, height: 18,
          background: '#0d0d14',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
        }}>
          {/* Rainbow stripes */}
          <div style={{ display: 'flex', height: 5 }}>
            <div style={{ flex: 1, background: '#e03a2f' }} />
            <div style={{ flex: 1, background: '#f08c1e' }} />
            <div style={{ flex: 1, background: '#f4c81f' }} />
          </div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 8, fontWeight: 'bold',
            fontStyle: 'italic',
            color: '#f0ecfa',
            textAlign: 'center',
            lineHeight: '12px',
            letterSpacing: '0.05em',
          }}>
            VHS
          </div>
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
          {episode.episode} · {(() => { const [y,m,d] = episode.date.split('-'); return `${m}-${d}-${y}` })()}
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

      {/* Episode thumbnail — falls back to reel windows if the image is missing */}
      <Thumbnail episode={episode} />

      {/* Description + CTA */}
      <div style={{ padding: '11px 14px 13px' }}>
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          color: '#c4b8e8',
          lineHeight: 1.65,
          margin: '0 0 9px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
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

function Thumbnail({ episode }) {
  const [imgError, setImgError] = useState(false)

  if (episode.graphicPath && !imgError) {
    return (
      <img
        src={episode.graphicPath}
        alt={episode.title}
        onError={() => setImgError(true)}
        style={{
          width: '100%',
          display: 'block',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      />
    )
  }

  // Fallback: original reel-window housing
  return (
    <div style={{
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.4))',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <ReelWindow />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <div style={{ width: '100%', height: 1.5, background: 'rgba(80,60,40,0.6)', borderRadius: 1 }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.05em' }}>
          T-120
        </div>
        <div style={{ width: '100%', height: 1.5, background: 'rgba(80,60,40,0.6)', borderRadius: 1 }} />
      </div>
      <ReelWindow />
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
