import React, { useState } from 'react'
import {
  GrayGridsLogo,
  NextJsTemplatesLogo,
  PimjoLogo,
  SaasBoldLogo,
  StaticRunLogo,
  TailAdminLogo,
  TailgridsLogo,
  UideckLogo
} from './icons.jsx'
import './ReactOrbit.css'

const IconWrapper = ({
  children,
  className = '',
  isHighlighted = false,
  isHovered = false,
  animationDelay = 0
}) => {
  return (
    <div
      className={`icon-wrapper ${isHighlighted ? 'highlighted' : ''} ${isHovered ? 'hovered' : ''} ${className}`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {children}
    </div>
  )
}

const IconGrid = () => {
  const [hoveredId, setHoveredId] = useState(null)

  const outerIcons = [
    { id: 1, component: <GrayGridsLogo /> },
    { id: 2, component: <TailAdminLogo /> },
    { id: 3, component: <NextJsTemplatesLogo /> },
    { id: 4, component: <StaticRunLogo /> },
    { id: 5, component: <TailgridsLogo /> },
    { id: 6, component: <UideckLogo /> },
    { id: 7, component: <SaasBoldLogo /> }
  ]

  const radius = 160
  const centralIconRadius = 48
  const outerIconRadius = 40
  const svgSize = 380
  const svgCenter = svgSize / 2

  return (
    <div className="orbit-container">
      {/* SVG Lines */}
      <svg width={svgSize} height={svgSize} className="orbit-svg">
        <g>
          {outerIcons.map((icon, i) => {
            const angleInDegrees = -150 + i * 60
            const angleInRadians = angleInDegrees * (Math.PI / 180)
            const startX = svgCenter + centralIconRadius * Math.cos(angleInRadians)
            const startY = svgCenter + centralIconRadius * Math.sin(angleInRadians)
            const endX = svgCenter + (radius - outerIconRadius) * Math.cos(angleInRadians)
            const endY = svgCenter + (radius - outerIconRadius) * Math.sin(angleInRadians)
            const isHovered = hoveredId === icon.id

            return (
              <line
                key={`line-${icon.id}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={isHovered ? '#3B82F6' : '#6B7280'}
                strokeWidth="2"
                className="orbit-line"
                style={{ opacity: isHovered ? 1 : 0.3 }}
              />
            )
          })}
        </g>
      </svg>

      {/* Icons Container */}
      <div className="orbit-icons-container">
        {/* Central Icon */}
        <div className="orbit-central-icon">
          <IconWrapper className="icon-large" isHighlighted={true} animationDelay={0}>
            <PimjoLogo />
          </IconWrapper>
        </div>

        {/* Outer Icons */}
        {outerIcons.map((icon, i) => {
          const angleInDegrees = -150 + i * 60
          const angleInRadians = angleInDegrees * (Math.PI / 180)
          const x = radius * Math.cos(angleInRadians)
          const y = radius * Math.sin(angleInRadians)

          return (
            <div
              key={icon.id}
              className="orbit-outer-icon"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              onMouseEnter={() => setHoveredId(icon.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="orbit-icon-inner">
                <IconWrapper
                  className="icon-medium"
                  isHovered={hoveredId === icon.id}
                  animationDelay={i * 0.2}
                >
                  {icon.component}
                </IconWrapper>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ReactOrbit = () => {
  return (
    <div className="react-orbit-wrapper">
      {/* Background Gradient */}
      <div className="orbit-background"></div>

      {/* Main Content */}
      <div className="orbit-content">
        <IconGrid />
      </div>
    </div>
  )
}

export default ReactOrbit

