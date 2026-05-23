import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomeTransition from '../components/HomeTransition'

// ─── Company data ─────────────────────────────────────────────────────────────
// To use real logos: set logoPath to '/logos/ramp.png' and drop the file in /public/logos/
// To add more companies: extend this array — physics handles any count
const COMPANIES = [
  { name: 'RAMP',    color: '#ff6b35', logoPath: null },
  { name: 'BREX',    color: '#a78bfa', logoPath: null },
  { name: 'STRIPE',  color: '#ffd700', logoPath: null },
  { name: 'PAYPAL',  color: '#39ff14', logoPath: null },
  { name: 'LINEAR',  color: '#ff6b35', logoPath: null },
  { name: 'JIRA',    color: '#a78bfa', logoPath: null },
  { name: 'FIGMA',   color: '#ffd700', logoPath: null },
  { name: 'NOTION',  color: '#e2d9f3', logoPath: null },
  { name: 'VERCEL',  color: '#a78bfa', logoPath: null },
  { name: 'GITHUB',  color: '#ffd700', logoPath: null },
  { name: 'LOOM',    color: '#ff6b35', logoPath: null },
  { name: 'SLACK',   color: '#39ff14', logoPath: null },
]

const PARTICLE_COUNT = 22

// ─── Deterministic seeded random ─────────────────────────────────────────────
function sr(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// ─── Physics-based floating logos ────────────────────────────────────────────
// Particles move freely and bounce off walls and each other (elastic collision).
// DOM is updated directly via refs — zero React re-renders during animation.
function FloatingLogos({ companies, count = PARTICLE_COUNT }) {
  const elemsRef = useRef([])
  const stateRef = useRef(null)
  const rafRef   = useRef(null)

  const initData = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const co   = companies[i % companies.length]
      const size = sr(i * 7 + 3) * 42 + 44   // 44–86 px
      const spd  = sr(i * 7 + 4) * 10 + 12   // 12-22 px/s
      const ang  = sr(i * 7 + 5) * Math.PI * 2
      return {
        id: i, ...co, size,
        r:     size / 2,
        xPct:  sr(i * 7 + 1) * 76 + 12,
        yPct:  sr(i * 7 + 2) * 76 + 12,
        vx:    Math.cos(ang) * spd,
        vy:    Math.sin(ang) * spd,
        alpha: sr(i * 7 + 8) * 0.22 + 0.10,
      }
    }),
  [companies, count])

  useEffect(() => {
    // Convert % to px using current viewport
    stateRef.current = initData.map(d => ({
      ...d,
      x: (d.xPct / 100) * window.innerWidth,
      y: (d.yPct / 100) * window.innerHeight,
    }))

    let lastTime = null

    const tick = (now) => {
      if (lastTime === null) lastTime = now
      const dt  = Math.min((now - lastTime) / 1000, 0.05)
      lastTime  = now

      const state = stateRef.current
      const W     = window.innerWidth
      const H     = window.innerHeight

      // 1 — integrate positions
      for (const p of state) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.x < p.r)     { p.x = p.r;     p.vx =  Math.abs(p.vx) }
        if (p.x > W - p.r) { p.x = W - p.r; p.vx = -Math.abs(p.vx) }
        if (p.y < p.r)     { p.y = p.r;     p.vy =  Math.abs(p.vy) }
        if (p.y > H - p.r) { p.y = H - p.r; p.vy = -Math.abs(p.vy) }
      }

      // 2 — elastic collision (O(n²), fine for n ≤ 30)
      for (let i = 0; i < state.length - 1; i++) {
        for (let j = i + 1; j < state.length; j++) {
          const a = state[i], b = state[j]
          const dx      = b.x - a.x
          const dy      = b.y - a.y
          const distSq  = dx * dx + dy * dy
          const minDist = a.r + b.r
          if (distSq >= minDist * minDist) continue

          const dist    = Math.sqrt(distSq) || 0.001
          const nx      = dx / dist
          const ny      = dy / dist
          const overlap = (minDist - dist) * 0.5

          // Push apart so they no longer overlap
          a.x -= nx * overlap;  a.y -= ny * overlap
          b.x += nx * overlap;  b.y += ny * overlap

          // Reflect velocity components along collision normal
          const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
          if (dot > 0) {
            a.vx -= dot * nx;  a.vy -= dot * ny
            b.vx += dot * nx;  b.vy += dot * ny
          }
        }
      }

      // 3 — write positions directly to DOM (no React re-render)
      state.forEach((p, i) => {
        const el = elemsRef.current[i]
        if (el) el.style.transform = `translate(${p.x - p.r}px, ${p.y - p.r}px)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [initData])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {initData.map((p, i) => (
        <div
          key={p.id}
          ref={el => { elemsRef.current[i] = el }}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: p.size, height: p.size,
            opacity: p.alpha,
            willChange: 'transform',
          }}
        >
          {p.logoPath ? (
            <img
              src={p.logoPath} alt={p.name} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0.8)' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 6,
              border: `1px solid ${p.color}38`,
              background: `${p.color}0d`,
            }}>
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: Math.max(5, Math.round(p.size * 0.11)),
                color: p.color,
                textAlign: 'center',
                lineHeight: 1.5,
                padding: 4,
              }}>
                {p.name}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Logo image ───────────────────────────────────────────────────────────────
// Drop your logo at /public/logo.png (or .svg) to replace the placeholder.
// Supports any image format. Recommended: transparent PNG or SVG, ~200×80 px.
function LogoImage() {
  const [err, setErr] = useState(false)

  if (!err) {
    return (
      <img
        src="/logo.png"
        alt="Product Film Room"
        onError={() => setErr(true)}
        style={{ height: 56, maxWidth: 220, objectFit: 'contain' }}
      />
    )
  }

  // Placeholder shown until a real logo file exists
  return (
    <div style={{
      height: 48, padding: '0 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px dashed rgba(167,139,250,0.35)',
      borderRadius: 4,
      background: 'rgba(167,139,250,0.05)',
    }}>
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 9, color: 'var(--text-muted)',
        lineHeight: 1.8, letterSpacing: '0.06em',
      }}>
        YOUR LOGO
      </span>
    </div>
  )
}

// ─── Home page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-base)',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Depth gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 70% at 50% 50%, rgba(74,45,138,0.55) 0%, transparent 65%),
          radial-gradient(ellipse 40% 40% at 20% 80%, rgba(255,107,53,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 20%, rgba(167,139,250,0.06) 0%, transparent 60%)
        `,
      }} />

      {/* Bouncing logo particles */}
      <FloatingLogos companies={COMPANIES} count={PARTICLE_COUNT} />

      {/* ── Glass hero panel ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 520,
        margin: '0 24px',
        padding: '40px 44px 36px',
        background: 'rgba(14, 5, 32, 0.65)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(167,139,250,0.2)',
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.04) inset,
          0 8px 48px rgba(0,0,0,0.6),
          0 0 80px rgba(74,45,138,0.18)
        `,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 20, textAlign: 'center',
      }}>

        {/* Logo — drop /public/logo.png to replace */}
        <LogoImage />

        {/* Wordmark */}
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(13px, 2.4vw, 22px)',
          color: 'var(--orange)',
          textShadow: '0 0 18px var(--orange), 0 0 40px rgba(255,107,53,0.45), 0 0 80px rgba(255,107,53,0.15)',
          lineHeight: 1.8, letterSpacing: '0.04em',
          textTransform: 'uppercase',
          margin: 0, width: '100%', textAlign: 'center',
        }}>
          PRODUCT FILM ROOM
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 14, color: '#c4b8e8',
          lineHeight: 1.7, margin: 0, maxWidth: 380,
        }}>
          Where product strategy gets broken down, frame by frame.
        </p>

        {/* Divider */}
        <div style={{
          width: '100%', height: 1, flexShrink: 0,
          background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.45) 30%, rgba(255,107,53,0.35) 70%, transparent)',
        }} />

        {/* Enter button — only click, no keyboard shortcut */}
        <button
          onClick={() => { if (!transitioning) setTransitioning(true) }}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9, color: 'var(--bg-base)',
            background: 'var(--orange)',
            border: 'none', cursor: 'pointer',
            padding: '17px 44px',
            lineHeight: 1.8, letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 0 24px rgba(255,107,53,0.45), 0 4px 16px rgba(0,0,0,0.4)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.03)'
            e.currentTarget.style.boxShadow = '0 0 40px rgba(255,107,53,0.65), 0 4px 20px rgba(0,0,0,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 0 24px rgba(255,107,53,0.45), 0 4px 16px rgba(0,0,0,0.4)'
          }}
        >
          {'> ENTER THE FILM ROOM'}
        </button>
      </div>

      <HomeTransition
        isVisible={transitioning}
        onComplete={() => navigate('/archive')}
      />
    </div>
  )
}
