import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, ArrowLeft } from 'lucide-react'
import { renderMarkdown } from '@/lib/mdx'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: project } = await supabase
    .from('projects')
    .select('name, summary')
    .eq('slug', slug)
    .single()

  if (!project) {
    return {
      title: 'Project not found'
    }
  }

  return {
    title: `${project.name} - Akash Portfolio`,
    description: project.summary,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !project) {
    notFound()
  }

  // Render markdown content
  let htmlContent = ''
  if (project.description_html) {
    htmlContent = project.description_html
  } else if (project.description_md) {
    htmlContent = await renderMarkdown(project.description_md)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-8">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
            
            <header className="space-y-6">
              <div className="flex items-start justify-between">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {project.name}
                </h1>
                <div className="flex space-x-3">
                  {project.live_url && project.live_url !== '#' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </Link>
                    </Button>
                  )}
                  {project.repo_url && project.repo_url !== '#' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.repo_url} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              
              {project.summary && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {project.summary}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.map((tech: string) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </header>
          </div>
          
          <div className="border-t border-border pt-12">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none 
                         prose-p:leading-8 prose-p:mb-6 
                         prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
                         prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-tight
                         prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-snug
                         prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2
                         prose-blockquote:my-8 prose-blockquote:py-4
                         prose-pre:my-8 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                         prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </article>
        
        <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-border">
          <div className="text-center">
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}