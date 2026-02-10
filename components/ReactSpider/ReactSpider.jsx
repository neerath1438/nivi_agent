import React, { useState } from 'react'
import {
  GrayGridsLogo,
  LineIconsLogo,
  NextJsTemplatesLogo,
  PimjoLogo,
  StaticRunLogo,
  TailAdminLogo,
  TailgridsLogo,
  UideckLogo
} from '../ReactOrbit/icons.jsx'
import './ReactSpider.css'

const IconWrapper = ({
  children,
  className = '',
  isHighlighted = false,
  isHovered = false,
  animationDelay = 0
}) => {
  return (
    <div
      className={`spider-icon-wrapper ${isHighlighted ? 'highlighted' : ''} ${isHovered ? 'hovered' : ''} ${className}`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {children}
    </div>
  )
}

const IconGrid = () => {
  const [hoveredId, setHoveredId] = useState(null)

  const outerIcons = [
    { id: 1, component: <TailAdminLogo /> },
    { id: 2, component: <TailgridsLogo /> },
    { id: 3, component: <UideckLogo /> },
    { id: 4, component: <GrayGridsLogo /> },
    { id: 5, component: <StaticRunLogo /> },
    { id: 6, component: <NextJsTemplatesLogo /> },
    { id: 7, component: <LineIconsLogo /> }
  ]

  const radius = 160
  const centralIconRadius = 48
  const outerIconRadius = 32
  const svgSize = 400
  const svgCenter = svgSize / 2

  return (
    <div className="spider-container">
      {/* SVG Lines */}
      <svg width={svgSize} height={svgSize} className="spider-svg">
        <defs>
          <filter id="spider-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g>
          {/* Web lines - connecting outer icons */}
          {outerIcons.map((icon, i) => {
            const nextIndex = (i + 1) % outerIcons.length
            const nextIcon = outerIcons[nextIndex]
            const angle1 = (-90 + i * (360 / outerIcons.length)) * (Math.PI / 180)
            const x1 = svgCenter + (radius - outerIconRadius) * Math.cos(angle1)
            const y1 = svgCenter + (radius - outerIconRadius) * Math.sin(angle1)
            const angle2 = (-90 + nextIndex * (360 / outerIcons.length)) * (Math.PI / 180)
            const x2 = svgCenter + (radius - outerIconRadius) * Math.cos(angle2)
            const y2 = svgCenter + (radius - outerIconRadius) * Math.sin(angle2)
            const isLineActive = hoveredId === icon.id || hoveredId === nextIcon.id

            return (
              <line
                key={`web-line-${icon.id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isLineActive ? '#3B82F6' : '#6B7280'}
                strokeWidth="1.5"
                className="spider-web-line"
                style={{
                  opacity: isLineActive ? 0.8 : 0.25
                }}
                filter={isLineActive ? 'url(#spider-glow)' : 'none'}
              />
            )
          })}

          {/* Spoke lines - from center to outer icons */}
          {outerIcons.map((icon, i) => {
            const angleInDegrees = -90 + i * (360 / outerIcons.length)
            const angleInRadians = angleInDegrees * (Math.PI / 180)
            const startX = svgCenter + centralIconRadius * Math.cos(angleInRadians)
            const startY = svgCenter + centralIconRadius * Math.sin(angleInRadians)
            const endX = svgCenter + (radius - outerIconRadius) * Math.cos(angleInRadians)
            const endY = svgCenter + (radius - outerIconRadius) * Math.sin(angleInRadians)
            const isSpokeActive = hoveredId === icon.id

            return (
              <line
                key={`spoke-line-${icon.id}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={isSpokeActive ? '#3B82F6' : '#6B7280'}
                strokeWidth="1.5"
                className="spider-spoke-line"
                style={{
                  opacity: isSpokeActive ? 1 : 0.25
                }}
                filter={isSpokeActive ? 'url(#spider-glow)' : 'none'}
              />
            )
          })}
        </g>
      </svg>

      {/* Icons Container */}
      <div className="spider-icons-container">
        {/* Central Icon */}
        <div className="spider-central-icon">
          <IconWrapper className="spider-icon-large" isHighlighted={true} animationDelay={0}>
            <PimjoLogo />
          </IconWrapper>
        </div>

        {/* Outer Icons */}
        {outerIcons.map((icon, i) => {
          const angleInDegrees = -90 + i * (360 / outerIcons.length)
          const angleInRadians = angleInDegrees * (Math.PI / 180)
          const x = radius * Math.cos(angleInRadians)
          const y = radius * Math.sin(angleInRadians)
          const isHovered = hoveredId === icon.id

          return (
            <div
              key={icon.id}
              className="spider-outer-icon"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              onMouseEnter={() => setHoveredId(icon.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="spider-icon-inner">
                {/* Glow effect */}
                <div
                  className={`spider-icon-glow ${isHovered ? 'active' : ''}`}
                ></div>

                <IconWrapper
                  className="spider-icon-medium"
                  isHovered={isHovered}
                  animationDelay={i * 0.15}
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

const ReactSpider = () => {
  return (
    <div className="react-spider-wrapper">
      {/* Background Gradient */}
      <div className="spider-background"></div>

      {/* Main Content */}
      <div className="spider-content">
        <IconGrid />
      </div>
    </div>
  )
}

export default ReactSpider

