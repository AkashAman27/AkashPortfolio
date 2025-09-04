'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, User, LogOut } from 'lucide-react'

interface AdminWrapperProps {
  children: React.ReactNode
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
  const { user, isAdmin, loading, createAdminUser, signOut } = useAuth()
  const [email, setEmail] = useState('admin@akash.dev')
  const [password, setPassword] = useState('admin123')
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const resetPassword = async () => {
    setAuthLoading(true)
    setError('')
    setSuccess('')

    try {
      // Use admin API to reset password
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password')
      }

      setSuccess('Password reset! Try signing in now.')
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAuth = async () => {
    setAuthLoading(true)
    setError('')
    setSuccess('')

    try {
      // First try to sign in with existing credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        // If sign-in fails, try the createAdminUser method
        await createAdminUser(email, password)
      }
      
      setSuccess('Successfully authenticated!')
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setSuccess('Signed out successfully')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show children if authenticated and admin
  if (user && isAdmin) {
    return (
      <>
        {/* Admin indicator */}
        <div className="fixed top-4 right-4 z-50">
          <Card className="p-3 shadow-lg">
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="font-medium">Admin</span>
              </div>
              <span className="text-muted-foreground">{user.email}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="h-7 px-2"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
        {children}
      </>
    )
  }

  // Show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription className="text-base">
            Access the content management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@akash.dev"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleAuth} 
                disabled={authLoading}
                className="w-full h-11 text-base"
                size="lg"
              >
                {authLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <Button 
                onClick={resetPassword} 
                disabled={authLoading}
                variant="outline"
                className="w-full h-11 text-base"
                size="lg"
              >
                {authLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Quick Setup:</p>
              <p>• Email: admin@akash.dev</p>
              <p>• Password: admin123</p>
              <p className="text-xs opacity-75 mt-2">
                This will create an admin account if it doesn't exist
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}