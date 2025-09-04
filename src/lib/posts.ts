import { createClient } from '@/lib/supabase/client'

// Local copy of ContentSection type (section editor removed)
export interface ContentSection {
  id?: number | string
  post_id?: number
  section_type: 'markdown' | 'wysiwyg' | 'image' | 'heading' | 'quote' | 'list' | 'code'
  content: string
  order_index: number
  metadata?: {
    level?: number
    language?: string
    alt?: string
    ordered?: boolean
  }
}

export interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string
  content_md: string
  author_id: string
  status: 'draft' | 'published' | 'scheduled'
  published_at?: string
  reading_minutes?: number
  series?: string
  created_at: string
  updated_at: string
  content_sections?: ContentSection[]
}

export async function getPostWithSections(postId: number): Promise<Post | null> {
  const supabase = createClient()
  
  // Get the post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single()
    
  if (postError || !post) {
    return null
  }
  
  // Get the content sections
  const { data: sections, error: sectionsError } = await supabase
    .from('content_sections')
    .select('*')
    .eq('post_id', postId)
    .order('order_index')
    
  if (sectionsError) {
    console.error('Error loading sections:', sectionsError)
  }
  
  return {
    ...post,
    content_sections: sections || []
  }
}

export async function updatePostWithSections(
  postId: number, 
  postData: Partial<Post>, 
  sections?: ContentSection[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Update the post
    const { error: postError } = await supabase
      .from('posts')
      .update({
        ...postData,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      
    if (postError) throw postError
    
    // If sections are provided, update them
    if (sections) {
      // First, delete all existing sections for this post
      await supabase
        .from('content_sections')
        .delete()
        .eq('post_id', postId)
      
      // Then insert the new sections
      if (sections.length > 0) {
        const sectionsToInsert = sections.map(section => ({
          post_id: postId,
          section_type: section.section_type,
          content: section.content,
          order_index: section.order_index,
          metadata: section.metadata
        }))
        
        const { error: sectionsError } = await supabase
          .from('content_sections')
          .insert(sectionsToInsert)
          
        if (sectionsError) throw sectionsError
      }
    }
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export function convertSectionsToMarkdown(sections: ContentSection[]): string {
  return sections.map(section => {
    switch (section.section_type) {
      case 'heading':
        const level = '#'.repeat(section.metadata?.level || 2)
        return `${level} ${section.content}\n`
      case 'quote':
        return `> ${section.content}\n`
      case 'list':
        const items = section.content.split('\n').filter(item => item.trim())
        return items.map((item, index) => 
          section.metadata?.ordered 
            ? `${index + 1}. ${item}` 
            : `- ${item}`
        ).join('\n') + '\n'
      case 'code':
        const lang = section.metadata?.language || ''
        return `\`\`\`${lang}\n${section.content}\n\`\`\`\n`
      case 'image':
        const alt = section.metadata?.alt || 'Image'
        return `![${alt}](${section.content})\n`
      default:
        return section.content + '\n'
    }
  }).join('\n')
}
