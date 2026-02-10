import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ReactNetworkVisualization.css'

const ReactNetworkVisualization = () => {
  const [containerSize, setContainerSize] = useState({
    width: 700,
    height: 700
  })

  const dimensions = useMemo(() => {
    const baseSize = Math.min(containerSize.width, containerSize.height)
    const scale = baseSize / 700
    return {
      containerSize: baseSize,
      outerRadius: Math.floor(290 * scale),
      innerRadius: Math.floor(180 * scale),
      centerImageSize: Math.floor(160 * scale),
      outerAvatarSize: Math.floor(80 * scale),
      innerAvatarSize: Math.floor(72 * scale),
      outerImageSize: Math.floor(64 * scale),
      innerImageSize: Math.floor(56 * scale),
      strokeWidth: Math.max(1, Math.floor(3 * scale)),
      tooltipTextSize: scale < 0.6 ? 'text-xs' : 'text-sm',
      centerX: baseSize / 2,
      centerY: baseSize / 2
    }
  }, [containerSize])

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const maxWidth = Math.min(width - 32, 700)
      const maxHeight = Math.min(height - 32, 700)
      const size = Math.min(maxWidth, maxHeight)
      setContainerSize({
        width: size,
        height: size
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const avatars = useMemo(() => {
    const newImageLinks = [
      'https://i.postimg.cc/W1rCvYnT/nazmul-hossain.jpg',
      'https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg',
      'https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg',
      'https://i.pinimg.com/1200x/c2/4e/27/c24e271f2f992fd7e62e8c1e8d9b3e2f.jpg',
      'https://i.pinimg.com/736x/81/d6/b1/81d6b158728f5fc97ca6e0a025fefee0.jpg',
      'https://i.pinimg.com/736x/9f/46/74/9f4674ca9c17330ab419c1b2f5951d9a.jpg',
      'https://i.pinimg.com/736x/57/3c/80/573c80967c9429d0ed0ce32701f85b70.jpg',
      'https://i.pinimg.com/736x/b0/c4/21/b0c421e77cf563962026ade82c90dd5b.jpg',
      'https://i.pinimg.com/736x/ce/31/42/ce3142d7a968fff3aecd0100572a5e8b.jpg',
      'https://i.pinimg.com/736x/79/63/a5/7963a5246188d408b8f28961a0cf2b90.jpg',
      'https://i.pinimg.com/736x/8e/c1/f8/8ec1f80db272047cedf4c20263114387.jpg',
      'https://i.pinimg.com/1200x/08/a2/41/08a2413b771b729a9f9df20fa97be52a.jpg',
      'https://i.pinimg.com/736x/b0/7b/cc/b07bcc19e5d06dfb888c3263724b8baa.jpg',
      'https://i.pinimg.com/736x/12/ec/d9/12ecd918607b1ccb9d46772435bb592f.jpg',
      'https://i.pinimg.com/1200x/e2/f5/bc/e2f5bc45bd9d07946c9453cfb48747ea.jpg',
      'https://i.pinimg.com/1200x/50/47/d2/5047d259f0d8b3d652b7d3dfa3479139.jpg',
      'https://i.pinimg.com/736x/bb/87/18/bb87180897cb4cb694cd692966a0ab15.jpg',
      'https://i.pinimg.com/1200x/fb/c3/03/fbc30308d8f36a5566cbf0a535c14322.jpg',
      'https://i.pinimg.com/1200x/de/11/d2/de11d2f9df4295493625189e9cb829ce.jpg'
    ]

    return [
      { id: 1, name: 'Zane Whitaker', image: newImageLinks[0], ring: 'outer' },
      { id: 2, name: 'Maya', image: newImageLinks[1], ring: 'outer' },
      { id: 3, name: 'Jordan', image: newImageLinks[2], ring: 'outer' },
      { id: 4, name: 'Zara', image: newImageLinks[3], ring: 'outer' },
      { id: 5, name: 'Sam', image: newImageLinks[4], ring: 'outer' },
      { id: 6, name: 'Riley', image: newImageLinks[5], ring: 'outer' },
      { id: 7, name: 'Casey', image: newImageLinks[6], ring: 'outer' },
      { id: 8, name: 'Avery', image: newImageLinks[7], ring: 'outer' },
      { id: 9, name: 'Morgan', image: newImageLinks[8], ring: 'inner' },
      { id: 10, name: 'Quinn', image: newImageLinks[9], ring: 'inner' },
      { id: 11, name: 'Sage', image: newImageLinks[10], ring: 'inner' },
      { id: 12, name: 'River', image: newImageLinks[11], ring: 'inner' },
      { id: 13, name: 'Alex', image: newImageLinks[12], ring: 'outer' },
      { id: 14, name: 'Jamie', image: newImageLinks[13], ring: 'outer' },
      { id: 15, name: 'Chris', image: newImageLinks[14], ring: 'inner' },
      { id: 16, name: 'Pat', image: newImageLinks[15], ring: 'outer' },
      { id: 17, name: 'Drew', image: newImageLinks[16], ring: 'inner' },
      { id: 18, name: 'Lee', image: newImageLinks[17], ring: 'outer' },
      { id: 19, name: 'Taylor', image: newImageLinks[18 % newImageLinks.length], ring: 'outer' },
      { id: 20, name: 'Jesse', image: newImageLinks[1 % newImageLinks.length], ring: 'outer' },
      { id: 21, name: 'Dakota', image: newImageLinks[2 % newImageLinks.length], ring: 'inner' },
      { id: 22, name: 'Blair', image: newImageLinks[3 % newImageLinks.length], ring: 'inner' },
      { id: 23, name: 'Jordan S.', image: newImageLinks[4 % newImageLinks.length], ring: 'outer' },
      { id: 24, name: 'Casey M.', image: newImageLinks[5 % newImageLinks.length], ring: 'inner' }
    ]
  }, [])

  const outerRingAvatars = avatars.filter(a => a.ring === 'outer')
  const innerRingAvatars = avatars.filter(a => a.ring === 'inner')

  const [activeConnections, setActiveConnections] = useState([])

  const allAvatarPositions = useMemo(() => {
    const getAvatarAbsolutePosition = (index, total, radius, startAngleOffset = 0) => {
      const angle = startAngleOffset + (index / total) * 2 * Math.PI
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      return {
        cx: dimensions.centerX + x,
        cy: dimensions.centerY + y
      }
    }

    const positions = {}
    outerRingAvatars.forEach((avatar, index) => {
      positions[avatar.id] = getAvatarAbsolutePosition(index, outerRingAvatars.length, dimensions.outerRadius, Math.PI / 2)
    })
    innerRingAvatars.forEach((avatar, index) => {
      positions[avatar.id] = getAvatarAbsolutePosition(index, innerRingAvatars.length, dimensions.innerRadius, Math.PI / 3)
    })
    positions['center'] = {
      cx: dimensions.centerX,
      cy: dimensions.centerY
    }
    return positions
  }, [dimensions, outerRingAvatars, innerRingAvatars])

  const allConnectionPoints = useMemo(() => [...avatars.map(a => a.id), 'center'], [avatars])

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]

  useEffect(() => {
    const interval = setInterval(() => {
      let from
      let to
      let newConnection = null
      let attempts = 0
      const maxAttempts = 10

      do {
        from = getRandomElement(allConnectionPoints)
        to = getRandomElement(allConnectionPoints)
        attempts++
        if (from !== to) {
          newConnection = {
            from,
            to,
            color: getRandomElement(['blue', 'green', 'purple', 'yellow', 'red', 'orange', 'pink', 'cyan', 'white'])
          }
          break
        }
      } while (attempts < maxAttempts)

      setActiveConnections(newConnection ? [newConnection] : [])
    }, 4000)

    return () => clearInterval(interval)
  }, [allConnectionPoints])

  const isCurrentlyConnected = (id) => {
    return activeConnections.some(conn => conn.from === id || conn.to === id)
  }

  const getColorValue = (color) => {
    const colorMap = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      yellow: '#f59e0b',
      red: '#ef4444',
      orange: '#f97316',
      pink: '#ec4899',
      cyan: '#06b6d4',
      white: '#ffffff'
    }
    return colorMap[color] || '#3b82f6'
  }

  return (
    <div className="network-visualization-wrapper">
      <div
        className="network-container"
        style={{
          width: `${dimensions.containerSize}px`,
          height: `${dimensions.containerSize}px`,
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      >
        {/* Outer Ring */}
        <div
          className="network-ring network-ring-outer"
          style={{
            width: `${dimensions.outerRadius * 2}px`,
            height: `${dimensions.outerRadius * 2}px`
          }}
        ></div>

        {/* Inner Ring */}
        <div
          className="network-ring network-ring-inner"
          style={{
            width: `${dimensions.innerRadius * 2}px`,
            height: `${dimensions.innerRadius * 2}px`
          }}
        ></div>

        {/* Center Image */}
        <div
          className="network-center group-center"
          style={{
            left: `${dimensions.centerX}px`,
            top: `${dimensions.centerY}px`
          }}
        >
          <img
            src="https://i.pinimg.com/736x/5c/62/7a/5c627a3458297ee0c587328e5f7061fc.jpg"
            alt="Center Image"
            className="network-center-image"
            style={{
              width: `${dimensions.centerImageSize}px`,
              height: `${dimensions.centerImageSize}px`
            }}
            onError={(e) => {
              const target = e.target
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = '<span class="network-fallback-icon">⭐</span>'
              }
            }}
          />

          {/* Center Tooltip */}
          <div
            className={`network-tooltip ${dimensions.tooltipTextSize} ${
              isCurrentlyConnected('center') ? 'opacity-100' : 'opacity-0 group-center:hover:opacity-100'
            }`}
          >
            Center Hub
            <div className="network-tooltip-arrow"></div>
          </div>
        </div>

        {/* SVG for Connections */}
        <svg className="network-svg">
          <defs>
            <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feComponentTransfer in="blur" result="glow">
                <feFuncA type="linear" slope="0.5" intercept="0" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <AnimatePresence>
            {activeConnections.map((conn) => {
              const fromPos = allAvatarPositions[conn.from]
              const toPos = allAvatarPositions[conn.to]
              if (!fromPos || !toPos) return null

              const dx = toPos.cx - fromPos.cx
              const dy = toPos.cy - toPos.cy
              const lineLength = Math.sqrt(dx * dx + dy * dy)

              return (
                <motion.line
                  key={`${conn.from}-${conn.to}`}
                  x1={fromPos.cx}
                  y1={fromPos.cy}
                  x2={toPos.cx}
                  y2={toPos.cy}
                  stroke={getColorValue(conn.color)}
                  strokeWidth={dimensions.strokeWidth}
                  strokeOpacity="0.8"
                  fill="none"
                  initial={{
                    strokeDasharray: lineLength,
                    strokeDashoffset: lineLength
                  }}
                  animate={{
                    strokeDashoffset: 0
                  }}
                  transition={{
                    duration: 3,
                    ease: 'linear'
                  }}
                  filter="url(#lineGlow)"
                />
              )
            })}
          </AnimatePresence>
        </svg>

        {/* Outer Ring Avatars */}
        {outerRingAvatars.map((avatar) => {
          const { cx, cy } = allAvatarPositions[avatar.id]
          const isActive = isCurrentlyConnected(avatar.id)

          return (
            <div
              key={avatar.id}
              className="network-avatar-wrapper"
              style={{
                left: `${cx}px`,
                top: `${cy}px`
              }}
            >
              <div
                className={`network-avatar network-avatar-outer group-outer-${avatar.id}`}
                style={{
                  width: `${dimensions.outerAvatarSize}px`,
                  height: `${dimensions.outerAvatarSize}px`
                }}
              >
                <div
                  className="network-avatar-image"
                  style={{
                    width: `${dimensions.outerImageSize}px`,
                    height: `${dimensions.outerImageSize}px`
                  }}
                >
                  <img
                    src={avatar.image || '/placeholder.svg'}
                    alt={avatar.name}
                    className="network-avatar-img"
                    onError={(e) => {
                      const target = e.target
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<span class="network-fallback-icon">👤</span>'
                      }
                    }}
                  />
                </div>

                {/* Tooltip */}
                <div
                  className={`network-tooltip ${dimensions.tooltipTextSize} ${
                    isActive ? 'opacity-100' : `opacity-0 group-outer-${avatar.id}:hover:opacity-100`
                  }`}
                >
                  {avatar.name}
                  <div className="network-tooltip-arrow"></div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Inner Ring Avatars */}
        {innerRingAvatars.map((avatar) => {
          const { cx, cy } = allAvatarPositions[avatar.id]
          const isActive = isCurrentlyConnected(avatar.id)

          return (
            <div
              key={avatar.id}
              className="network-avatar-wrapper"
              style={{
                left: `${cx}px`,
                top: `${cy}px`
              }}
            >
              <div
                className={`network-avatar network-avatar-inner group-inner-${avatar.id}`}
                style={{
                  width: `${dimensions.innerAvatarSize}px`,
                  height: `${dimensions.innerAvatarSize}px`
                }}
              >
                <div
                  className="network-avatar-image"
                  style={{
                    width: `${dimensions.innerImageSize}px`,
                    height: `${dimensions.innerImageSize}px`
                  }}
                >
                  <img
                    src={avatar.image || '/placeholder.svg'}
                    alt={avatar.name}
                    className="network-avatar-img"
                    onError={(e) => {
                      const target = e.target
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<span class="network-fallback-icon">👤</span>'
                      }
                    }}
                  />
                </div>

                {/* Tooltip */}
                <div
                  className={`network-tooltip ${dimensions.tooltipTextSize} ${
                    isActive ? 'opacity-100' : `opacity-0 group-inner-${avatar.id}:hover:opacity-100`
                  }`}
                >
                  {avatar.name}
                  <div className="network-tooltip-arrow"></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReactNetworkVisualization

