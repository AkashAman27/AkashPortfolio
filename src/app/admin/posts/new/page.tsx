'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Save, ArrowLeft, X, FileText, Type, Layout } from 'lucide-react'
import Link from 'next/link'
// import WysiwygEditor from '@/components/editor/wysiwyg-editor'
import ImageUpload from '@/components/editor/image-upload'
import SectionEditor, { type ContentSection } from '@/components/editor/section-editor'
import AdminWrapper from '@/components/auth/admin-wrapper'

interface Tag {
  id: number
  slug: string
  name: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [series, setSeries] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editorMode, setEditorMode] = useState<'simple' | 'sections'>('simple')
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [sections, setSections] = useState<ContentSection[]>([])
  const [simpleEditorType, setSimpleEditorType] = useState<'markdown' | 'wysiwyg'>('markdown')

  const supabase = createClient()

  // Load tags when component mounts
  React.useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (!error && data) {
      setTags(data)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle))
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    // Check content based on editor mode
    if (editorMode === 'simple' && !content.trim()) {
      setError('Content is required')
      return
    }

    if (editorMode === 'sections' && sections.length === 0) {
      setError('At least one content section is required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Prepare content based on editor mode
      let finalContent = content

      if (editorMode === 'sections') {
        // Generate markdown representation from sections for search/preview
        finalContent = sections.map(section => {
          switch (section.section_type) {
            case 'heading':
              const level = '#'.repeat(section.metadata?.level || 2)
              return `${level} ${section.content}\n`
            case 'quote':
              return `> ${section.content}\n`
            case 'list':
              const items = section.content.split('\n').filter(item => item.trim())
              return items.map((item, index) => 
                section.metadata?.ordered 
                  ? `${index + 1}. ${item}` 
                  : `- ${item}`
              ).join('\n') + '\n'
            case 'code':
              const lang = section.metadata?.language || ''
              return `\`\`\`${lang}\n${section.content}\n\`\`\`\n`
            case 'image':
              const alt = section.metadata?.alt || 'Image'
              return `![${alt}](${section.content})\n`
            default:
              return section.content + '\n'
          }
        }).join('\n')
      }

      // Calculate reading time (approximately 200 words per minute)
      const wordCount = finalContent.split(/\s+/).length
      const readingMinutes = Math.max(1, Math.ceil(wordCount / 200))

      // Create post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title,
          slug,
          excerpt,
          content_md: finalContent,
          author_id: user.id,
          status,
          published_at: status === 'published' ? new Date().toISOString() : null,
          reading_minutes: readingMinutes,
          series: series || null
        })
        .select()
        .single()

      if (postError) throw postError

      // If using sections, save them to content_sections table
      if (editorMode === 'sections' && sections.length > 0) {
        const sectionsToInsert = sections.map(section => ({
          post_id: post.id,
          section_type: section.section_type,
          content: section.content,
          order_index: section.order_index,
          metadata: section.metadata
        }))

        const { error: sectionsError } = await supabase
          .from('content_sections')
          .insert(sectionsToInsert)

        if (sectionsError) throw sectionsError
      }

      // Add tags
      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map(tagId => ({
          post_id: post.id,
          tag_id: tagId
        }))
        
        const { error: tagError } = await supabase
          .from('post_tags')
          .insert(tagInserts)
        
        if (tagError) throw tagError
      }

      setSuccess('Post created successfully!')
      
      // Redirect to edit page
      setTimeout(() => {
        router.push(`/admin/posts/${post.id}/edit`)
      }, 1500)
    } catch (err: any) {
      setError('Failed to create post: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const insertImageIntoMarkdown = (url: string, alt?: string) => {
    if (editorMode === 'simple') {
      const imageMarkdown = `![${alt || 'Image'}](${url})\n\n`
      setContent(prev => prev + imageMarkdown)
    }
    setShowImageUpload(false)
  }

  const PostCreationContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground">
              Write a new blog post
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={editorMode === 'simple' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditorMode('simple')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Simple Editor
                    </Button>
                    <Button
                      type="button"
                      variant={editorMode === 'sections' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditorMode('sections')}
                    >
                      <Layout className="mr-2 h-4 w-4" />
                      Section Editor
                    </Button>
                  </div>
                </div>

                {editorMode === 'simple' ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={simpleEditorType === 'markdown' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSimpleEditorType('markdown')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Markdown
                      </Button>
                      <Button
                        type="button"
                        variant={simpleEditorType === 'wysiwyg' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSimpleEditorType('wysiwyg')}
                      >
                        <Type className="mr-2 h-4 w-4" />
                        WYSIWYG
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImageUpload(!showImageUpload)}
                      >
                        Add Image
                      </Button>
                    </div>

                    {simpleEditorType === 'markdown' ? (
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content in Markdown..."
                        rows={20}
                        className="font-mono"
                      />
                    ) : (
                      <div className="text-center p-8 text-muted-foreground">
                        WYSIWYG Editor temporarily disabled for testing. Use Markdown editor instead.
                      </div>
                    )}

                    {showImageUpload && (
                      <ImageUpload
                        onImageSelect={insertImageIntoMarkdown}
                        className="mt-4"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-md border p-4 bg-muted/50">
                      <h4 className="font-semibold mb-2">Section-Based Editor</h4>
                      <p className="text-sm text-muted-foreground">
                        Create your post using different content sections. Each section can be markdown, rich text, images, headings, quotes, lists, or code blocks.
                      </p>
                    </div>
                    <SectionEditor 
                      sections={sections}
                      onChange={setSections}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: 'draft' | 'published' | 'scheduled') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="series">Series (Optional)</Label>
                <Input
                  id="series"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  placeholder="Enter series name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Select tags for this post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId)
                      return tag ? (
                        <Badge key={tagId} variant="default" className="flex items-center gap-1">
                          {tag.name}
                          <button
                            onClick={() => toggleTag(tagId)}
                            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {tags.filter(tag => !selectedTags.includes(tag.id)).map(tag => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  return (
    <AdminWrapper>
      <PostCreationContent />
    </AdminWrapper>
  )
}