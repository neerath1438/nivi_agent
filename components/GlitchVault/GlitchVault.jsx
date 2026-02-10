import React, { useEffect, useRef } from 'react'
import './GlitchVault.css'

const GlitchVault = ({
  children,
  className = '',
  glitchColor = '#0AF0F0',
  glitchRadius = 120,
  ...props
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      container.style.setProperty('--glitch-x', `${x}px`)
      container.style.setProperty('--glitch-y', `${y}px`)
    }

    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`glitch-vault ${className}`}
      style={{
        '--glitch-color': glitchColor,
        '--glitch-radius': `${glitchRadius}px`
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlitchVault

