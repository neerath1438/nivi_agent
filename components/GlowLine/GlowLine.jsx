import React from 'react'
import './GlowLine.css'

// Color schemes configuration
const COLOR_SCHEMES = {
  purple: {
    core: 'purple-400',
    glow: ['purple-400', 'purple-500', 'purple-400', 'purple-300']
  },
  blue: {
    core: 'blue-400',
    glow: ['blue-400', 'blue-500', 'blue-400', 'blue-300']
  },
  green: {
    core: 'green-400',
    glow: ['green-400', 'green-500', 'green-400', 'green-300']
  },
  red: {
    core: 'red-400',
    glow: ['red-400', 'red-500', 'red-400', 'red-300']
  }
}

const GlowLine = ({
  orientation = 'horizontal',
  position = '50%',
  className = '',
  color = 'purple'
}) => {
  const isVertical = orientation === 'vertical'
  const selectedScheme = COLOR_SCHEMES[color] || COLOR_SCHEMES.purple

  const positionStyle = isVertical
    ? { left: position }
    : { top: position }

  const glowLayers = [
    {
      size: isVertical ? 'w-1 -ml-0.5' : 'h-1 -mt-0.5',
      blur: 'blur-sm',
      opacity: 'opacity-100',
      color: selectedScheme.glow[0]
    },
    {
      size: isVertical ? 'w-2 -ml-1' : 'h-2 -mt-1',
      blur: 'blur-md',
      opacity: 'opacity-80',
      color: selectedScheme.glow[1]
    },
    {
      size: isVertical ? 'w-4 -ml-2' : 'h-4 -mt-2',
      blur: 'blur-lg',
      opacity: 'opacity-60',
      color: selectedScheme.glow[2]
    }
  ]

  return (
    <div
      className={`glow-line-container ${isVertical ? 'glow-line-vertical' : 'glow-line-horizontal'} ${className}`}
      style={positionStyle}
    >
      <div
        className={`glow-line-core ${isVertical ? 'glow-line-gradient-vertical' : 'glow-line-gradient-horizontal'} glow-line-${selectedScheme.core}`}
      />
      <div
        className={`glow-line-white ${isVertical ? 'glow-line-white-vertical' : 'glow-line-white-horizontal'}`}
      />
      {glowLayers.map((layer, index) => (
        <div
          key={index}
          className={`glow-line-layer glow-line-${layer.color} ${layer.size} ${layer.blur} ${layer.opacity} ${isVertical ? 'glow-line-layer-vertical' : 'glow-line-layer-horizontal'}`}
        />
      ))}
    </div>
  )
}

export default GlowLine

