import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Akash Portfolio - Blog</title>
    <description>Thoughts and insights about web development, AI, machine learning, and technology trends</description>
    <link>https://akash-portfolio.vercel.app</link>
    <atom:link href="https://akash-portfolio.vercel.app/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${(posts || []).map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>https://akash-portfolio.vercel.app/blog/${post.slug}</link>
      <guid>https://akash-portfolio.vercel.app/blog/${post.slug}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}