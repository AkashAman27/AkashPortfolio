import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Blog - Akash Portfolio',
  description: 'Read articles about web development, AI, machine learning, and technology trends.',
}

export default async function BlogPage() {
  const supabase = await createClient()
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id(username),
      tags:post_tags(
        tags(name, slug)
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const publishedPosts = posts || []

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thoughts and insights about web development, AI, machine learning, and technology trends
            </p>
          </header>

          {publishedPosts.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
              <p className="text-muted-foreground">
                Check back soon for exciting content about web development and AI!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {publishedPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="group-hover:text-purple-400 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          {post.profiles?.username || 'Anonymous'}
                        </div>
                        
                        {post.published_at && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {formatDate(post.published_at)}
                          </div>
                        )}
                        
                        {post.reading_minutes && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {post.reading_minutes} min read
                          </div>
                        )}
                      </div>
                      
                      {post.excerpt && (
                        <CardDescription className="text-base leading-relaxed">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((postTag: any) => (
                        <Badge key={postTag.tags.slug} variant="secondary">
                          {postTag.tags.name}
                        </Badge>
                      ))}
                      
                      {post.series && (
                        <Badge variant="outline">
                          Series: {post.series}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}