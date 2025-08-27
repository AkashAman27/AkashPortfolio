import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Edit, Eye, Calendar, Github, ExternalLink, Star } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Project {
  id: number
  name: string
  slug: string
  summary: string
  description_md: string
  tech_stack: string[]
  repo_url: string | null
  live_url: string | null
  featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export default async function ViewProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const resolvedParams = await params
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">View Project</h1>
            <p className="text-muted-foreground">
              Review project details and content
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {project.live_url && (
            <Button variant="outline" asChild>
              <Link href={project.live_url} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </Link>
            </Button>
          )}
          {project.repo_url && (
            <Button variant="outline" asChild>
              <Link href={project.repo_url} target="_blank">
                <Github className="mr-2 h-4 w-4" />
                Repository
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/projects/${project.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
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
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-2xl">{project.name}</CardTitle>
                    {project.featured && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{project.summary}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {project.description_md}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                </div>
                <p className="text-sm pl-6">
                  {new Date(project.created_at).toLocaleString()}
                </p>
              </div>

              {project.updated_at !== project.created_at && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                  </div>
                  <p className="text-sm pl-6">
                    {new Date(project.updated_at).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Slug:</span>
                </div>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {project.slug}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Display Order:</span>
                </div>
                <p className="text-sm pl-6">
                  {project.order_index}
                </p>
              </div>

              {project.repo_url && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Github className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Repository:</span>
                  </div>
                  <Link 
                    href={project.repo_url} 
                    target="_blank"
                    className="text-sm text-blue-500 hover:text-blue-600 pl-6 break-all"
                  >
                    {project.repo_url}
                  </Link>
                </div>
              )}

              {project.live_url && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Live URL:</span>
                  </div>
                  <Link 
                    href={project.live_url} 
                    target="_blank"
                    className="text-sm text-blue-500 hover:text-blue-600 pl-6 break-all"
                  >
                    {project.live_url}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {project.tech_stack.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
                <CardDescription>
                  Technologies used in this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map(tech => (
                    <Badge key={tech} variant="outline">
                      {tech}
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