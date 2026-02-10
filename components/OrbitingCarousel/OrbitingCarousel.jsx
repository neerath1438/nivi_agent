import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import './OrbitingCarousel.css'

const people = [
  {
    id: 1,
    name: 'Albert Einstein',
    role: 'Theoretical Physicist',
    email: 'einstein@example.com',
    profile: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg'
  },
  {
    id: 2,
    name: 'Isaac Newton',
    role: 'Physicist & Mathematician',
    email: 'newton@example.com',
    profile: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/1200px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg'
  },
  {
    id: 3,
    name: 'Marie Curie',
    role: 'Physicist & Chemist',
    email: 'curie@example.com',
    profile: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Marie_Curie_c1920.jpg'
  },
  {
    id: 4,
    name: 'Nikola Tesla',
    role: 'Inventor & Engineer',
    email: 'tesla@example.com',
    profile: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/N.Tesla.JPG'
  },
  {
    id: 5,
    name: 'Charles Darwin',
    role: 'Naturalist & Biologist',
    email: 'darwin@example.com',
    profile: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-79035252.jpg?crop=1xw:1.0xh;center,top&resize=640:*'
  },
  {
    id: 6,
    name: 'Galileo Galilei',
    role: 'Astronomer & Physicist',
    email: 'galileo@example.com',
    profile: 'https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/galileo-galilei-gettyimages-51246872?_a=BAVAZGDX0'
  },
  {
    id: 7,
    name: 'Stephen Hawking',
    role: 'Theoretical Physicist',
    email: 'hawking@example.com',
    profile: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg'
  },
  {
    id: 8,
    name: 'Richard Feynman',
    role: 'Theoretical Physicist',
    email: 'feynman@example.com',
    profile: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiz7DeuUmHN7TiT3xf7cV7UPBJNDtEvjNZcgMmNElTmOJYaec6zQI0UiLU04jZP6hqkeLcrnaC5NP4WC_zRQzP3_QhLumNxyzPOsC-WEmWQyYsadq1Eg_V_jEjDfCdddeQgJjY_OOB1KLMj6o2ShA6ycHwM91I430Yr9tkYTn6759jDmcGAsONOACbi/w1200-h630-p-k-no-nu/richard%20feynman%20quotes%20atheism%20religion%20science.png'
  }
]

const safeImage = (e) => {
  const target = e.target
  target.src = 'https://placehold.co/100x100/E0E7FF/4338CA?text=Error'
}

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint)
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [breakpoint])

  return isMobile
}

export default function OrbitCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useIsMobile()
  const containerRadius = isMobile ? 130 : 200
  const profileSize = isMobile ? 60 : 80
  const containerSize = containerRadius * 2 + 100

  const getRotation = useCallback(
    (index) => (index - activeIndex) * (360 / people.length),
    [activeIndex]
  )

  const next = () => setActiveIndex((i) => (i + 1) % people.length)
  const prev = () => setActiveIndex((i) => (i - 1 + people.length) % people.length)

  const handleProfileClick = useCallback(
    (index) => {
      if (index === activeIndex) return
      setActiveIndex(index)
    },
    [activeIndex]
  )

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') prev()
      else if (event.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="orbiting-carousel-container">
      <div
        className="orbiting-carousel-wrapper"
        style={{
          width: containerSize,
          height: containerSize
        }}
      >
        <div
          className="orbiting-carousel-circle"
          style={{
            width: containerRadius * 2,
            height: containerRadius * 2
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={people[activeIndex].id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="orbiting-carousel-card"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              src={people[activeIndex].profile}
              alt={people[activeIndex].name}
              onError={safeImage}
              className="orbiting-carousel-profile-img"
            />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <h2 className="orbiting-carousel-name">{people[activeIndex].name}</h2>
              <div className="orbiting-carousel-role">
                <Briefcase size={12} className="orbiting-carousel-icon" />
                <span className="orbiting-carousel-role-text">{people[activeIndex].role}</span>
              </div>
              <div className="orbiting-carousel-email">
                <Mail size={12} className="orbiting-carousel-icon" />
                <span className="orbiting-carousel-email-text">{people[activeIndex].email}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="orbiting-carousel-actions"
            >
              <button onClick={prev} className="orbiting-carousel-nav-btn">
                <ChevronLeft size={16} />
              </button>
              <button className="orbiting-carousel-connect-btn">Connect</button>
              <button onClick={next} className="orbiting-carousel-nav-btn">
                <ChevronRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {people.map((p, i) => {
          const rotation = getRotation(i)
          return (
            <motion.div
              key={p.id}
              animate={{
                transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`
              }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              className="orbiting-carousel-orbit-item"
              style={{
                width: profileSize,
                height: profileSize
              }}
            >
              <motion.div
                animate={{ rotate: -rotation }}
                transition={{
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className="orbiting-carousel-orbit-inner"
              >
                <motion.img
                  src={p.profile}
                  alt={p.name}
                  onError={safeImage}
                  onClick={() => handleProfileClick(i)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`orbiting-carousel-orbit-img ${
                    i === activeIndex ? 'orbiting-carousel-orbit-img-active' : 'orbiting-carousel-orbit-img-inactive'
                  }`}
                />
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

