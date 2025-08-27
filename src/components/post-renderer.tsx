import React from 'react'
import type { ContentSection } from '@/components/editor/section-editor'

interface PostRendererProps {
  sections: ContentSection[]
  className?: string
}

export default function PostRenderer({ sections, className = '' }: PostRendererProps) {
  const renderSection = (section: ContentSection, index: number) => {
    switch (section.section_type) {
      case 'heading':
        const HeadingTag = `h${section.metadata?.level || 2}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag key={section.id || index} className="font-bold mb-4">
            {section.content}
          </HeadingTag>
        )

      case 'quote':
        return (
          <blockquote key={section.id || index} className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
            {section.content}
          </blockquote>
        )

      case 'list':
        const items = section.content.split('\n').filter(item => item.trim())
        const ListTag = section.metadata?.ordered ? 'ol' : 'ul'
        return (
          <ListTag key={section.id || index} className={`mb-4 ${section.metadata?.ordered ? 'list-decimal' : 'list-disc'} list-inside`}>
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">{item}</li>
            ))}
          </ListTag>
        )

      case 'code':
        return (
          <div key={section.id || index} className="mb-4">
            {section.metadata?.language && (
              <div className="bg-muted px-3 py-1 text-xs font-mono rounded-t-md border-b">
                {section.metadata.language}
              </div>
            )}
            <pre className={`bg-muted p-4 ${section.metadata?.language ? 'rounded-b-md' : 'rounded-md'} overflow-x-auto`}>
              <code className="text-sm font-mono">{section.content}</code>
            </pre>
          </div>
        )

      case 'image':
        return (
          <div key={section.id || index} className="mb-4">
            <img 
              src={section.content} 
              alt={section.metadata?.alt || 'Content image'} 
              className="max-w-full h-auto rounded-lg border"
            />
            {section.metadata?.alt && (
              <p className="text-sm text-muted-foreground mt-2 text-center italic">
                {section.metadata.alt}
              </p>
            )}
          </div>
        )

      case 'markdown':
        return (
          <div key={section.id || index} className="mb-4 prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{section.content}</pre>
          </div>
        )

      case 'wysiwyg':
        return (
          <div 
            key={section.id || index} 
            className="mb-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )

      default:
        return (
          <div key={section.id || index} className="mb-4">
            {section.content}
          </div>
        )
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  )
}