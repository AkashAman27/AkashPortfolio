import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  const [{ data: posts }, { data: projects }] = await Promise.all([
    supabase.from('posts').select('slug, updated_at').eq('status', 'published'),
    supabase.from('projects').select('slug, updated_at')
  ])

  const baseUrl = 'https://akash-portfolio.vercel.app'
  
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/projects', priority: '0.9', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' }
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${(posts || []).map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  ${(projects || []).map(project => `
  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${new Date(project.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}