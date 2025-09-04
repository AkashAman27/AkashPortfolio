'use client'

import { useState, useEffect } from 'react'
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
import { AlertCircle, Save, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/editor/image-upload'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content_md: string
  content_html: string | null
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  reading_minutes: number | null
  series: string | null
}

interface Tag {
  id: number
  slug: string
  name: string
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  // Markdown-only editor
  const [showImageUpload, setShowImageUpload] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (resolvedParams?.id) {
      loadPost()
      loadTags()
    }
  }, [resolvedParams?.id])

  const loadPost = async () => {
    if (!resolvedParams?.id) return
    
    try {
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (postError) throw postError

      setPost(postData)

      // Load post tags
      const { data: postTags, error: tagError } = await supabase
        .from('post_tags')
        .select('tag_id')
        .eq('post_id', resolvedParams.id)

      if (!tagError && postTags) {
        setSelectedTags(postTags.map(pt => pt.tag_id))
      }
    } catch (err: any) {
      setError('Failed to load post: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (!error && data) {
      setTags(data)
    }
  }

  // Markdown-only editor; no mode switching

  const handleSave = async () => {
    if (!post) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Calculate reading time (approximately 200 words per minute)
      const sourceText = (post.content_md || '')
      const wordCount = sourceText.trim().split(/\s+/).filter(Boolean).length
      const readingMinutes = Math.max(1, Math.ceil(wordCount / 200))

      // Update post
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content_md: post.content_md || '',
          // Clear HTML to ensure site renders Markdown updates
          content_html: null,
          status: post.status,
          published_at: post.status === 'published' && !post.published_at 
            ? new Date().toISOString() 
            : post.published_at,
          reading_minutes: readingMinutes,
          series: post.series || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)

      if (updateError) throw updateError

      // Update tags
      await supabase.from('post_tags').delete().eq('post_id', post.id)
      
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

      setSuccess('Post updated successfully!')
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin/posts')
      }, 1500)
    } catch (err: any) {
      setError('Failed to save post: ' + err.message)
    } finally {
      setSaving(false)
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
    if (!post) return
    const imageMarkdown = `![${alt || 'Image'}](${url})\n\n`
    setPost(prev => prev ? {
      ...prev, 
      content_md: (prev.content_md || '') + imageMarkdown
    } : null)
    setShowImageUpload(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Post not found</p>
        <Button asChild>
          <Link href="/admin/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <p className="text-muted-foreground">
              Make changes to your blog post
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/posts/${post.id}/preview`} target="_blank">
              Preview
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
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
                  value={post.title}
                  onChange={(e) => setPost(prev => prev ? {...prev, title: e.target.value} : null)}
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => setPost(prev => prev ? {...prev, slug: e.target.value} : null)}
                  placeholder="post-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => prev ? {...prev, excerpt: e.target.value} : null)}
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

                <Textarea
                  id="content"
                  value={post.content_md}
                  onChange={(e) => setPost(prev => prev ? {...prev, content_md: e.target.value} : null)}
                  placeholder="Write your post content in Markdown..."
                  rows={20}
                  className="font-mono"
                />

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
                <Select
                  value={post.status}
                  onValueChange={(value: 'draft' | 'published' | 'scheduled') => 
                    setPost(prev => prev ? {...prev, status: value} : null)
                  }
                >
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
                  value={post.series || ''}
                  onChange={(e) => setPost(prev => prev ? {...prev, series: e.target.value} : null)}
                  placeholder="Enter series name"
                />
              </div>

              {post.published_at && (
                <div className="space-y-2">
                  <Label>Published Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.published_at).toLocaleString()}
                  </p>
                </div>
              )}
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
}
