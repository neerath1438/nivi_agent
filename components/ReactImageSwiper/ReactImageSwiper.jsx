import React, { useEffect, useRef, useState, useCallback } from 'react'
import './ReactImageSwiper.css'

export const ImageSwiper = ({
  cards,
  cardWidth = 256,
  cardHeight = 352,
  className = ''
}) => {
  const cardStackRef = useRef(null)
  const isSwiping = useRef(false)
  const startX = useRef(0)
  const currentX = useRef(0)
  const animationFrameId = useRef(null)

  const [cardOrder, setCardOrder] = useState(() =>
    Array.from({ length: cards.length }, (_, i) => i)
  )

  const getCards = useCallback(() => {
    if (!cardStackRef.current) return []
    return Array.from(cardStackRef.current.querySelectorAll('.image-card'))
  }, [])

  const getActiveCard = useCallback(() => {
    return getCards()[0] || null
  }, [getCards])

  const updateCardPositions = useCallback(() => {
    getCards().forEach((card, i) => {
      card.style.setProperty('--i', i.toString())
      card.style.setProperty('--swipe-x', '0px')
      card.style.setProperty('--swipe-rotate', '0deg')
      card.style.opacity = '1'
      card.style.transition = 'transform 0.5s ease, opacity 0.5s ease'
    })
  }, [getCards])

  const applySwipeStyles = useCallback(
    (deltaX) => {
      const card = getActiveCard()
      if (!card) return

      const rotation = deltaX * 0.1
      const opacity = 1 - Math.abs(deltaX) / (cardWidth * 1.5)

      card.style.setProperty('--swipe-x', `${deltaX}px`)
      card.style.setProperty('--swipe-rotate', `${rotation}deg`)
      card.style.opacity = opacity.toString()
    },
    [getActiveCard, cardWidth]
  )

  const handleStart = useCallback(
    (clientX) => {
      if (isSwiping.current) return

      isSwiping.current = true
      startX.current = clientX
      currentX.current = clientX

      const card = getActiveCard()
      if (card) {
        card.style.transition = 'none'
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    },
    [getActiveCard]
  )

  const handleMove = useCallback(
    (clientX) => {
      if (!isSwiping.current) return

      currentX.current = clientX

      animationFrameId.current = requestAnimationFrame(() => {
        const deltaX = currentX.current - startX.current
        applySwipeStyles(deltaX)
      })
    },
    [applySwipeStyles]
  )

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return

    isSwiping.current = false

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }

    const deltaX = currentX.current - startX.current
    const threshold = cardWidth / 3
    const card = getActiveCard()

    if (!card) return

    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease'

    if (Math.abs(deltaX) > threshold) {
      const direction = Math.sign(deltaX)
      const swipeOutX = direction * (cardWidth * 1.5)

      card.style.setProperty('--swipe-x', `${swipeOutX}px`)
      card.style.setProperty('--swipe-rotate', `${direction * 15}deg`)
      card.style.opacity = '0'

      setTimeout(() => {
        setCardOrder((prev) => [...prev.slice(1), prev[0]])
      }, 300)
    } else {
      applySwipeStyles(0)
    }
  }, [getActiveCard, applySwipeStyles, cardWidth])

  useEffect(() => {
    const element = cardStackRef.current
    if (!element) return

    const onPointerDown = (e) => handleStart(e.clientX)
    const onPointerMove = (e) => handleMove(e.clientX)
    const onPointerUp = () => handleEnd()
    const onPointerLeave = () => handleEnd()

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointerleave', onPointerLeave)

    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointerleave', onPointerLeave)

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [handleStart, handleMove, handleEnd])

  useEffect(() => {
    updateCardPositions()
  }, [cardOrder, updateCardPositions])

  return (
    <section
      ref={cardStackRef}
      className={`image-swiper-container ${className}`}
      style={{
        width: cardWidth + 32,
        height: cardHeight + 32,
        perspective: '1000px',
        touchAction: 'none'
      }}
    >
      {cardOrder.map((originalIndex, displayIndex) => {
        const card = cards[originalIndex]

        return (
          <article
            key={card.id}
            className="image-card"
            style={{
              '--i': displayIndex.toString(),
              '--swipe-x': '0px',
              '--swipe-rotate': '0deg',
              width: cardWidth,
              height: cardHeight,
              zIndex: cards.length - displayIndex,
              transform: `
                translateY(calc(var(--i) * 10px))
                translateZ(calc(var(--i) * -45px))
                translateX(var(--swipe-x))
                rotate(var(--swipe-rotate))
              `
            }}
          >
            <img
              src={card.imageUrl}
              alt={card.title}
              className="image-card-img"
              draggable={false}
              onError={(e) => {
                const target = e.target
                target.onerror = null
                target.src = `https://placehold.co/${cardWidth}x${cardHeight}/2d3748/e2e8f0?text=Image+Not+Found`
              }}
            />
            <div className="image-card-overlay">
              <h3 className="image-card-title">{card.title}</h3>
            </div>
          </article>
        )
      })}
    </section>
  )
}

const ReactImageSwiper = ({ cards, cardWidth, cardHeight, className }) => {
  const defaultCards = [
    {
      id: 1,
      imageUrl: 'https://i.pinimg.com/736x/d6/8a/12/d68a121e960094f99ad8acd37505fb7d.jpg',
      title: 'Crimson Forest'
    },
    {
      id: 2,
      imageUrl: 'https://i.pinimg.com/736x/21/16/f7/2116f71f9d51d875e44d809f074ff079.jpg',
      title: 'Misty Mountains'
    },
    {
      id: 3,
      imageUrl: 'https://i.pinimg.com/1200x/fe/c2/0d/fec20d2958059b8463bffb138d4eaac6.jpg',
      title: 'Floating Islands'
    },
    {
      id: 4,
      imageUrl: 'https://i.pinimg.com/736x/84/dc/62/84dc62de850a34a9d420c97f3a2d58f4.jpg',
      title: 'Crystal Cave'
    },
    {
      id: 5,
      imageUrl: 'https://i.pinimg.com/1200x/be/c3/7e/bec37e2c43e703f922f887db2578ce2e.jpg',
      title: 'Sunset Peaks'
    },
    {
      id: 6,
      imageUrl: 'https://i.pinimg.com/736x/47/dd/47/47dd47b0d66c2fa641e03e370bcb5433.jpg',
      title: 'Night Sky'
    },
    {
      id: 7,
      imageUrl: 'https://i.pinimg.com/736x/05/01/bc/0501bcd327d9df915e83154bbf9456e3.jpg',
      title: 'Ancient Ruins'
    },
    {
      id: 8,
      imageUrl: 'https://i.pinimg.com/736x/c1/46/be/c146bebffca026d2c4fa76cc85aac917.jpg',
      title: 'Magical Tree'
    },
    {
      id: 9,
      imageUrl: 'https://i.pinimg.com/736x/91/7a/51/917a51df0d444def3cade8d626305a67.jpg',
      title: 'Celestial Waters'
    }
  ]

  return (
    <div className="image-swiper-wrapper">
      <ImageSwiper
        cards={cards || defaultCards}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        className={className}
      />
    </div>
  )
}

export default ReactImageSwiper

