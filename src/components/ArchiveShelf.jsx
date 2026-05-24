import CassetteTape from './CassetteTape'

export default function ArchiveShelf({ episodes }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
      <ShelfRow episodes={episodes} startIndex={0} />
    </div>
  )
}

function ShelfRow({ episodes, startIndex }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Back wall */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        bottom: 14,
        background: 'linear-gradient(to bottom, #06050f 0%, #0c0b1c 60%, #110f22 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderBottom: 'none',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
      }} />

      {/* Side brackets */}
      <div style={{
        position: 'absolute', top: 0, bottom: 14, left: 0, width: 10,
        background: 'linear-gradient(to right, #1a1230, #0d0b1c)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', top: 0, bottom: 14, right: 0, width: 10,
        background: 'linear-gradient(to left, #1a1230, #0d0b1c)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        zIndex: 2,
      }} />

      {/* Tapes */}
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '28px 18px 0',
        overflowX: 'auto',
        overflowY: 'visible',
        position: 'relative',
        zIndex: 10,
        alignItems: 'flex-end',
        minHeight: 220,
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(167,139,250,0.25) transparent',
      }}>
        {episodes.map((ep, i) => (
          <CassetteTape
            key={ep.id}
            episode={ep}
            isNewest={startIndex === 0 && i === 0}
            index={startIndex + i}
          />
        ))}

        {/* Empty slots if shelf looks sparse */}
        {episodes.length < 6 && Array.from({ length: 6 - episodes.length }).map((_, i) => (
          <EmptySlot key={`empty-${i}`} />
        ))}
      </div>

      {/* Shelf board */}
      <div style={{
        height: 14,
        position: 'relative',
        zIndex: 5,
        background: 'linear-gradient(to bottom, #5c3d1e 0%, #3a2410 50%, #221608 100%)',
        borderTop: '1px solid #7a5030',
        boxShadow: '0 6px 20px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.5)',
      }}>
        {/* Wood grain lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent 0px, transparent 60px,
              rgba(0,0,0,0.08) 60px, rgba(0,0,0,0.08) 62px
            )
          `,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Drop shadow below shelf */}
      <div style={{
        height: 12,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)',
      }} />
    </div>
  )
}

function EmptySlot() {
  return (
    <div style={{
      width: 38, height: 185, flexShrink: 0,
      border: '1px dashed rgba(255,255,255,0.04)',
      borderBottom: 'none',
    }} />
  )
}
