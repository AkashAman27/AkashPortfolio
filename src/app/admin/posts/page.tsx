import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  created_at: string
  reading_minutes: number | null
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string }
}) {
  const supabase = await createClient()
  
  const status = searchParams.status
  const page = parseInt(searchParams.page || '1')
  const limit = 10
  const offset = (page - 1) * limit
  
  // Build query
  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, status, published_at, created_at, reading_minutes')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (status && ['draft', 'published', 'scheduled'].includes(status)) {
    query = query.eq('status', status)
  }
  
  const { data: posts, error } = await query
  
  if (error) {
    console.error('Error fetching posts:', error)
  }

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
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={!status ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/posts">All</Link>
        </Button>
        <Button
          variant={status === 'published' ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/posts?status=published">Published</Link>
        </Button>
        <Button
          variant={status === 'draft' ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/posts?status=draft">Drafts</Link>
        </Button>
        <Button
          variant={status === 'scheduled' ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/posts?status=scheduled">Scheduled</Link>
        </Button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post: Post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="line-clamp-1">
                      <Link 
                        href={`/admin/posts/${post.id}`}
                        className="hover:text-purple-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(post.status)}
                      <span className="text-sm text-muted-foreground">
                        {post.reading_minutes && `${post.reading_minutes} min read`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {post.excerpt && (
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Created: {new Date(post.created_at).toLocaleDateString()}
                    {post.published_at && post.status === 'published' && (
                      <span className="ml-4">
                        Published: {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No posts found</p>
              <Button asChild>
                <Link href="/admin/posts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first post
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}