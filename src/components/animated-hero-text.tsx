'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface AnimatedHeroTextProps {
  className?: string
}

export default function AnimatedHeroText({ className }: AnimatedHeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hiRef = useRef<HTMLDivElement>(null)
  const imRef = useRef<HTMLDivElement>(null)
  const akashRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create a GSAP timeline
    const tl = gsap.timeline()

    // Function to split text into individual letters
    const splitTextIntoLetters = (element: HTMLElement) => {
      const text = element.textContent || ''
      const letters = text.split('').map((letter, index) => {
        const span = document.createElement('span')
        span.textContent = letter === ' ' ? '\u00A0' : letter // Non-breaking space
        span.style.display = 'inline-block'
        span.style.transform = 'translateY(100px)' // Start position
        span.style.opacity = '0'
        return span
      })
      
      element.innerHTML = ''
      letters.forEach(letter => element.appendChild(letter))
      return letters
    }

    // Split each word into letters
    const hiLetters = hiRef.current ? splitTextIntoLetters(hiRef.current) : []
    const imLetters = imRef.current ? splitTextIntoLetters(imRef.current) : []
    const akashLetters = akashRef.current ? splitTextIntoLetters(akashRef.current) : []

    // Create the staggered animation (original)
    tl.to([...hiLetters, ...imLetters], {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.05,
    })
    .to(akashLetters, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.08,
    }, '-=0.3')

    // Cleanup function
    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      <div className="flex flex-wrap items-baseline gap-2 md:gap-4">
        <div ref={hiRef} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          Hi,
        </div>
        <div ref={imRef} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          I'm
        </div>
        <div 
          ref={akashRef} 
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-purple-400"
        >
          Akash
        </div>
      </div>
    </div>
  )
}
