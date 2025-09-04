'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface AnimatedSubtitleProps {
  text: string
  className?: string
}

export default function AnimatedSubtitle({ text, className }: AnimatedSubtitleProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !text) return

    // Split text into individual words
    const words = text.trim().split(' ').filter(word => word.length > 0)
    const wordElements: HTMLSpanElement[] = []

    // Clear container and create span elements for each word
    containerRef.current.innerHTML = ''
    
    words.forEach((word, index) => {
      const span = document.createElement('span')
      span.textContent = word
      span.style.display = 'inline-block'
      span.style.marginRight = index === words.length - 1 ? '0' : '0.5rem' // No margin on last word
      span.className = 'word-span' // Add class for easier debugging
      
      // Set initial state - invisible and translated from left
      gsap.set(span, {
        x: -30,
        opacity: 0,
        force3D: true
      })
      
      if (containerRef.current) {
        containerRef.current.appendChild(span)
        wordElements.push(span)
      }
    })

    // Small delay to ensure DOM is ready
    const animationTimer = setTimeout(() => {
      // Animate each word from left to right with stagger
      gsap.to(wordElements, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power1.out',
        stagger: 0.08,
        delay: 1.2, // Start after hero text animation completes
        force3D: true
      })
    }, 50)

    // Cleanup
    return () => {
      clearTimeout(animationTimer)
      gsap.killTweensOf(wordElements)
    }
  }, [text])

  return (
    <div ref={containerRef} className={className}>
    </div>
  )
}