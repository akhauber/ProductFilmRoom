import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const frames = ['PFR', 'PFR', 'PFR', 'PFR']

export default function FilmStripTransition({ isVisible, onComplete }) {
  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(() => {
      onComplete?.()
    }, 700)
    return () => clearTimeout(timer)
  }, [isVisible, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{
            enter: { duration: 0.4, ease: 'easeInOut' },
            exit: { duration: 0.3, ease: 'easeInOut' },
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <div style={sprocketRowStyle} />

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flex: 1,
            alignItems: 'center',
          }}>
            {frames.map((label, i) => (
              <div key={i} style={frameStyle}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 14,
                  color: 'var(--orange)',
                  textTransform: 'uppercase',
                  textShadow: '0 0 10px var(--orange)',
                  lineHeight: 1.8,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div style={sprocketRowStyle} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const sprocketRowStyle = {
  height: 48,
  background: '#111',
  backgroundImage: 'radial-gradient(circle, #333 10px, transparent 10px)',
  backgroundSize: '64px 48px',
  backgroundRepeat: 'repeat-x',
  backgroundPosition: '16px center',
  flexShrink: 0,
}

const frameStyle = {
  width: 220,
  height: 160,
  border: '2px solid #333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0a0a0a',
  flexShrink: 0,
}
