import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilmStripTransition from '../components/FilmStripTransition'

export default function HomePage() {
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)

  const handleEnter = () => {
    if (transitioning) return
    setTransitioning(true)
  }

  const handleTransitionComplete = () => {
    navigate('/archive')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleEnter()
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <FilmReel />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 24,
          color: 'var(--orange)',
          textShadow: '0 0 10px var(--orange), 0 0 20px rgba(255,107,53,0.4), 0 0 40px rgba(255,107,53,0.2)',
          lineHeight: 1.8,
          textTransform: 'uppercase',
          margin: 0,
        }}>
          PRODUCT FILM ROOM
        </h1>

        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          margin: 0,
          maxWidth: 480,
        }}>
          "Where product strategy gets broken down, frame by frame."
        </p>

        <button
          onClick={handleEnter}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--bg-base)',
            textTransform: 'uppercase',
            background: 'var(--orange)',
            border: 'none',
            padding: '16px 32px',
            cursor: 'pointer',
            lineHeight: 1.8,
            marginTop: 16,
            transition: 'box-shadow 0.12s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 16px var(--glow-orange), 0 0 32px var(--glow-orange)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          {'> ENTER THE FILM ROOM'}
        </button>
      </div>

      <FilmStripTransition isVisible={transitioning} onComplete={handleTransitionComplete} />
    </div>
  )
}

function FilmReel() {
  const holes = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2
    const r = 52
    return {
      cx: 100 + Math.cos(angle) * r,
      cy: 100 + Math.sin(angle) * r,
    }
  })

  return (
    <svg
      width={200}
      height={200}
      viewBox="0 0 200 200"
      style={{
        position: 'absolute',
        opacity: 0.12,
        stroke: 'var(--border)',
        fill: 'none',
        animation: 'spin 20s linear infinite',
        zIndex: 0,
      }}
    >
      <circle cx={100} cy={100} r={90} strokeWidth={3} />
      <circle cx={100} cy={100} r={20} strokeWidth={3} />
      {holes.map((h, i) => (
        <circle key={i} cx={h.cx} cy={h.cy} r={12} strokeWidth={2} />
      ))}
    </svg>
  )
}
