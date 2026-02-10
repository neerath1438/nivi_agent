import { useState } from 'react'
import './Textarea.css'

const Textarea = ({
  label,
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
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
      <div className={`wui-portal-well ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className="wui-portal-field"
          {...props}
        />
        {maxLength && (
          <span className="wui-portal-orbit">
            {value?.length || 0} / {maxLength}
          </span>
        )}
      </div>
      {error && <span className="wui-portal-clash">{error}</span>}
    </div>
  )
}

export default Textarea

