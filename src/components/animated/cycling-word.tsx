'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CyclingWord({
  words,
  className,
  hold = 1.1,
}: {
  words: string[]
  className?: string
  hold?: number // seconds to hold each word before animating out
}) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const animRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current || !animRef.current || !measureRef.current || !words?.length) return

    const container = containerRef.current
    const anim = animRef.current
    const measurer = measureRef.current

    // Measure widest word to lock container width and prevent reflow/wrap
    let max = 0
    Array.from(measurer.children).forEach((child) => {
      const w = (child as HTMLElement).offsetWidth
      if (w > max) max = w
    })
    container.style.width = `${max}px`

    // Ensure consistent baseline/height and prevent jumpy layout
    container.style.display = 'inline-block'
    container.style.verticalAlign = 'baseline'
    container.style.lineHeight = '1em'
    container.style.height = '1em'
    container.style.overflow = 'hidden'

    // Ensure consistent baseline/height
    container.style.display = 'inline-block'
    container.style.verticalAlign = 'baseline'
    container.style.lineHeight = '1em'
    container.style.height = '1em'
    container.style.overflow = 'hidden'

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power3.out' } })
    words.forEach((word) => {
      tl.call(() => { anim.textContent = word })
        .fromTo(anim, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 })
        .to(anim, { yPercent: -100, opacity: 0, duration: 0.45, ease: 'power3.in', delay: hold })
    })

    return () => { tl.kill() }
  }, [words, hold])

  return (
    <span ref={containerRef} className="inline-block align-baseline whitespace-nowrap relative">
      {/* Animated word (apply visual classes here e.g., gradient clip) */}
      <span ref={animRef} className={`block will-change-transform ${className || ''}`} />
      {/* Hidden measurer to compute max width without affecting layout (use same text styling) */}
      <span ref={measureRef} aria-hidden className="absolute opacity-0 pointer-events-none -z-10">
        {words.map((w) => (
          <span key={w} className={`inline-block px-px ${className || ''}`}>{w}</span>
        ))}
      </span>
    </span>
  )
}
