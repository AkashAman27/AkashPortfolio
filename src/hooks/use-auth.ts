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
    // Get initial session
    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

    return () => subscription.unsubscribe()
  }, [])

  const getInitialSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await checkUserRole(user)
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error('Error getting session:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const checkUserRole = async (user: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

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