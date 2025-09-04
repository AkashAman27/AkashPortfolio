import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Github, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Search Projects - Akash Portfolio',
}

export default async function ProjectsSearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').trim()
  const supabase = await createClient()

  let projects: any[] = []
  if (q) {
    const { data } = await supabase
      .from('projects')
      .select('id, name, slug, summary, tech_stack, repo_url, live_url, featured, created_at')
      .or(`name.ilike.%${q}%,summary.ilike.%${q}%`)
      .order('created_at', { ascending: false })
      .limit(50)
    projects = data || []
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Search Results</h1>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="inline h-4 w-4 mr-1" /> Back to Projects
            </Link>
          </div>
          <p className="text-muted-foreground">Query: “{q || '—'}”</p>

          {q && projects.length === 0 && (
            <div className="text-sm text-muted-foreground">No matches found.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="group-hover:text-purple-400 transition-colors">
                      <Link href={`/projects/${project.slug}`}>{project.name}</Link>
                    </CardTitle>
                    <div className="flex space-x-2">
                      {project.live_url && project.live_url !== '#' && (
                        <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Link>
                      )}
                      {project.repo_url && project.repo_url !== '#' && (
                        <Link href={project.repo_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Link>
                      )}
                    </div>
                  </div>
                  {project.summary && <CardDescription>{project.summary}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
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

