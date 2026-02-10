import { useEffect } from 'react'
import Button from '../Button/Button'
import './Modal.css'

const Modal = ({ isOpen, onClose, title, children, size = 'medium', showCloseButton = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="wui-chamber-veil" onClick={onClose}>
      <div className={`wui-chamber wui-chamber-${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="wui-chamber-crown">
          {title && <h2 className="wui-chamber-herald">{title}</h2>}
          {showCloseButton && (
            <button className="wui-chamber-exit" onClick={onClose}>
              ×
            </button>
          )}
        </div>
        <div className="wui-chamber-core">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

