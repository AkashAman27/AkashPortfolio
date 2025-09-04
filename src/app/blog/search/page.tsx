import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Search Blog - Akash Aman',
}

export default async function BlogSearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').trim()
  const supabase = await createClient()

  let posts: any[] = []
  if (q) {
    const { data } = await supabase
      .from('posts')
      .select(`*, profiles:author_id(username), tags:post_tags(tags(name, slug))`)
      .eq('status', 'published')
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order('published_at', { ascending: false })
      .limit(50)
    posts = data || []
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Search Results</h1>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="inline h-4 w-4 mr-1" /> Back to Blog
            </Link>
          </div>
          <p className="text-muted-foreground">Query: “{q || '—'}”</p>

          {q && posts.length === 0 && (
            <div className="text-sm text-muted-foreground">No matches found.</div>
          )}

          <div className="space-y-8">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">
                      <Link href={`/blog/${post.slug}`} className="group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {post.profiles?.username || 'Akash Aman'}
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
                    {post.excerpt && <CardDescription className="text-base leading-relaxed">{post.excerpt}</CardDescription>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((postTag: any) => (
                      <Badge key={postTag.tags.slug} variant="secondary">
                        {postTag.tags.name}
                      </Badge>
                    ))}
                    {post.series && <Badge variant="outline">Series: {post.series}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

