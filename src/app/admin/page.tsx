import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, FolderOpen, Plus, BarChart3, DollarSign, Package } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Get stats
  const [postsResult, projectsResult, draftPostsResult] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact' }),
    supabase.from('projects').select('id', { count: 'exact' }),
    supabase.from('posts').select('id', { count: 'exact' }).eq('status', 'draft')
  ])

  const stats = {
    totalPosts: postsResult.count || 0,
    totalProjects: projectsResult.count || 0,
    draftPosts: draftPostsResult.count || 0
  }

  // Get recent posts
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, title, status, created_at, slug')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Manage your content and monitor your site.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Active projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Analytics coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Project
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/posts?status=draft">
                <FileText className="mr-2 h-4 w-4" />
                Review Drafts
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/pricing">
                <DollarSign className="mr-2 h-4 w-4" />
                Manage Pricing
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/pricing-templates">
                <Package className="mr-2 h-4 w-4" />
                Manage Pricing Templates
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Your latest blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts && recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/admin/posts/${post.id}`}
                        className="text-sm font-medium hover:text-purple-400 transition-colors truncate block"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()} • {post.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No posts yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}