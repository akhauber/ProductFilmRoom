import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: '// ARCHIVE', to: '/archive' },
  { label: 'ABOUT', to: '/about' },
]

export default function Nav() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  if (location.pathname === '/') return null

  const linkStyle = (to) => ({
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 8,
    color: location.pathname === to ? 'var(--green)' : 'var(--purple)',
    textDecoration: 'none',
    textTransform: 'uppercase',
    lineHeight: 1.8,
    transition: 'color 80ms ease',
  })

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 48,
      background: 'var(--bg-base)',
      borderBottom: '1px solid var(--border)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      <Link
        to="/"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: 'var(--orange)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          lineHeight: 1.8,
        }}
      >
        [ PRODUCT FILM ROOM ]
      </Link>

      <div
        style={{
          display: 'none',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 16,
          color: 'var(--purple)',
          cursor: 'pointer',
          lineHeight: 1,
        }}
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ≡
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-links">
        {NAV_LINKS.map(({ label, to }) => (
          <NavLink key={to} label={label} to={to} style={linkStyle(to)} />
        ))}
        <a
          href="https://productfilmroom.substack.com"
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--orange)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            lineHeight: 1.8,
            transition: 'color 80ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--orange)'}
        >
          {'> SUBSCRIBE'}
        </a>
      </div>

      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: 48,
          left: 0,
          right: 0,
          background: 'var(--bg-base)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          zIndex: 49,
        }} className="nav-dropdown">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                ...linkStyle(to),
                padding: '16px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'block',
              }}
              onMouseEnter={e => { if (location.pathname !== to) e.currentTarget.style.color = 'var(--green)' }}
              onMouseLeave={e => { if (location.pathname !== to) e.currentTarget.style.color = 'var(--purple)' }}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://productfilmroom.substack.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: 'var(--orange)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              lineHeight: 1.8,
              padding: '16px 24px',
              display: 'block',
            }}
          >
            {'> SUBSCRIBE'}
          </a>
        </div>
      )}
    </nav>
  )
}

function NavLink({ label, to, style }) {
  return (
    <Link
      to={to}
      style={style}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'}
      onMouseLeave={e => e.currentTarget.style.color = style.color}
    >
      {label}
    </Link>
  )
}
