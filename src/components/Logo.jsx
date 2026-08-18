import { Link } from 'react-router-dom'

export default function Logo({ to = '/', onClick, className = '', compact = false }) {
  return (
    <Link
      to={to}
      className={`brand-logo ${compact ? 'brand-logo--compact' : ''} ${className}`.trim()}
      aria-label="Faaperfume home"
      onClick={onClick}
    >
      <span className="brand-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="9" fill="currentColor" className="brand-logo__plate" />
          <path
            d="M20 7c-3.2 4-5.2 7.2-5.2 10.7a5.2 5.2 0 1 0 10.4 0C25.2 14.2 23.2 11 20 7Z"
            fill="#C9B08A"
          />
          <circle cx="20" cy="17.8" r="1.7" fill="#1C2B28" />
        </svg>
      </span>
      <span className="brand-logo__word">Faaperfume</span>
    </Link>
  )
}
