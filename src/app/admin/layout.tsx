import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, FileText, FolderOpen, Settings, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function AdminLogout() {
  'use server'
  
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth is now handled by middleware

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen border-r border-border bg-card relative flex flex-col">
          <div className="p-6">
            <Link href="/admin" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </Link>
          </div>
          
          <nav className="px-4 space-y-2 flex-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>

          <div className="p-4">
            <form action={AdminLogout}>
              <Button variant="outline" size="sm" type="submit" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Content Management</h1>
                <Link href="/" target="_blank">
                  <Button variant="outline" size="sm">
                    View Site
                  </Button>
                </Link>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}