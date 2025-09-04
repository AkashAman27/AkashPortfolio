'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, User } from 'lucide-react'

interface QuickLoginProps {
  onAuthSuccess?: () => void
  children: React.ReactNode
}

export default function QuickLogin({ onAuthSuccess, children }: QuickLoginProps) {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [email, setEmail] = useState('admin@akash.dev')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  useEffect(() => {
    checkAuth()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          checkUserRole(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAdmin(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await checkUserRole(user)
      }
    } catch (err) {
      console.error('Auth check error:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkUserRole = async (user: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setUser(user)
      setIsAdmin(profile?.role === 'admin')
      
      if (profile?.role === 'admin' && onAuthSuccess) {
        onAuthSuccess()
      }
    } catch (err) {
      console.error('Role check error:', err)
      setUser(user)
      setIsAdmin(false)
    }
  }

  const handleCreateUser = async () => {
    setAuthLoading(true)
    setError('')
    setSuccess('')

    try {
      // Try to create user first
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'admin' }
        }
      })

      if (signUpError && !signUpError.message.includes('already registered')) {
        throw signUpError
      }

      // Try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      if (signInData.user) {
        // Create or update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: signInData.user.id,
            username: 'admin',
            role: 'admin'
          })

        if (profileError) {
          console.warn('Profile creation error:', profileError)
        }

        setSuccess('Successfully signed in!')
        await checkUserRole(signInData.user)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSuccess('Signed out successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated and is admin, show the children
  if (user && isAdmin) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Card className="p-2">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4" />
              <span>Admin: {user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
        {children}
      </div>
    )
  }

  // Show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Access Required
          </CardTitle>
          <CardDescription>
            Please sign in to access the content management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@akash.dev"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
            />
          </div>

          <Button 
            onClick={handleCreateUser} 
            disabled={authLoading}
            className="w-full"
          >
            {authLoading ? 'Processing...' : 'Sign In / Create Account'}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            <p>This will create an admin account if it doesn't exist</p>
            <p>Default: admin@akash.dev / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}