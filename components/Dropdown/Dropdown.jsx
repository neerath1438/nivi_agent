import { useState, useRef, useEffect } from 'react'
import './Dropdown.css'

const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={`wui-cascade-bay ${className}`} ref={dropdownRef}>
      {label && (
        <label className={`wui-cascade-herald ${error ? 'error' : ''}`}>
          {label}
        </label>
      )}
      <div className={`wui-cascade-well ${isOpen ? 'open' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        <button
          type="button"
          className="wui-cascade-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={selectedOption ? 'selected' : 'placeholder'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="wui-cascade-dial">▼</span>
        </button>
        {isOpen && (
          <div className="wui-cascade-orbit">
            {options.length === 0 ? (
              <div className="wui-cascade-atom disabled">No options available</div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={`wui-cascade-atom ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <span className="wui-cascade-clash">{error}</span>}
    </div>
  )
}

export default Dropdown

