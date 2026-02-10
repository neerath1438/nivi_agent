import { useState } from 'react'
import './Input.css'

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`wui-portal-bay ${className}`}>
      {label && (
        <label className={`wui-portal-herald ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <div className={`wui-portal-field ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className="wui-portal"
          {...props}
        />
      </div>
      {error && <span className="wui-portal-clash">{error}</span>}
    </div>
  )
}

export default Input

