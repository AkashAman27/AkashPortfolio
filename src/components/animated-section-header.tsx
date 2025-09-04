'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedSectionHeaderProps {
  title: string
  subtitle: string
  className?: string
}

export default function AnimatedSectionHeader({ title, subtitle, className = '' }: AnimatedSectionHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !subtitleRef.current || !lineRef.current) return

    // Set initial state
    gsap.set([titleRef.current, subtitleRef.current, lineRef.current], {
      y: 30,
      opacity: 0,
      force3D: true
    })

    // Create timeline for sequential animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // Animate decorative line first
    tl.to(lineRef.current, {
      scaleX: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    })
    // Then title with slight overlap
    .to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.3')
    // Finally subtitle
    .to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4')

    // Cleanup
    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className={`text-center space-y-4 mb-16 ${className}`}>
      {/* Decorative line */}
      <div 
        ref={lineRef} 
        className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full opacity-0"
        style={{ transformOrigin: 'center', transform: 'scaleX(0)' }}
      />
      
      <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-white">
        {title}
      </h2>
      
      <p ref={subtitleRef} className="text-gray-400 max-w-2xl mx-auto font-extralight leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}