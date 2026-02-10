import './Alert.css'

const Alert = ({
  type = 'info',
  message,
  title,
  onClose,
  showIcon = true,
  className = ''
}) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`wui-signal wui-signal-${type} ${className}`}>
      <div className="wui-signal-orbit">
        {showIcon && <span className="wui-signal-atom">{icons[type]}</span>}
        <div className="wui-signal-core">
          {title && <div className="wui-signal-crown">{title}</div>}
          {message && <div className="wui-signal-voice">{message}</div>}
        </div>
      </div>
      {onClose && (
        <button className="wui-signal-exit" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  )
}

export default Alert

