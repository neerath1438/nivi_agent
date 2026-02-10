import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FormBoldLogo,
  GrayGridsLogo,
  LineIconsLogo,
  NextJsTemplatesLogo,
  PimjoLogo,
  SaasBoldLogo,
  StaticRunLogo,
  TailAdminLogo,
  TailgridsLogo,
  UideckLogo
} from '../ReactOrbit/icons.jsx'
import './ReactNexusOrbSup.css'

const IconWrapper = ({
  children,
  className = '',
  isHighlighted = false,
  isActive = false
}) => {
  return (
    <div
      className={`nexus-icon-wrapper ${isHighlighted ? 'highlighted' : ''} ${isActive ? 'active' : ''} ${className}`}
      style={{
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
        backgroundColor: isActive ? 'rgba(129, 140, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
        transition: 'transform 0.8s ease-in-out, background-color 0.8s ease-in-out, border-color 0.8s ease-in-out'
      }}
    >
      {children}
    </div>
  )
}

const IconGrid = () => {
  const [activeId, setActiveId] = useState(1)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])

  const outerIcons = useMemo(() => [
    { id: 1, component: <TailAdminLogo /> },
    { id: 2, component: <GrayGridsLogo /> },
    { id: 3, component: <TailgridsLogo /> },
    { id: 4, component: <UideckLogo /> },
    { id: 5, component: <NextJsTemplatesLogo /> },
    { id: 6, component: <StaticRunLogo /> },
    { id: 7, component: <LineIconsLogo /> },
    { id: 8, component: <SaasBoldLogo /> },
    { id: 9, component: <FormBoldLogo /> }
  ], [])

  const radius = 160
  const svgSize = 400
  const svgCenter = svgSize / 2
  const numIcons = outerIcons.length

  const getIconPosition = useCallback((index) => {
    const angle = (-90 + index * (360 / numIcons)) * (Math.PI / 180)
    return {
      transformX: radius * Math.cos(angle),
      transformY: radius * Math.sin(angle),
      svgX: svgCenter + radius * Math.cos(angle),
      svgY: svgCenter + radius * Math.sin(angle)
    }
  }, [numIcons, radius, svgCenter])

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId

    const render = () => {
      ctx.clearRect(0, 0, svgSize, svgSize)
      particlesRef.current.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1

        if (p.life <= 0) {
          particlesRef.current.splice(index, 1)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false)
          ctx.fillStyle = `rgba(59, 130, 246, ${p.life / 60})`
          ctx.fill()
        }
      })

      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [svgSize])

  // Auto-rotate active icon
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveId((prevId) => {
        const currentIndex = outerIcons.findIndex(icon => icon.id === prevId)
        const nextIndex = (currentIndex + 1) % outerIcons.length
        const pos = getIconPosition(nextIndex)
        const iconCenterX = svgCenter + pos.transformX
        const iconCenterY = svgCenter + pos.transformY

        // Create particles
        for (let i = 0; i < 20; i++) {
          particlesRef.current.push({
            x: iconCenterX,
            y: iconCenterY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            life: Math.random() * 60
          })
        }

        return outerIcons[nextIndex].id
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [outerIcons, getIconPosition, svgCenter])

  return (
    <div className="nexus-container">
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        width={svgSize}
        height={svgSize}
        className="nexus-canvas"
      ></canvas>

      {/* SVG Lines */}
      <svg width={svgSize} height={svgSize} className="nexus-svg">
        <defs>
          <filter id="nexus-glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g>
          {outerIcons.map((icon1, i) => {
            const p1 = getIconPosition(i)
            return outerIcons.map((icon2, j) => {
              if (i >= j) return null
              const p2 = getIconPosition(j)
              const isLineActive = activeId === icon1.id || activeId === icon2.id

              return (
                <line
                  key={`line-${i}-${j}`}
                  x1={p1.svgX}
                  y1={p1.svgY}
                  x2={p2.svgX}
                  y2={p2.svgY}
                  strokeWidth="1.5"
                  style={{
                    stroke: isLineActive ? '#3B82F6' : '#6B7280',
                    opacity: isLineActive ? 0.8 : 0.15,
                    filter: isLineActive ? 'url(#nexus-glow)' : 'none',
                    transition: 'all 1.2s ease-in-out'
                  }}
                  className="nexus-line"
                />
              )
            })
          })}
        </g>
      </svg>

      {/* Icons Container */}
      <div className="nexus-icons-container">
        {/* Central Icon */}
        <div className="nexus-central-icon">
          <IconWrapper className="nexus-icon-large" isHighlighted={true}>
            <PimjoLogo />
          </IconWrapper>
        </div>

        {/* Outer Icons */}
        {outerIcons.map((icon, i) => {
          const { transformX, transformY } = getIconPosition(i)
          const isActive = activeId === icon.id

          return (
            <div
              key={icon.id}
              className="nexus-outer-icon"
              style={{
                top: 0,
                left: 0,
                transform: `translate(${transformX}px, ${transformY}px)`,
                transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              <div className="nexus-icon-inner">
                {/* Glow effect */}
                <div
                  className="nexus-icon-glow"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.8s ease-in-out'
                  }}
                ></div>

                <IconWrapper className="nexus-icon-medium" isActive={isActive}>
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

const ReactNexusOrbSup = () => {
  return (
    <div className="react-nexus-wrapper">
      {/* Background Gradient */}
      <div className="nexus-background"></div>

      {/* Main Content */}
      <div className="nexus-content">
        <IconGrid />
      </div>
    </div>
  )
}

export default ReactNexusOrbSup

