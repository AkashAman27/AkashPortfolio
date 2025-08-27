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