'use client'

import { useEffect, useRef, useState } from 'react'

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      setMousePosition({ x, y })
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative h-[400px] w-full rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, 
            rgba(139, 92, 246, 0.1) 0%, 
            rgba(59, 130, 246, 0.05) 50%, 
            transparent 70%),
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.9) 0%, 
            rgba(30, 41, 59, 0.8) 50%, 
            rgba(15, 23, 42, 0.9) 100%)
        `
      }}
    >
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => {
          // Use index-based positioning to avoid hydration issues
          const leftPercent = (i * 7 + 13) % 100
          const topPercent = (i * 11 + 17) % 100
          const delay = (i * 0.1) % 2
          const duration = 2 + (i * 0.05) % 3
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                transform: isMounted ? `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)` : 'translate(0px, 0px)'
              }}
            />
          )
        })}
      </div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: isMounted ? `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` : 'translate(0px, 0px)'
        }}
      />

      {/* Floating Code Block */}
      <div className="absolute inset-4 flex items-center justify-center">
        <div 
          className="relative max-w-md w-full backdrop-blur-sm bg-slate-800/40 rounded-xl border border-slate-700/50 shadow-2xl"
          style={{
            transform: isMounted ? `
              perspective(1000px) 
              rotateY(${mousePosition.x * 5}deg) 
              rotateX(${-mousePosition.y * 5}deg)
              translateZ(${Math.abs(mousePosition.x) * 10}px)
            ` : `
              perspective(1000px) 
              rotateY(0deg) 
              rotateX(0deg)
              translateZ(0px)
            `
          }}
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-slate-400 font-mono">ai-model.py</div>
          </div>

          {/* Code Content */}
          <div className="p-4 font-mono text-sm leading-relaxed">
            <div className="text-purple-400">import</div>
            <div className="text-slate-300 ml-2">torch</div>
            <div className="text-purple-400">from</div>
            <div className="text-slate-300 ml-2">transformers <span className="text-purple-400">import</span> <span className="text-emerald-400">AutoModel</span></div>
            
            <div className="mt-2 text-purple-400">class</div>
            <div className="text-blue-400 ml-2"><span className="text-emerald-400">LLMProcessor</span>:</div>
            <div className="text-purple-400 ml-4">def</div>
            <div className="text-blue-400 ml-6"><span className="text-emerald-400">__init__</span>(<span className="text-orange-400">self</span>):</div>
            <div className="text-indigo-400 ml-8">self.model = <span className="text-emerald-400">AutoModel</span></div>
            <div className="text-indigo-400 ml-8">self.tokenizer = <span className="text-yellow-400">&apos;gpt-4&apos;</span></div>
            
            <div className="mt-2 text-purple-400 ml-4">def</div>
            <div className="text-blue-400 ml-6"><span className="text-emerald-400">generate</span>(<span className="text-orange-400">self</span>, <span className="text-blue-400">prompt</span>):</div>
            <div className="text-purple-400 ml-8">return</div>
            <div className="text-slate-300 ml-10">self.model.<span className="text-emerald-400">predict</span>(prompt)</div>
          </div>

          {/* Interactive Elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Wireframe Icosahedron */}
        <div 
          className="absolute top-8 right-8 w-16 h-16 opacity-30"
          style={{
            transform: isMounted ? `
              rotate3d(1, 1, 0, ${mousePosition.x * 20}deg)
              translateX(${mousePosition.x * 10}px)
              translateY(${mousePosition.y * 10}px)
            ` : 'rotate3d(1, 1, 0, 0deg) translateX(0px) translateY(0px)',
            background: `conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.3), transparent)`,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        />
        
        {/* Floating Ring */}
        <div 
          className="absolute bottom-8 left-8 w-12 h-12 border-2 border-purple-400/20 rounded-full"
          style={{
            transform: isMounted ? `
              rotate(${mousePosition.x * 30}deg)
              translateX(${-mousePosition.x * 8}px)
              translateY(${-mousePosition.y * 8}px)
            ` : 'rotate(0deg) translateX(0px) translateY(0px)'
          }}
        />

        {/* Hexagon */}
        <div 
          className="absolute top-1/2 left-4 w-8 h-8 opacity-25"
          style={{
            transform: isMounted ? `
              rotate(${mousePosition.y * 45}deg)
              translateX(${mousePosition.y * 6}px)
            ` : 'rotate(0deg) translateX(0px)',
            background: 'rgba(59, 130, 246, 0.3)',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
          }}
        />
      </div>

      {/* Glowing Orb following mouse */}
      <div 
        className="absolute w-24 h-24 rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: isMounted ? `calc(50% + ${mousePosition.x * 100}px)` : '50%',
          top: isMounted ? `calc(50% + ${mousePosition.y * 100}px)` : '50%',
          background: `radial-gradient(circle, 
            rgba(139, 92, 246, 0.1) 0%, 
            rgba(139, 92, 246, 0.05) 40%, 
            transparent 70%)`,
          filter: 'blur(8px)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-xl"></div>
      </div>
    </div>
  )
}