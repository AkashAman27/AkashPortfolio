import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import { ArrowRight, Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import HeroCanvas from '@/components/three/hero-canvas'
import LLMEmpowermentSection from '@/components/llm-empowerment-section'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch featured projects
  const { data: featuredProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('order_index', { ascending: true })
    .limit(2)

  // Fetch latest blog posts
  const { data: latestPosts } = await supabase
    .from('posts')
    .select('id, title, excerpt, published_at, slug')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Hi, I&apos;m{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                    Akash
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-md">
                  Full Stack Developer & AI Enthusiast building innovative digital solutions
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/projects">
                    View My Work
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/blog">
                    Read My Blog
                  </Link>
                </Button>
              </div>

              <div className="flex space-x-6">
                <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-6 w-6" />
                </Link>
                <Link href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="mailto:contact@example.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div className="order-first lg:order-last">
              <HeroCanvas />
            </div>
          </div>
        </section>

        {/* LLM Empowerment Section */}
        <LLMEmpowermentSection />

        {/* Featured Projects */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Projects</h2>
              <p className="text-gray-400 max-w-2xl mx-auto font-extralight leading-relaxed">
                Cutting-edge AI and machine learning projects showcasing expertise in LLMs, RAG systems, and intelligent automation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project 1 - AI-Powered RAG System */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all group">
                <div className="bg-purple-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all">
                  <svg className="h-6 w-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">Intelligent RAG System</h3>
                <p className="text-gray-400 font-extralight leading-relaxed">
                  Advanced retrieval-augmented generation system using vector embeddings, semantic search, and fine-tuned language models for enterprise knowledge management.
                </p>
              </div>

              {/* Project 2 - LLM Fine-tuning Platform */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-all group">
                <div className="bg-blue-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all">
                  <svg className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">LLM Fine-tuning Platform</h3>
                <p className="text-gray-400 font-extralight leading-relaxed">
                  Scalable platform for fine-tuning large language models with custom datasets, LoRA adapters, and distributed training capabilities.
                </p>
              </div>

              {/* Project 3 - AI Code Assistant */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-emerald-500/30 transition-all group">
                <div className="bg-emerald-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all">
                  <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">AI Code Assistant</h3>
                <p className="text-gray-400 font-extralight leading-relaxed">
                  Intelligent coding companion powered by transformer models, providing context-aware code completion, bug detection, and optimization suggestions.
                </p>
              </div>

              {/* Project 4 - Neural Document Processing */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-amber-500/30 transition-all group">
                <div className="bg-amber-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-all">
                  <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">Neural Document Processing</h3>
                <p className="text-gray-400 font-extralight leading-relaxed">
                  Multi-modal AI system for intelligent document analysis, extraction, and summarization using computer vision and NLP techniques.
                </p>
              </div>

              {/* Project 5 - Conversational AI Framework */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-pink-500/30 transition-all group">
                <div className="bg-pink-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-all">
                  <svg className="h-6 w-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">Conversational AI Framework</h3>
                <p className="text-gray-400 font-extralight leading-relaxed">
                  Production-ready framework for building sophisticated chatbots with memory, context awareness, and multi-turn conversation capabilities.
                </p>
              </div>

              {/* Project 6 - ML Model Deployment Pipeline */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 hover:border-cyan-500/30 transition-all group">
                <div className="bg-cyan-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-all">
                  <svg className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">ML Model Deployment Pipeline</h3>
                <p className="text-gray-400 font-extralight leading-relaxed">
                  Automated MLOps pipeline for model training, validation, deployment, and monitoring with A/B testing and performance analytics.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button variant="outline" size="lg" asChild className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-light border-none hover:opacity-90">
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Blog Posts</h2>
              <p className="text-gray-400 max-w-2xl mx-auto font-extralight leading-relaxed">
                Deep dives into artificial intelligence, machine learning, and the future of intelligent systems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(latestPosts || []).map((post, index) => {
                const colors = [
                  { bg: 'bg-purple-500/10', hover: 'hover:border-purple-500/30', icon: 'text-purple-400', glow: 'group-hover:bg-purple-500/20' },
                  { bg: 'bg-blue-500/10', hover: 'hover:border-blue-500/30', icon: 'text-blue-400', glow: 'group-hover:bg-blue-500/20' },
                  { bg: 'bg-emerald-500/10', hover: 'hover:border-emerald-500/30', icon: 'text-emerald-400', glow: 'group-hover:bg-emerald-500/20' },
                  { bg: 'bg-amber-500/10', hover: 'hover:border-amber-500/30', icon: 'text-amber-400', glow: 'group-hover:bg-amber-500/20' },
                  { bg: 'bg-pink-500/10', hover: 'hover:border-pink-500/30', icon: 'text-pink-400', glow: 'group-hover:bg-pink-500/20' },
                  { bg: 'bg-cyan-500/10', hover: 'hover:border-cyan-500/30', icon: 'text-cyan-400', glow: 'group-hover:bg-cyan-500/20' }
                ];
                const color = colors[index % colors.length];
                
                const icons = [
                  <svg className={`h-6 w-6 ${color.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="brain">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>,
                  <svg className={`h-6 w-6 ${color.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="cpu">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                    <rect x="9" y="9" width="6" height="6"/>
                    <line x1="9" y1="1" x2="9" y2="4"/>
                    <line x1="15" y1="1" x2="15" y2="4"/>
                    <line x1="9" y1="20" x2="9" y2="23"/>
                    <line x1="20" y1="9" x2="23" y2="9"/>
                    <line x1="20" y1="14" x2="23" y2="14"/>
                    <line x1="1" y1="9" x2="4" y2="9"/>
                    <line x1="1" y1="14" x2="4" y2="14"/>
                    <line x1="15" y1="20" x2="15" y2="23"/>
                  </svg>,
                  <svg className={`h-6 w-6 ${color.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="database">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  </svg>,
                  <svg className={`h-6 w-6 ${color.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="network">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>,
                  <svg className={`h-6 w-6 ${color.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="search">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>,
                  <svg className={`h-6 w-6 ${color.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="trending">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                ];

                return (
                  <Link href={`/blog/${post.slug}`} key={post.id}>
                    <div className={`bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-gray-800 ${color.hover} transition-all group cursor-pointer`}>
                      <div className={`${color.bg} rounded-lg w-12 h-12 flex items-center justify-center mb-6 ${color.glow} transition-all`}>
                        {icons[index]}
                      </div>
                      <h3 className="text-xl font-light mb-3 text-white group-hover:text-gray-100 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 font-extralight leading-relaxed text-sm mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                        <span className="text-gray-600">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <Button variant="outline" size="lg" asChild className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-light border-none hover:opacity-90">
                <Link href="/blog">
                  Read More Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-light text-white mb-2">Akash</h3>
              <p className="text-gray-400 text-sm max-w-md">
                Building the future with AI, one intelligent solution at a time.
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="mailto:contact@example.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              &copy; 2024 Akash. Built with Next.js, Supabase, and AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}