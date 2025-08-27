export interface Profile {
  id: string
  username: string | null
  role: 'admin' | 'author' | 'viewer'
  avatar_url: string | null
  created_at: string
}

export interface Post {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content_md: string
  content_html: string | null
  cover_image_url: string | null
  author_id: string
  status: 'draft' | 'scheduled' | 'published'
  published_at: string | null
  reading_minutes: number | null
  series: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
  tags?: Tag[]
}

export interface Tag {
  id: number
  slug: string
  name: string
}

export interface Project {
  id: number
  slug: string
  name: string
  summary: string | null
  description_md: string
  description_html: string | null
  cover_image_url: string | null
  tech_stack: string[]
  repo_url: string | null
  live_url: string | null
  featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface PostTag {
  post_id: number
  tag_id: number
}