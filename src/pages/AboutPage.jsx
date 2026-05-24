import { useState } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { label: '> LINKEDIN',  href: '#' },
  { label: '> INSTAGRAM', href: '#' },
  { label: '> SUBSTACK',  href: 'https://productfilmroom.substack.com' },
]

const STATS = [
  { label: '3 PT.', pct: 80 },
  { label: 'SPEED', pct: 75 },
  { label: 'DUNK',  pct: 5  },
  { label: 'DEF.',  pct: 70 },
]

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '96px 48px 48px',
      }}
    >
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 10,
        color: 'var(--purple)',
        lineHeight: 1.8,
        textTransform: 'uppercase',
        marginBottom: 40,
      }}>
        ABOUT THE AUTHOR
      </div>

      <PlayerCard />

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 40 }}>
        {LINKS.map(({ label, href }) => (
          <ExternalLink key={label} label={label} href={href} />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Flippable basketball card ─────────────────────────────────────────────────
// Front: full-bleed image from /public/card-front.png
// Back:  bio + stat bars
// Click anywhere on the card to flip.
function PlayerCard() {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      style={{
        width: 340,
        height: 476,
        perspective: 1400,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => setFlipped(f => !f)}
      title={flipped ? 'Click to flip back' : 'Click to flip'}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          border: '3px solid var(--border)',
          borderRadius: 4,
          overflow: 'hidden',
          background: '#0a0020',
          boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 32px rgba(74,45,138,0.3)',
        }}>
          <img
            src="/card-front.png"
            alt="Andrew Hauber"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
            onError={e => { e.currentTarget.style.visibility = 'hidden' }}
          />
          {/* flip hint */}
          <div style={{
            position: 'absolute',
            bottom: 7, right: 8,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 4.5,
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.8,
            pointerEvents: 'none',
          }}>
            TAP TO FLIP ▶
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 4,
          overflow: 'hidden',
          border: '3px solid var(--border)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 32px rgba(74,45,138,0.3)',
          background: 'linear-gradient(170deg, #1c0e42 0%, #2d1b5e 45%, #1a0a38 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 14px 10px',
        }}>

          {/* Header */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 5.5,
            color: 'var(--orange)',
            letterSpacing: '0.1em',
            lineHeight: 1.8,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            PRODUCT FILM ROOM
          </div>

          <div style={{
            height: 1,
            background: 'linear-gradient(to right, transparent, var(--border), transparent)',
            marginBottom: 10,
          }} />

          {/* Name */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 14,
            color: 'var(--gold)',
            letterSpacing: '0.05em',
            lineHeight: 1.3,
            textShadow: '0 0 16px rgba(255,215,0,0.4)',
            marginBottom: 4,
          }}>
            HAUBER
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 5,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            marginBottom: 12,
          }}>
            #3 · SHOOTING GUARD
          </div>

          {/* Bio */}
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 10.5,
            color: 'var(--text-primary)',
            lineHeight: 1.7,
            margin: '0 0 12px',
            flex: 1,
          }}>
            Product leader and writer focused on fintech and B2B software. Breaks down competitive dynamics, strategy, and market positioning — one episode at a time.
          </p>

          <div style={{
            height: 1,
            background: 'linear-gradient(to right, transparent, var(--border), transparent)',
            marginBottom: 10,
          }} />

          {/* Stat bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STATS.map(({ label, pct }) => (
              <StatBar key={label} label={label} pct={pct} />
            ))}
          </div>

          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 4.5,
            color: 'rgba(255,255,255,0.2)',
            textAlign: 'center',
            lineHeight: 1.8,
            marginTop: 8,
          }}>
            ◀ TAP TO FLIP
          </div>
        </div>

      </div>
    </div>
  )
}

function StatBar({ label, pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      {/* Track */}
      <div style={{
        flex: 1,
        height: 9,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Fill */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, bottom: 0,
          width: `${pct}%`,
          background: '#39ff14',
          boxShadow: '0 0 6px #39ff14, 0 0 12px rgba(57,255,20,0.3)',
        }} />
      </div>
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 5.5,
        color: '#f0d060',
        width: 38,
        flexShrink: 0,
        lineHeight: 1,
      }}>
        {label}
      </span>
    </div>
  )
}

function ExternalLink({ label, href }) {
  return (
    <a
      href={href}
      target={href !== '#' ? '_blank' : undefined}
      rel={href !== '#' ? 'noreferrer' : undefined}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 7,
        color: 'var(--purple)',
        textDecoration: 'none',
        textTransform: 'uppercase',
        background: 'transparent',
        border: '1px solid var(--purple)',
        padding: '12px 20px',
        lineHeight: 1.8,
        display: 'inline-block',
        transition: 'border-color 80ms ease, color 80ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--green)'
        e.currentTarget.style.color = 'var(--green)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--purple)'
        e.currentTarget.style.color = 'var(--purple)'
      }}
    >
      {label}
    </a>
  )
}
