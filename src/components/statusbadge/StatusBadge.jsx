import '../statusbadge/StatusBadge.css'

export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge--${status}`}>
      <span className="badge__dot" />
      {/* Capitalize first letter */}
      {status
        ? status[0].toUpperCase() + status.slice(1)
        : ''
      }
    </span>
  )
}