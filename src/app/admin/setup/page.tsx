'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function SetupPage() {
  const [email, setEmail] = useState('admin@akash.dev')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleCreateUser = async () => {
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Try to sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setMessage('User already exists. Try signing in instead.')
        } else {
          throw signUpError
        }
      } else {
        setMessage('Admin user created successfully! You can now sign in.')
      }

    } catch (err: any) {
      setError('Failed to create user: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setMessage('Signed in successfully! Redirecting...')
      setTimeout(() => {
        window.location.href = '/admin'
      }, 1500)

    } catch (err: any) {
      setError('Failed to sign in: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTables = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // This is a simple check - in a real app, you'd have proper database migrations
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (error) {
        if (error.message.includes('does not exist')) {
          setError('Database tables not set up. Please run the Supabase migrations first.')
        } else {
          setError('Database connection error: ' + error.message)
        }
      } else {
        setMessage('Database tables are accessible!')
      }
    } catch (err: any) {
      setError('Error checking database: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSamplePost = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Please sign in first')
        return
      }

      // Create a sample post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: 'Welcome to My Blog - Built with Section Editor',
          slug: 'welcome-section-editor-demo',
          excerpt: 'This post demonstrates the new section-based editor with different content types including markdown, headings, images, code blocks, and more.',
          content_md: '# Welcome to My Blog\n\nThis is a demo post created with the section editor...',
          author_id: user.id,
          status: 'published',
          published_at: new Date().toISOString(),
          reading_minutes: 3
        })
        .select()
        .single()

      if (postError) throw postError

      // Create sample sections
      const sampleSections = [
        {
          post_id: post.id,
          section_type: 'heading',
          content: 'Welcome to My Blog',
          order_index: 0,
          metadata: { level: 1 }
        },
        {
          post_id: post.id,
          section_type: 'markdown',
          content: 'This post demonstrates the **powerful section-based editor** that allows you to mix different types of content in a single post. Each section can be a different content type!',
          order_index: 1,
          metadata: {}
        },
        {
          post_id: post.id,
          section_type: 'quote',
          content: 'The best way to learn is by doing, and the best way to do is by building something meaningful.',
          order_index: 2,
          metadata: {}
        },
        {
          post_id: post.id,
          section_type: 'heading',
          content: 'Features of the Section Editor',
          order_index: 3,
          metadata: { level: 2 }
        },
        {
          post_id: post.id,
          section_type: 'list',
          content: 'Multiple content types (Markdown, WYSIWYG, Images, etc.)\nDrag and drop reordering\nDatabase-backed storage\nReal-time preview\nEasy section management',
          order_index: 4,
          metadata: { ordered: false }
        },
        {
          post_id: post.id,
          section_type: 'code',
          content: 'function createPost() {\n  return {\n    title: "My New Post",\n    sections: [\n      { type: "heading", content: "Hello World" },\n      { type: "markdown", content: "This is **awesome**!" }\n    ]\n  }\n}',
          order_index: 5,
          metadata: { language: 'javascript' }
        }
      ]

      const { error: sectionsError } = await supabase
        .from('content_sections')
        .insert(sampleSections)

      if (sectionsError) throw sectionsError

      setMessage('Sample post created successfully! Check the admin panel to see it.')
    } catch (err: any) {
      setError('Failed to create sample post: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            Set up your admin account for the portfolio CMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleCreateUser} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Admin User'}
            </Button>
            
            <Button 
              onClick={handleSignIn} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Button 
              onClick={handleCreateTables} 
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              {loading ? 'Checking...' : 'Check Database'}
            </Button>

            <Button 
              onClick={handleCreateSamplePost} 
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Sample Post'}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Note:</strong> This setup page helps you create an admin account. Make sure your Supabase project is configured with the necessary database tables (profiles, posts, tags, etc.).</p>
            <p className="mt-2">Default credentials: admin@akash.dev / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}