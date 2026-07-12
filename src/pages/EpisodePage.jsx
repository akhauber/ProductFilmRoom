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
        marginBottom: 6,
      }}>
        {episode.subtitle}
      </div>

      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 10,
        color: 'rgba(167,139,250,0.45)',
        letterSpacing: '0.08em',
        marginBottom: 40,
      }}>
        {(() => {
          const [y,m,d] = episode.date.split('-')
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
          return `${months[parseInt(m,10)-1]}. ${parseInt(d,10)}, ${y}`
        })()}
      </div>

      <GraphicBlock episode={episode} />

      <ContentRenderer content={episode.content} charts={episode.charts || {}} />

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
        <NavButton ep={nextEp} direction="next" />
        <NavButton ep={prevEp} direction="prev" />
      </div>
    </motion.div>
  )
}

// Splits content on [CHARTKEY] markers and renders iframes in their place.
function ContentRenderer({ content, charts }) {
  const markerRe = /(\[CHART\w+\])/g
  const parts = content.split(markerRe)

  return (
    <div style={{ marginBottom: 48 }}>
      {parts.map((part, i) => {
        const match = part.match(/^\[(\w+)\]$/)
        if (match && charts[match[1]]) {
          const chart = charts[match[1]]
          const src   = typeof chart === 'string' ? chart : chart.src
          return (
            <iframe
              key={i}
              src={src}
              scrolling="no"
              title={`chart-${match[1]}`}
              style={{
                width: '100%',
                height: 200,
                border: 'none',
                display: 'block',
                margin: '24px 0',
                overflow: 'hidden',
              }}
              onLoad={e => {
                try {
                  const doc = e.target.contentDocument || e.target.contentWindow.document
                  e.target.style.height = doc.documentElement.scrollHeight + 'px'
                } catch (_) {}
              }}
            />
          )
        }
        // Trim leading newline that appears right after a chart block
        const text = i > 0 ? part.replace(/^\n/, '') : part
        return (
          <span
            key={i}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              color: 'var(--text-primary)',
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              display: 'block',
            }}
          >
            {text}
          </span>
        )
      })}
    </div>
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
        style={{ width: '70%', maxWidth: 420, display: 'block', margin: '0 auto 40px', borderRadius: 4 }}
      />
    )
  }

  return null
}

function NavButton({ ep, direction }) {
  const isDisabled = !ep
  const label = direction === 'prev'
    ? ep ? `EP. ${String(ep.id).padStart(3, '0')} — ${ep.title.toUpperCase()} >` : 'PREV >'
    : ep ? `< EP. ${String(ep.id).padStart(3, '0')} — ${ep.title.toUpperCase()}` : '< NEXT'

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
