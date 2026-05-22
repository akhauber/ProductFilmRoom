import { useState } from 'react'
import CassetteTape from './CassetteTape'
import TapeZoomTransition from './TapeZoomTransition'

const SHELF_SIZE = 7

export default function ArchiveShelf({ episodes }) {
  const [activeTransition, setActiveTransition] = useState(null)

  const rows = []
  for (let i = 0; i < episodes.length; i += SHELF_SIZE) {
    rows.push(episodes.slice(i, i + SHELF_SIZE))
  }

  const handlePlay = (episodeId, originRect) => {
    setActiveTransition({ episodeId, originRect })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={{
          display: 'flex',
          gap: 4,
          flexWrap: 'nowrap',
          padding: '12px 8px 0',
          background: 'var(--bg-container)',
          border: '1px solid var(--border)',
          borderBottom: '4px solid #5a3a1a',
          boxShadow: '0 4px 0 #3a2010',
          marginBottom: 24,
        }}>
          {row.map((ep, i) => (
            <CassetteTape
              key={ep.id}
              episode={ep}
              isNewest={rowIndex === 0 && i === 0}
              index={rowIndex * SHELF_SIZE + i}
              onPlay={handlePlay}
            />
          ))}
        </div>
      ))}

      {activeTransition && (
        <TapeZoomTransition
          episodeId={activeTransition.episodeId}
          originRect={activeTransition.originRect}
          onComplete={() => setActiveTransition(null)}
        />
      )}
    </div>
  )
}
