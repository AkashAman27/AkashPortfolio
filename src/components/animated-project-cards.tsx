'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedProjectCardsProps {
  children: React.ReactNode
  className?: string
}

export default function AnimatedProjectCards({ children, className }: AnimatedProjectCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.project-card')
    
    // Disable CSS transitions to prevent conflicts
    gsap.set(cards, {
      transition: 'none'
    })

    // Set initial state - cards invisible and translated down
    gsap.set(cards, {
      y: 40,
      opacity: 0,
      force3D: true
    })

    // Create scroll-triggered animation with immediate responsiveness
    // First row (cards 0, 1, 2)
    gsap.to(Array.from(cards).slice(0, 3), {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power1.out',
      stagger: 0.08,
      force3D: true,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // Second row (cards 3, 4, 5) - minimal delay
    if (cards.length > 3) {
      gsap.to(Array.from(cards).slice(3, 6), {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out',
        stagger: 0.08,
        delay: 0.1,
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      })
    }

    // Re-enable CSS transitions for hover effects after initial animation
    setTimeout(() => {
      gsap.set(cards, {
        transition: 'transform 0.3s ease'
      })
    }, 1000)

    // Add hover animations for each card
    cards.forEach(card => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -8,
          scale: 1.03,
          duration: 0.25,
          ease: 'power1.out',
          force3D: true
        })
      }

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.25,
          ease: 'power1.out',
          force3D: true
        })
      }

      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)

      // Store event listeners for cleanup
      ;(card as any)._hoverListeners = { handleMouseEnter, handleMouseLeave }
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      cards.forEach(card => {
        const listeners = (card as any)._hoverListeners
        if (listeners) {
          card.removeEventListener('mouseenter', listeners.handleMouseEnter)
          card.removeEventListener('mouseleave', listeners.handleMouseLeave)
        }
      })
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}