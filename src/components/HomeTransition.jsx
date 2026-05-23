import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Cinematic letterbox: two black bars snap in from top/bottom, orange burn line
// appears at the seam, projector flash fires, screen goes black → navigate.
const EASE = [0.76, 0, 0.24, 1]

export default function HomeTransition({ isVisible, onComplete }) {
  useEffect(() => {
    if (!isVisible) return
    const t = setTimeout(onComplete, 600)
    return () => clearTimeout(t)
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none' }}>

      {/* Top bar */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.34, ease: EASE }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: '#000',
        }}
      />

      {/* Bottom bar */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.34, ease: EASE }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: '#000',
        }}
      />

      {/* Orange burn line — appears as bars close */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.32, delay: 0.28, times: [0, 0.18, 0.65, 1], ease: 'easeOut' }}
        style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 2, marginTop: -1,
          background: 'var(--orange)',
          boxShadow: '0 0 14px rgba(255,107,53,0.9), 0 0 40px rgba(255,107,53,0.4)',
          transformOrigin: 'center',
        }}
      />

      {/* Projector flash — fires just as bars meet */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0] }}
        transition={{ duration: 0.18, delay: 0.30, times: [0, 0.45, 1] }}
        style={{ position: 'absolute', inset: 0, background: '#fff' }}
      />

      {/* Hold black */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.01, delay: 0.34 }}
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      />
    </div>
  )
}
