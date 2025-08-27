'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Save, Eye, ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

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
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [newTech, setNewTech] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (resolvedParams?.id) {
      loadProject()
    }
  }, [resolvedParams?.id])

  const loadProject = async () => {
    if (!resolvedParams?.id) return
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      setProject(data)
    } catch (err: any) {
      setError('Failed to load project: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!project) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          slug: project.slug,
          summary: project.summary,
          description_md: project.description_md,
          tech_stack: project.tech_stack,
          repo_url: project.repo_url || null,
          live_url: project.live_url || null,
          featured: project.featured,
          order_index: project.order_index,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)

      if (error) throw error

      setSuccess('Project updated successfully!')
      
      setTimeout(() => {
        router.push('/admin/projects')
      }, 1500)
    } catch (err: any) {
      setError('Failed to save project: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const addTech = () => {
    if (newTech.trim() && project && !project.tech_stack.includes(newTech.trim())) {
      setProject(prev => prev ? {
        ...prev,
        tech_stack: [...prev.tech_stack, newTech.trim()]
      } : null)
      setNewTech('')
    }
  }

  const removeTech = (tech: string) => {
    if (project) {
      setProject(prev => prev ? {
        ...prev,
        tech_stack: prev.tech_stack.filter(t => t !== tech)
      } : null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
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
            <h1 className="text-3xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">
              Make changes to your project
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/projects/${project.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={project.name}
                  onChange={(e) => setProject(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={project.slug}
                  onChange={(e) => setProject(prev => prev ? {...prev, slug: e.target.value} : null)}
                  placeholder="project-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={project.summary}
                  onChange={(e) => setProject(prev => prev ? {...prev, summary: e.target.value} : null)}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Markdown)</Label>
                <Textarea
                  id="description"
                  value={project.description_md}
                  onChange={(e) => setProject(prev => prev ? {...prev, description_md: e.target.value} : null)}
                  placeholder="Detailed project description in Markdown..."
                  rows={15}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={project.featured}
                  onCheckedChange={(checked) => 
                    setProject(prev => prev ? {...prev, featured: !!checked} : null)
                  }
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={project.order_index}
                  onChange={(e) => setProject(prev => prev ? {...prev, order_index: parseInt(e.target.value) || 0} : null)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repo">Repository URL</Label>
                <Input
                  id="repo"
                  value={project.repo_url || ''}
                  onChange={(e) => setProject(prev => prev ? {...prev, repo_url: e.target.value} : null)}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="live">Live URL</Label>
                <Input
                  id="live"
                  value={project.live_url || ''}
                  onChange={(e) => setProject(prev => prev ? {...prev, live_url: e.target.value} : null)}
                  placeholder="https://project.demo.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
              <CardDescription>
                Technologies used in this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map(tech => (
                  <Badge key={tech} variant="default" className="flex items-center gap-1">
                    {tech}
                    <button
                      onClick={() => removeTech(tech)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology"
                  onKeyPress={(e) => e.key === 'Enter' && addTech()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTech}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}