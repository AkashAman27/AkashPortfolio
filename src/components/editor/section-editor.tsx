'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  FileText, 
  Type, 
  Image as ImageIcon,
  Heading,
  Quote,
  List,
  Code,
  Grip
} from 'lucide-react'
import WysiwygEditor from './wysiwyg-editor'
import ImageUpload from './image-upload'

export interface ContentSection {
  id?: number | string // Allow both for new vs existing sections
  post_id?: number
  section_type: 'markdown' | 'wysiwyg' | 'image' | 'heading' | 'quote' | 'list' | 'code'
  content: string
  order_index: number
  metadata?: {
    level?: number // For headings (1-6)
    language?: string // For code blocks
    alt?: string // For images
    ordered?: boolean // For lists
  }
}

interface SectionEditorProps {
  sections: ContentSection[]
  onChange: (sections: ContentSection[]) => void
}

const SECTION_TYPES = [
  { value: 'markdown', label: 'Markdown', icon: FileText },
  { value: 'wysiwyg', label: 'Rich Text', icon: Type },
  { value: 'heading', label: 'Heading', icon: Heading },
  { value: 'image', label: 'Image', icon: ImageIcon },
  { value: 'quote', label: 'Quote', icon: Quote },
  { value: 'list', label: 'List', icon: List },
  { value: 'code', label: 'Code Block', icon: Code },
] as const

export default function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addSection = (type: ContentSection['section_type']) => {
    const newSection: ContentSection = {
      id: generateId(),
      section_type: type,
      content: '',
      order_index: sections.length,
      metadata: type === 'heading' ? { level: 2 } : 
                type === 'list' ? { ordered: false } :
                type === 'code' ? { language: 'javascript' } : undefined
    }
    onChange([...sections, newSection])
  }

  const updateSection = (id: string, updates: Partial<ContentSection>) => {
    onChange(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ))
  }

  const removeSection = (id: string) => {
    onChange(sections.filter(section => section.id !== id))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < sections.length) {
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
      
      // Update order_index for all sections
      const updatedSections = newSections.map((section, idx) => ({
        ...section,
        order_index: idx
      }))
      
      onChange(updatedSections)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) return
    
    const newSections = [...sections]
    const draggedSection = newSections[draggedIndex]
    
    newSections.splice(draggedIndex, 1)
    newSections.splice(dropIndex, 0, draggedSection)
    
    // Update order_index for all sections
    const updatedSections = newSections.map((section, idx) => ({
      ...section,
      order_index: idx
    }))
    
    onChange(updatedSections)
    setDraggedIndex(null)
  }

  const renderSectionContent = (section: ContentSection, index: number) => {
    switch (section.section_type) {
      case 'markdown':
        return (
          <Textarea
            value={section.content}
            onChange={(e) => updateSection(section.id, { content: e.target.value })}
            placeholder="Write in Markdown..."
            rows={10}
            className="font-mono resize-none"
          />
        )

      case 'wysiwyg':
        return (
          <WysiwygEditor
            content={section.content}
            onChange={(content) => updateSection(section.id, { content })}
            placeholder="Write with the rich text editor..."
          />
        )

      case 'heading':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`heading-level-${section.id}`}>Level:</Label>
              <Select
                value={String(section.metadata?.level || 2)}
                onValueChange={(value) => 
                  updateSection(section.id, { 
                    metadata: { ...section.metadata, level: parseInt(value) }
                  })
                }
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <SelectItem key={level} value={String(level)}>H{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              value={section.content}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Heading text..."
              className={`font-semibold ${
                section.metadata?.level === 1 ? 'text-3xl' :
                section.metadata?.level === 2 ? 'text-2xl' :
                section.metadata?.level === 3 ? 'text-xl' :
                section.metadata?.level === 4 ? 'text-lg' : 'text-base'
              }`}
            />
          </div>
        )

      case 'quote':
        return (
          <Textarea
            value={section.content}
            onChange={(e) => updateSection(section.id, { content: e.target.value })}
            placeholder="Quote text..."
            rows={4}
            className="italic border-l-4 border-primary pl-4"
          />
        )

      case 'list':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <Label>List Type:</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={!section.metadata?.ordered ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => 
                    updateSection(section.id, { 
                      metadata: { ...section.metadata, ordered: false }
                    })
                  }
                >
                  Bullet List
                </Button>
                <Button
                  type="button"
                  variant={section.metadata?.ordered ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => 
                    updateSection(section.id, { 
                      metadata: { ...section.metadata, ordered: true }
                    })
                  }
                >
                  Numbered List
                </Button>
              </div>
            </div>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Enter list items (one per line)..."
              rows={6}
            />
          </div>
        )

      case 'code':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`code-lang-${section.id}`}>Language:</Label>
              <Input
                id={`code-lang-${section.id}`}
                value={section.metadata?.language || ''}
                onChange={(e) => 
                  updateSection(section.id, { 
                    metadata: { ...section.metadata, language: e.target.value }
                  })
                }
                placeholder="javascript, python, etc."
                className="w-32"
              />
            </div>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Enter code..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        )

      case 'image':
        return (
          <div className="space-y-3">
            <Input
              value={section.metadata?.alt || ''}
              onChange={(e) => 
                updateSection(section.id, { 
                  metadata: { ...section.metadata, alt: e.target.value }
                })
              }
              placeholder="Alt text (optional)"
            />
            {section.content ? (
              <div className="space-y-2">
                <img 
                  src={section.content} 
                  alt={section.metadata?.alt || 'Content image'} 
                  className="max-w-full h-auto rounded-lg border"
                />
                <Input
                  value={section.content}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  placeholder="Image URL"
                />
              </div>
            ) : (
              <ImageUpload
                onImageSelect={(url, alt) => {
                  updateSection(section.id, { 
                    content: url,
                    metadata: { ...section.metadata, alt: alt || section.metadata?.alt }
                  })
                }}
              />
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card
          key={section.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className={`transition-all ${
            draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Grip className="h-4 w-4 text-muted-foreground cursor-grab" />
                <CardTitle className="text-sm font-medium">
                  Section {index + 1}: {SECTION_TYPES.find(t => t.value === section.section_type)?.label}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sections.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderSectionContent(section, index)}
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Add a new content section</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SECTION_TYPES.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSection(value)}
                  className="flex items-center space-x-1"
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}