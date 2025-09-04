'use server'

import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CalendarIcon, ClockIcon, UserIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { renderMarkdown } from '@/lib/mdx'
import BlogContent from '@/components/blog-content'

interface PreviewPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminPostPreview({ params }: PreviewPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch post by ID regardless of status (drafts allowed)
  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id(username),
      tags:post_tags(
        tags(name, slug)
      )
    `)
    .eq('id', id)
    .single()

  if (!post) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">Post not found</p>
          <Button asChild>
            <Link href={`/admin/posts/${id}/edit`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Edit
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  let htmlContent = ''
  if (post.content_html) {
    htmlContent = post.content_html
  } else if (post.content_md) {
    htmlContent = await renderMarkdown(post.content_md)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link href={`/admin/posts/${post.id}/edit`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Edit
              </Link>
            </Button>
            {post.status !== 'published' ? (
              <Badge variant="secondary">Draft Preview</Badge>
            ) : (
              <Badge>Published</Badge>
            )}
          </div>

          <article className="space-y-6">
            <header className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Akash Aman
                </div>
                {post.published_at && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(post.published_at)}
                  </div>
                )}
                {post.reading_minutes && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    {post.reading_minutes} min read
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((postTag: any) => (
                  <Badge key={postTag.tags.slug} variant="secondary">
                    {postTag.tags.name}
                  </Badge>
                ))}
                {post.series && <Badge variant="outline">Series: {post.series}</Badge>}
              </div>
            </header>

            {/* Content Separator */}
            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-border to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-background px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose prose-lg prose-invert max-w-none">
              <BlogContent content={htmlContent} />
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
