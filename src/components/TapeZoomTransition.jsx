import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function TapeZoomTransition({ episodeId, originRect, onComplete }) {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/episode/${episodeId}`)
      onComplete?.()
    }, 520)
    return () => clearTimeout(timer)
  }, [episodeId, navigate, onComplete])

  if (!originRect) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 200,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ scale: 1, rotate: 0, opacity: 1 }}
        animate={{
          scale: 15,
          rotate: [-2, 2, -1],
          opacity: [1, 1, 0],
        }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        style={{
          position: 'fixed',
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          background: 'var(--bg-container)',
          border: '1px solid var(--green)',
          zIndex: 201,
          pointerEvents: 'none',
          transformOrigin: 'center center',
        }}
      />
    </>
  )
}
