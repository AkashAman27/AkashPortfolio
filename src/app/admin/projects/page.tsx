import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Edit, Eye, Github, ExternalLink } from 'lucide-react'

interface Project {
  id: number
  name: string
  slug: string
  summary: string
  tech_stack: string[]
  repo_url: string | null
  live_url: string | null
  featured: boolean
  created_at: string
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, slug, summary, tech_stack, repo_url, live_url, featured, created_at')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching projects:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects and showcases
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects && projects.length > 0 ? (
          projects.map((project: Project) => (
            <Card key={project.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="line-clamp-1">
                        <Link 
                          href={`/admin/projects/${project.id}`}
                          className="hover:text-purple-400 transition-colors"
                        >
                          {project.name}
                        </Link>
                      </CardTitle>
                      {project.featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack?.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech_stack?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tech_stack.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {project.live_url && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={project.live_url} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {project.repo_url && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={project.repo_url} target="_blank">
                          <Github className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-3">
                  {project.summary}
                </CardDescription>
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No projects found</p>
                <Button asChild>
                  <Link href="/admin/projects/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}