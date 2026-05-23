import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Iris-out: transparent circle shrinks from full screen to nothing.
// The massive box-shadow fills everything outside the circle in the bg color,
// so as the circle closes, the scene fades into black from the edges inward.
export default function HomeTransition({ isVisible, onComplete }) {
  useEffect(() => {
    if (!isVisible) return
    const t = setTimeout(onComplete, 1100)
    return () => clearTimeout(t)
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: '250vmax', height: '250vmax' }}
        animate={{ width: 0, height: 0 }}
        transition={{ duration: 1.0, ease: [0.4, 0, 0.9, 1] }}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          boxShadow: '0 0 0 3000px #06001a',
        }}
      />
    </div>
  )
}
