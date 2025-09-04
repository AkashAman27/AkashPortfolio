'use client'

import { useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"
import { CopyButton } from './copy-button'

interface BlogContentProps {
  content: string
  className?: string
}

export default function BlogContent({ content, className }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Add copy buttons to all pre elements
      const preElements = contentRef.current.querySelectorAll('pre')
      
      preElements.forEach((pre) => {
        // Skip if already has copy button
        if (pre.querySelector('.copy-button-container')) return
        
        const code = pre.querySelector('code')
        if (code) {
          const codeText = code.textContent || ''
          
          // Add group class for hover effects
          pre.classList.add('group')
          
          // Create copy button container
          const buttonContainer = document.createElement('div')
          buttonContainer.className = 'copy-button-container absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity'
          
          // Create copy button
          const copyButton = document.createElement('button')
          copyButton.className = 'flex items-center justify-center h-8 w-8 rounded bg-slate-700 hover:bg-slate-600 transition-colors'
          copyButton.innerHTML = `
            <svg class="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          `
          
          let timeoutId: NodeJS.Timeout
          
          copyButton.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(codeText)
              
              // Show success state
              copyButton.innerHTML = `
                <svg class="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              `
              
              // Clear existing timeout
              if (timeoutId) clearTimeout(timeoutId)
              
              // Reset after 2 seconds
              timeoutId = setTimeout(() => {
                copyButton.innerHTML = `
                  <svg class="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                `
              }, 2000)
            } catch (err) {
              console.error('Failed to copy code:', err)
            }
          })
          
          buttonContainer.appendChild(copyButton)
          pre.appendChild(buttonContainer)
        }
      })
    }
  }, [content])

  return (
    <div 
      ref={contentRef}
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        // Base typography
        "prose-base md:prose-lg",
        
        // Headings styling - more space and better hierarchy
        "prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight",
        // Hide H1 tags since page already has title
        "prose-h1:hidden",
        "prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-2",
        "prose-h3:text-xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-4",
        "prose-h4:text-lg prose-h4:font-medium prose-h4:mt-6 prose-h4:mb-3",
        
        // Paragraphs - better spacing and line height
        "prose-p:leading-7 prose-p:mb-6 prose-p:text-muted-foreground",
        
        // Links styling
        "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
        
        // Lists - better spacing
        "prose-ul:space-y-2 prose-ol:space-y-2",
        "prose-li:marker:text-muted-foreground prose-li:mb-1",
        
        // Code styling - this is the key part for professional look
        "prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5",
        "prose-code:text-sm prose-code:font-mono prose-code:text-foreground",
        "prose-code:before:content-none prose-code:after:content-none",
        
        // Pre/code blocks - professional styling like Supabase
        "prose-pre:relative prose-pre:overflow-x-auto prose-pre:rounded-lg",
        "prose-pre:border prose-pre:border-border prose-pre:bg-muted/50",
        "prose-pre:p-0 prose-pre:m-0 prose-pre:mb-8 prose-pre:mt-6",
        
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/30",
        "prose-blockquote:bg-muted/30 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4",
        "prose-blockquote:rounded-r-lg prose-blockquote:my-6",
        "prose-blockquote:italic prose-blockquote:text-muted-foreground",
        
        // Tables
        "prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border",
        "prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-medium",
        "prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2",
        
        // Images
        "prose-img:rounded-lg prose-img:shadow-md prose-img:my-8",
        
        // Strong and emphasis
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:text-muted-foreground",
        
        // HR
        "prose-hr:border-border prose-hr:my-12",
        
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}