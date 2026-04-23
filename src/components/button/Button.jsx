import './Button.css'

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  disabled = false,
  prefix = false
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant}`}
    >
      {/* White circle with  */}
      {prefix && (
        <span className="btn__prefix">+</span>
      )}
      {children}
    </button>
  )
}