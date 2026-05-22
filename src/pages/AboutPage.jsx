import { motion } from 'framer-motion'

const LINKS = [
  { label: '> SUBSTACK', href: 'https://productfilmroom.substack.com' },
  { label: '> LINKEDIN', href: '#' },
  { label: '> TWITTER/X', href: '#' },
]

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '96px 48px 48px',
      }}
    >
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 10,
        color: 'var(--purple)',
        lineHeight: 1.8,
        textTransform: 'uppercase',
        marginBottom: 40,
      }}>
        // ABOUT THE ANALYST
      </div>

      <p style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        color: 'var(--text-primary)',
        lineHeight: 1.8,
        marginBottom: 40,
      }}>
        Andrew Hauber is a product leader and writer focused on fintech and B2B software. Product Film Room is where he breaks down competitive dynamics, product strategy, and market positioning — one episode at a time.
      </p>

      <div style={{
        background: 'var(--bg-container)',
        border: '1px solid var(--border)',
        padding: 24,
        marginBottom: 48,
      }}>
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          color: 'var(--text-primary)',
          lineHeight: 1.8,
          margin: 0,
        }}>
          PFR covers the product decisions that shape markets. Each episode picks two companies, one battle, and one clear breakdown of who's winning and why.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {LINKS.map(({ label, href }) => (
          <ExternalLink key={label} label={label} href={href} />
        ))}
      </div>
    </motion.div>
  )
}

function ExternalLink({ label, href }) {
  return (
    <a
      href={href}
      target={href !== '#' ? '_blank' : undefined}
      rel={href !== '#' ? 'noreferrer' : undefined}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 7,
        color: 'var(--purple)',
        textDecoration: 'none',
        textTransform: 'uppercase',
        background: 'transparent',
        border: '1px solid var(--purple)',
        padding: '12px 20px',
        lineHeight: 1.8,
        display: 'inline-block',
        transition: 'border-color 80ms ease, color 80ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--green)'
        e.currentTarget.style.color = 'var(--green)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--purple)'
        e.currentTarget.style.color = 'var(--purple)'
      }}
    >
      {label}
    </a>
  )
}
