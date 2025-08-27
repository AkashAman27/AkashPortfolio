import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export async function requireAuth() {
  const userData = await getCurrentUser()
  
  if (!userData) {
    redirect('/admin/login')
  }
  
  return userData
}

export async function requireAdmin() {
  const { profile } = await requireAuth()
  
  if (profile?.role !== 'admin') {
    redirect('/')
  }
  
  return profile
}