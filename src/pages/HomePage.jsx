import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomeTransition from '../components/HomeTransition'

// ─── Company data ─────────────────────────────────────────────────────────────
// To use real logos: set logoPath to '/logos/ramp.png' and drop the file in /public/logos/
// To add more companies: extend this array — physics handles any count
const COMPANIES = [
  { name: 'RAMP',        color: '#ccff00', logoPath: '/logos/ramp.png',         pad: 4  },
  { name: 'BREX',        color: '#a78bfa', logoPath: '/logos/brex.png',         pad: 8,  invert: true },
  { name: 'STRIPE',      color: '#635BFF', logoPath: '/logos/stripe.jpg',       pad: 12 },
  { name: 'PAYPAL',      color: '#003087', logoPath: '/logos/paypal.png',       pad: 0  },
  { name: 'JIRA',        color: '#0052CC', logoPath: '/logos/jira.svg',         pad: 10 },
  { name: 'FIGMA',       color: '#F24E1E', logoPath: '/logos/figma.png',        pad: 14 },
  { name: 'NOTION',      color: '#e2d9f3', logoPath: '/logos/notion.png',       pad: 14, invert: true },
  { name: 'ANTHROPIC',   color: '#D97757', logoPath: '/logos/anthropic.svg',    pad: 18 },
  { name: 'META',        color: '#0082FB', logoPath: '/logos/meta.png',         pad: 16 },
  { name: 'CAPITAL ONE', color: '#D03027', logoPath: '/logos/capitalone.png',   pad: 14 },
  { name: 'DROPBOX',     color: '#0061FF', logoPath: '/logos/dropbox.png',      pad: 14 },
  { name: 'GITHUB',      color: '#e2d9f3', logoPath: '/logos/github.png',       pad: 18, invert: true },
  { name: 'INSTAGRAM',   color: '#E1306C', logoPath: '/logos/instagram.png',    pad: 14 },
  { name: 'SLACK',       color: '#4A154B', logoPath: '/logos/slack.png',        pad: 12 },
  { name: 'SERVICENOW',  color: '#62D84E', logoPath: '/logos/servicenow.svg',   pad: 10 },
  { name: 'PLAID',       color: '#00C9A7', logoPath: '/logos/plaid.jpg',        pad: 8  },
  { name: 'BLOCK',       color: '#3E4348', logoPath: '/logos/block.svg',        pad: 10, invert: true },
]

const PARTICLE_COUNT = COMPANIES.length

// ─── Deterministic seeded random ─────────────────────────────────────────────
function sr(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// ─── Physics-based floating logos ────────────────────────────────────────────
// Particles move freely and bounce off walls and each other (elastic collision).
// DOM is updated directly via refs — zero React re-renders during animation.
function FloatingLogos({ companies, count = PARTICLE_COUNT, heroRef }) {
  const elemsRef = useRef([])
  const stateRef = useRef(null)
  const rafRef   = useRef(null)

  const initData = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const co   = companies[i]
      const size = 90
      const spd  = sr(i * 7 + 4) * 4 + 3     // 3-7 px/s
      const ang  = sr(i * 7 + 5) * Math.PI * 2
      return {
        id: i, ...co, size,
        r:     size / 2,
        vx:    Math.cos(ang) * spd,
        vy:    Math.sin(ang) * spd,
        alpha: sr(i * 7 + 8) * 0.10 + 0.12,  // 0.12–0.22, muted
      }
    }),
  [companies, count])

  useEffect(() => {
    // Build a fine grid over the viewport, exclude cells overlapping the hero,
    // then evenly sample from the remaining candidates — logos spread all around the card.
    const W = window.innerWidth
    const H = window.innerHeight
    const n = initData.length
    const hero = heroRef?.current?.getBoundingClientRect()

    const GCOLS = 9, GROWS = 6
    const cw = W / GCOLS, ch = H / GROWS
    const pad = 55 // clearance around hero

    const candidates = []
    for (let r = 0; r < GROWS; r++) {
      for (let c = 0; c < GCOLS; c++) {
        const x = (c + 0.5) * cw
        const y = (r + 0.5) * ch
        if (hero &&
          x > hero.left - pad && x < hero.right  + pad &&
          y > hero.top  - pad && y < hero.bottom + pad) continue
        candidates.push({ x, y })
      }
    }

    // Evenly sample n positions from the candidates list, then jitter within the cell
    const positions = Array.from({ length: n }, (_, i) => {
      const idx = Math.round(i * (candidates.length - 1) / Math.max(n - 1, 1))
      const base = candidates[idx] ?? candidates[candidates.length - 1]
      return {
        x: base.x + (sr(i * 13 + 1) - 0.5) * cw * 0.7,
        y: base.y + (sr(i * 13 + 2) - 0.5) * ch * 0.7,
      }
    })

    stateRef.current = initData.map((d, i) => {
      const { x, y } = positions[i]

      return { ...d, x, y }
    })

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

        // Bounce off hero panel
        const hero = heroRef?.current?.getBoundingClientRect()
        if (hero) {
          const closestX = Math.max(hero.left, Math.min(p.x, hero.right))
          const closestY = Math.max(hero.top,  Math.min(p.y, hero.bottom))
          const dx = p.x - closestX
          const dy = p.y - closestY
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001
          if (dist < p.r) {
            const nx = dx / dist
            const ny = dy / dist
            p.x += nx * (p.r - dist)
            p.y += ny * (p.r - dist)
            const dot = p.vx * nx + p.vy * ny
            if (dot < 0) {
              p.vx -= 2 * dot * nx
              p.vy -= 2 * dot * ny
            }
          }
        }
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
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: p.pad || 0, filter: `${p.invert ? 'invert(1) ' : ''}drop-shadow(0 0 8px ${p.color}99)` }}
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

  return null
}

// ─── Home page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)
  const heroRef = useRef(null)

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
      <FloatingLogos companies={COMPANIES} count={PARTICLE_COUNT} heroRef={heroRef} />

      {/* ── Glass hero panel ── */}
      <div ref={heroRef} style={{
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
          Film study for product & strategy decisions
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
          {'> EXPLORE'}
        </button>
      </div>

      <HomeTransition
        isVisible={transitioning}
        onComplete={() => navigate('/archive')}
      />
    </div>
  )
}
