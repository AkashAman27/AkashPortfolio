import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/navigation'
import { Github, ExternalLink, Star } from 'lucide-react'
import AutoSuggest from '@/components/search/auto-suggest'

export const metadata = {
  title: 'Projects - Akash Portfolio',
  description: 'Explore my portfolio of web development projects, AI applications, and innovative digital solutions.',
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  const allProjects = projects || []
  const featuredProjects = allProjects.filter(p => p.featured)
  const otherProjects = allProjects.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <header className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A showcase of my work in web development, AI applications, and innovative digital solutions
            </p>
          </header>

          <div className="max-w-3xl mx-auto mb-10">
            <AutoSuggest mode="projects" placeholder="Search projects by name or summary…" />
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-2 mb-8">
                <Star className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-semibold">Featured Projects</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 h-full min-h-[320px]">
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="group-hover:text-purple-400 transition-colors text-2xl">
                          <Link href={`/projects/${project.slug}`}>
                            {project.name}
                          </Link>
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
                      {project.summary && (
                        <CardDescription className="text-base" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.summary}</CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="px-6 pb-6 pt-0">
                      <div className="flex flex-wrap gap-2 mt-2">
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
            </section>
          )}

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-8">
                {featuredProjects.length > 0 ? 'More Projects' : 'All Projects'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                {otherProjects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 h-full min-h-[320px]">
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="group-hover:text-purple-400 transition-colors text-2xl">
                          <Link href={`/projects/${project.slug}`}>
                            {project.name}
                          </Link>
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
                      {project.summary && (
                        <CardDescription className="text-base" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.summary}</CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="px-6 pb-6 pt-0">
                      <div className="flex flex-wrap gap-2 mt-2">
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
            </section>
          )}

          {allProjects.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">No projects yet</h2>
              <p className="text-muted-foreground">
                Check back soon for exciting projects!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
