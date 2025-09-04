import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Edit, Eye, Calendar, Clock, Tag } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content_md: string
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  created_at: string
  updated_at: string
  reading_minutes: number | null
  series: string | null
}

interface Tag {
  id: number
  slug: string
  name: string
}

export default async function ViewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const resolvedParams = await params
  
  // Fetch post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (postError || !post) {
    notFound()
  }

  // Fetch post tags
  const { data: postTags } = await supabase
    .from('post_tags')
    .select(`
      tag_id,
      tags (
        id,
        slug,
        name
      )
    `)
    .eq('post_id', resolvedParams.id)

  const tags = postTags?.map(pt => pt.tags).filter(Boolean).flat() as Tag[] || []

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      scheduled: 'outline'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
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
            <h1 className="text-3xl font-bold">View Post</h1>
            <p className="text-muted-foreground">
              Review post details and content
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/posts/${post.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </div>
                {getStatusBadge(post.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {post.content_md}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                </div>
                <p className="text-sm pl-6">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>

              {post.updated_at !== post.created_at && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                  </div>
                  <p className="text-sm pl-6">
                    {new Date(post.updated_at).toLocaleString()}
                  </p>
                </div>
              )}

              {post.published_at && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Published:</span>
                  </div>
                  <p className="text-sm pl-6">
                    {new Date(post.published_at).toLocaleString()}
                  </p>
                </div>
              )}

              {post.reading_minutes && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Reading time:</span>
                  </div>
                  <p className="text-sm pl-6">
                    {post.reading_minutes} minute{post.reading_minutes !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Slug:</span>
                </div>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {post.slug}
                </p>
              </div>

              {post.series && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">Series:</span>
                  </div>
                  <p className="text-sm">
                    {post.series}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}