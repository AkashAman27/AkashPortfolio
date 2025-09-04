'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

type Mode = 'blog' | 'projects'

interface Suggestion {
  title: string
  slug: string
  excerpt?: string | null
}

function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function AutoSuggest({ mode, placeholder }: { mode: Mode; placeholder?: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Suggestion[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const debounced = useDebounced(query, 250)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!boxRef.current) return
      if (!boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    async function run() {
      if (!debounced.trim()) {
        setResults([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        if (mode === 'blog') {
          const { data } = await supabase
            .from('posts')
            .select('title, slug, excerpt')
            .eq('status', 'published')
            .or(`title.ilike.%${debounced}%,excerpt.ilike.%${debounced}%`)
            .order('published_at', { ascending: false })
            .limit(8)
          setResults((data || []) as Suggestion[])
        } else {
          const { data: raw } = await supabase
            .from('projects')
            .select('name, slug, summary')
            .or(`name.ilike.%${debounced}%,summary.ilike.%${debounced}%`)
            .order('created_at', { ascending: false })
            .limit(8)
          const mapped: Suggestion[] = (raw || []).map((p: any) => ({ title: p.name, slug: p.slug, excerpt: p.summary }))
          setResults(mapped)
        }
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [debounced, mode, supabase])

  useEffect(() => {
    // Reset active index when results change
    setActiveIndex(results.length > 0 ? 0 : -1)
  }, [results])

  const onSelect = (slug: string) => {
    setOpen(false)
    setQuery('')
    router.push(mode === 'blog' ? `/blog/${slug}` : `/projects/${slug}`)
  }

  return (
    <div ref={boxRef} className="relative">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setOpen(true)
            return
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => (results.length ? (i + 1) % results.length : -1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : -1))
          } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && results[activeIndex]) {
              onSelect(results[activeIndex].slug)
            } else if (query.trim()) {
              const path = mode === 'blog' ? `/blog/search?q=${encodeURIComponent(query.trim())}` : `/projects/search?q=${encodeURIComponent(query.trim())}`
              router.push(path)
            }
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        placeholder={placeholder || (mode === 'blog' ? 'Search blog posts…' : 'Search projects…')}
        className="h-12 text-base"
      />
      {open && (results.length > 0 || loading) && (
        <Card className="absolute z-50 mt-2 w-full border bg-background">
          <div className="max-h-80 overflow-auto divide-y">
            {loading && (
              <div className="p-3 text-sm text-muted-foreground">Searching…</div>
            )}
            {!loading && results.map((r, idx) => (
              <button
                key={r.slug}
                className={`w-full text-left p-3 hover:bg-accent/40 ${idx === activeIndex ? 'bg-accent/30' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => onSelect(r.slug)}
              >
                <div className="font-medium line-clamp-1">{r.title}</div>
                {r.excerpt && (
                  <div className="text-xs text-muted-foreground line-clamp-2">{r.excerpt}</div>
                )}
              </button>
            ))}
            {!loading && results.length === 0 && debounced && (
              <div className="p-3 text-sm text-muted-foreground">No matches</div>
            )}
            {!loading && query.trim() && (
              <button
                className="w-full text-left p-3 text-sm text-muted-foreground hover:bg-accent/40"
                onClick={() => router.push(mode === 'blog' ? `/blog/search?q=${encodeURIComponent(query.trim())}` : `/projects/search?q=${encodeURIComponent(query.trim())}`)}
              >
                View all results for “{query.trim()}”
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
