import { motion } from 'framer-motion'
import ArchiveShelf from '../components/ArchiveShelf'
import { episodes } from '../data/episodes'

export default function ArchivePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '80px 48px 48px', overflow: 'visible' }}
    >
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 10,
        color: 'var(--purple)',
        lineHeight: 1.8,
        textTransform: 'uppercase',
        marginBottom: 40,
      }}>
        // THE ARCHIVE
      </div>

      <ArchiveShelf episodes={episodes} />
    </motion.div>
  )
}
