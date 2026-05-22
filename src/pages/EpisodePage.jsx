import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { episodes } from '../data/episodes'

export default function EpisodePage() {
  const { id } = useParams()
  const episode = episodes.find(ep => ep.id === Number(id))

  if (!episode) {
    return (
      <div style={{ padding: '120px 48px', textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: 'var(--orange)',
          lineHeight: 1.8,
          textTransform: 'uppercase',
        }}>
          EPISODE NOT FOUND
        </div>
      </div>
    )
  }

  const sortedEpisodes = [...episodes].sort((a, b) => a.id - b.id)
  const currentIndex = sortedEpisodes.findIndex(ep => ep.id === episode.id)
  const prevEp = sortedEpisodes[currentIndex - 1] || null
  const nextEp = sortedEpisodes[currentIndex + 1] || null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '96px 48px 48px',
      }}
    >
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 10,
        color: 'var(--gold)',
        lineHeight: 1.8,
        textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        {episode.episode}
      </div>

      <h1 style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 20,
        color: 'var(--orange)',
        textShadow: '0 0 10px var(--orange), 0 0 20px rgba(255,107,53,0.4)',
        lineHeight: 1.8,
        textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        {episode.title}
      </h1>

      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        color: 'var(--text-muted)',
        lineHeight: 1.8,
        marginBottom: 8,
      }}>
        {episode.subtitle}
      </div>

      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 10,
        color: 'var(--text-muted)',
        lineHeight: 1.8,
        marginBottom: 40,
      }}>
        {episode.date}
      </div>

      <GraphicBlock episode={episode} />

      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        color: 'var(--text-primary)',
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap',
        marginBottom: 48,
      }}>
        {episode.content}
      </div>

      <a
        href={episode.substackUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-block',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: 'var(--orange)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          background: 'transparent',
          border: '1px solid var(--orange)',
          padding: '12px 24px',
          lineHeight: 1.8,
          marginBottom: 64,
          cursor: 'pointer',
          transition: 'background 0.12s ease, color 0.12s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--glow-orange)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        {'> READ ON SUBSTACK'}
      </a>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        borderTop: '1px solid var(--border)',
        paddingTop: 32,
      }}>
        <NavButton ep={prevEp} direction="prev" />
        <NavButton ep={nextEp} direction="next" />
      </div>
    </motion.div>
  )
}

function GraphicBlock({ episode }) {
  const [imgError, setImgError] = useState(false)

  if (episode.graphicPath && !imgError) {
    return (
      <img
        src={episode.graphicPath}
        alt={episode.title}
        onError={() => setImgError(true)}
        style={{ width: '100%', display: 'block', marginBottom: 40 }}
      />
    )
  }

  return (
    <div style={{
      width: '100%',
      height: 300,
      background: 'var(--bg-container)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    }}>
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 10,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        lineHeight: 1.8,
      }}>
        [ NO GRAPHIC ]
      </span>
    </div>
  )
}

function NavButton({ ep, direction }) {
  const isDisabled = !ep
  const label = direction === 'prev'
    ? ep ? `< EP. ${String(ep.id).padStart(3, '0')} — ${ep.title.toUpperCase()}` : '< PREV'
    : ep ? `EP. ${String(ep.id).padStart(3, '0')} — ${ep.title.toUpperCase()} >` : 'NEXT >'

  const baseStyle = {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 7,
    textTransform: 'uppercase',
    lineHeight: 1.8,
    background: 'var(--bg-container)',
    border: '1px solid var(--border)',
    padding: '10px 16px',
    textDecoration: 'none',
    display: 'inline-block',
    maxWidth: '45%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: isDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
    cursor: isDisabled ? 'default' : 'pointer',
  }

  if (isDisabled) {
    return <div style={baseStyle}>{label}</div>
  }

  return (
    <Link
      to={`/episode/${ep.id}`}
      style={baseStyle}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--green)'
        e.currentTarget.style.boxShadow = '0 0 8px var(--glow-green)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {label}
    </Link>
  )
}
