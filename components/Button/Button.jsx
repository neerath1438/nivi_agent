import './Button.css'

const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'medium',
  disabled = false,
  type = 'button',
  loading = false,
  iconLeft = null,
  iconRight = null,
  className = '',
  ...props
}) => {
  // Map size shortcuts to full names for backward compatibility
  const sizeMap = {
    'sm': 'small',
    'lg': 'large',
    'small': 'small',
    'medium': 'medium',
    'large': 'large'
  }

  const mappedSize = sizeMap[size] || 'medium'

  // Combine classes
  const buttonClasses = `wui-trigger wui-trigger-${variant} wui-trigger-${mappedSize} ${className}`.trim()

  // Check if it's an icon-only button
  const isIconOnly = !children && (iconLeft || iconRight)

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <span className="wui-pulse"></span>
      )}
      {!loading && iconLeft && (
        <span className="wui-trigger-left">{iconLeft}</span>
      )}
      {!loading && children && (
        <span className={isIconOnly ? '' : 'wui-trigger-voice'}>{children}</span>
      )}
      {!loading && iconRight && (
        <span className="wui-trigger-right">{iconRight}</span>
      )}
    </button>
  )
}

export default Button

