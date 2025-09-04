'use client'

import { ReactNode } from 'react'

interface SmoothScrollLinkProps {
  href: string
  children: ReactNode
  className?: string
  offset?: number
}

export default function SmoothScrollLink({ 
  href, 
  children, 
  className = '',
  offset = 80 
}: SmoothScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    const targetId = href.startsWith('#') ? href.slice(1) : href
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      const elementPosition = targetElement.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}