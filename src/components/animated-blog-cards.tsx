'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedBlogCardsProps {
  children: React.ReactNode
  className?: string
}

export default function AnimatedBlogCards({ children, className }: AnimatedBlogCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.blog-card')
    
    // Disable CSS transitions to prevent conflicts
    gsap.set(cards, {
      transition: 'none'
    })

    // Set initial state - cards invisible with slide-in from left/right alternating
    cards.forEach((card, index) => {
      gsap.set(card, {
        x: index % 2 === 0 ? -80 : 80, // Alternate from left and right
        y: 40,
        opacity: 0,
        rotation: index % 2 === 0 ? -3 : 3, // Slight rotation variation
        scale: 0.95,
        force3D: true
      })
    })

    // Create scroll-triggered animation with wave-like entrance
    // First row (cards 0, 1, 2) with alternating slide-in
    gsap.to(Array.from(cards).slice(0, 3), {
      x: 0,
      y: 0,
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 0.9,
      ease: 'back.out(1.2)',
      stagger: 0.15,
      force3D: true,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // Second row (cards 3, 4, 5) with delayed wave effect
    if (cards.length > 3) {
      gsap.to(Array.from(cards).slice(3, 6), {
        x: 0,
        y: 0,
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 0.9,
        ease: 'back.out(1.2)',
        stagger: 0.15,
        delay: 0.2,
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      })
    }

    // Add gentle floating effect on scroll
    cards.forEach((card, index) => {
      gsap.to(card, {
        y: index % 2 === 0 ? -15 : -25, // Varied floating heights
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2, // Slower scrub for gentler effect
        }
      })
    })

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