import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BANDS = [
  { top: '12%', h: 36, color: 'rgba(255,107,53,0.18)', delay: 0.04, dx: 12  },
  { top: '31%', h: 18, color: 'rgba(167,139,250,0.14)', delay: 0.09, dx: -9 },
  { top: '49%', h: 52, color: 'rgba(255,107,53,0.12)', delay: 0.02, dx: 16  },
  { top: '68%', h: 22, color: 'rgba(167,139,250,0.16)', delay: 0.07, dx: -6 },
  { top: '82%', h: 14, color: 'rgba(255,215,0,0.10)',   delay: 0.05, dx: 10 },
]

export default function HomeTransition({ isVisible, onComplete }) {
  useEffect(() => {
    if (!isVisible) return
    const t = setTimeout(onComplete, 560)
    return () => clearTimeout(t)
  }, [isVisible, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
          position: 'fixed', inset: 0,
          zIndex: 500, overflow: 'hidden', pointerEvents: 'none',
        }}>

          {/* Horizontal glitch bands — slice across screen with lateral offset */}
          {BANDS.map((b, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, x: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1,    1,    0   ],
                x:      [0, b.dx, b.dx, 0   ],
                opacity:[0, 1,    1,    0   ],
              }}
              transition={{ duration: 0.28, delay: b.delay, times: [0, 0.25, 0.72, 1], ease: 'easeOut' }}
              style={{
                position: 'absolute', top: b.top, left: 0, right: 0,
                height: b.h, background: b.color,
                transformOrigin: 'left center',
                mixBlendMode: 'screen',
              }}
            />
          ))}

          {/* RGB channel split — red layer right, cyan layer left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0, 0.35, 0] }}
            transition={{ duration: 0.22, delay: 0.08, times: [0, 0.15, 0.4, 0.65, 1] }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,40,40,0.09)',
              transform: 'translateX(6px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0, 0.35, 0] }}
            transition={{ duration: 0.22, delay: 0.08, times: [0, 0.15, 0.4, 0.65, 1] }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,220,120,0.07)',
              transform: 'translateX(-6px)',
            }}
          />

          {/* Orange shockwave ring — expands from center and fades */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.15, 0, 0.85, 1] }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 160, height: 160,
              marginTop: -80, marginLeft: -80,
              borderRadius: '50%',
              border: '2px solid var(--orange)',
              boxShadow: '0 0 32px rgba(255,107,53,0.7), inset 0 0 32px rgba(255,107,53,0.2)',
            }}
          />

          {/* Second, larger delayed ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 12, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.15, 0, 0.85, 1] }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 160, height: 160,
              marginTop: -80, marginLeft: -80,
              borderRadius: '50%',
              border: '1px solid rgba(167,139,250,0.6)',
            }}
          />

          {/* Final dark cover — slides over everything */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, delay: 0.37 }}
            style={{ position: 'absolute', inset: 0, background: '#06001a' }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}
