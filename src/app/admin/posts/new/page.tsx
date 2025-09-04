'use client'

import React, { useState, useCallback, memo } from 'react'
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
import { AlertCircle, Save, ArrowLeft, X, FileText } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/editor/image-upload'

interface Tag {
  id: number
  slug: string
  name: string
}

// Memoized tag selector to avoid rerendering while typing in content
const TagSelector = memo(function TagSelector({
  tags,
  selectedTags,
  toggleTag,
}: {
  tags: Tag[]
  selectedTags: number[]
  toggleTag: (tagId: number) => void
}) {
  return (
    <div className="space-y-3">
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId)
            return tag ? (
              <Badge key={tagId} variant="default" className="flex items-center gap-1">
                {tag.name}
                <button onClick={() => toggleTag(tagId)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tags
          .filter((tag) => !selectedTags.includes(tag.id))
          .map((tag) => (
            <Badge key={tag.id} variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => toggleTag(tag.id)}>
              {tag.name}
            </Badge>
          ))}
      </div>
    </div>
  )
})

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
  const [showImageUpload, setShowImageUpload] = useState(false)

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

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }, [])

  // Auto-generate slug from title with debounce
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle)
    // Only auto-generate slug if it's empty or was auto-generated from previous title
    setSlug(prevSlug => {
      const currentTitleSlug = generateSlug(title)
      if (!prevSlug.trim() || prevSlug === currentTitleSlug) {
        return generateSlug(newTitle)
      }
      return prevSlug
    })
  }, [title, generateSlug])

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    // Require content
    if (!content.trim()) {
      setError('Content is required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Content is pure Markdown
      const finalContent = content

      // Calculate reading time (approximately 200 words per minute)
      const wordCount = finalContent.trim().split(/\s+/).filter(Boolean).length
      const readingMinutes = Math.max(1, Math.ceil(wordCount / 200))

      // Create post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title,
          slug,
          excerpt,
          content_md: finalContent || '',
          content_html: null,
          author_id: user.id,
          status,
          published_at: status === 'published' ? new Date().toISOString() : null,
          reading_minutes: readingMinutes,
          series: series || null
        })
        .select()
        .single()

      if (postError) throw postError

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

  const toggleTag = useCallback((tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }, [])

  const insertImageIntoMarkdown = useCallback((url: string, alt?: string) => {
    const imageMarkdown = `![${alt || 'Image'}](${url})\n\n`
    setContent(prev => prev + imageMarkdown)
    setShowImageUpload(false)
  }, [])

  // Avoid defining React components inside components as it causes remounts on every render.
  // Return JSX directly to keep subtree stable during typing.
  return (
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
                  <Label htmlFor="content" className="font-medium">Content (Markdown)</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowImageUpload(!showImageUpload)}
                    >
                      Add Image
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content in Markdown..."
                    rows={20}
                    className="font-mono resize-y"
                    spellCheck={false}
                  />
                </div>

                {showImageUpload && (
                  <ImageUpload
                    onImageSelect={insertImageIntoMarkdown}
                    className="mt-4"
                  />
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
              <TagSelector tags={tags} selectedTags={selectedTags} toggleTag={toggleTag} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
