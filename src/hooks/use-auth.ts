'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isAdmin: boolean
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true
  })

  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (!mounted) return
        
        if (error) {
          console.log('Auth error:', error)
          setAuthState(prev => ({ ...prev, loading: false }))
          return
        }
        
        if (user) {
          console.log('User found:', user.email)
          await checkUserRole(user)
        } else {
          console.log('No user found')
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('Error getting session:', error)
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      }
    }

    // Initialize auth
    initializeAuth()

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.log('Auth timeout - forcing loading to false')
      if (mounted) {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }, 10000) // Increased to 10 seconds

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        clearTimeout(timeoutId)
        
        if (!mounted) return
        
        if (event === 'SIGNED_IN' && session?.user) {
          await checkUserRole(session.user)
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAdmin: false,
            loading: false
          })
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [supabase])


  const checkUserRole = async (user: User) => {
    try {
      console.log('Checking user role for:', user.id)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.log('Profile query error:', error)
        // If profile doesn't exist, try to create one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile')
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email?.split('@')[0] || 'user',
              role: 'user'
            })
          
          if (insertError) {
            console.error('Error creating profile:', insertError)
          }
        }
      }

      console.log('Profile data:', profile)
      
      setAuthState({
        user,
        isAdmin: profile?.role === 'admin',
        loading: false
      })
    } catch (error) {
      console.error('Error checking user role:', error)
      setAuthState({
        user,
        isAdmin: false,
        loading: false
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const createAdminUser = async (email: string, password: string) => {
    // Try to sign up first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError && !signUpError.message.includes('already registered')) {
      throw signUpError
    }

    // Then sign in
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
          username: email.split('@')[0],
          role: 'admin'
        })

      if (profileError) {
        console.warn('Profile creation error:', profileError)
      }

      await checkUserRole(signInData.user)
    }

    return signInData
  }

  return {
    ...authState,
    signIn,
    signOut,
    createAdminUser
  }
}