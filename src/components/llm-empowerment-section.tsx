'use client'

import { Brain, Zap, Smartphone, Settings, Heart, BarChart } from 'lucide-react'
import CyclingWord from '@/components/animated/cycling-word'

export default function LLMEmpowermentSection() {
  return (
    <section className="max-w-7xl lg:px-8 mx-auto pt-12 px-4 pb-0">
      <div className="max-w-5xl text-center mx-auto mb-12">
        <h1 className="md:text-7xl lg:text-8xl leading-tight text-5xl font-normal text-white tracking-tighter mb-8">
          <span className="align-baseline">The Future of </span>
          <CyclingWord
            className="align-baseline bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"
            words={["LLM", "Knowledge", "Innovation"]}
          />
        </h1>
        <p className="text-lg md:text-xl max-w-3xl leading-relaxed text-muted-foreground mx-auto mb-12">
          Learn the latest in AI, LLMs, and machine learning — through in-depth blogs, real-world projects, and hands-on tutorials designed to keep you ahead in the rapidly evolving AI landscape.
        </p>
      </div>

      {/* Three Cards Section */}
      <div className="overflow-hidden bg-[#1a1a2e] rounded-3xl shadow-2xl border border-slate-700">
        <main className="flex flex-col">
          <section className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Column 1 - Crystal Clear Intelligence */}
            <div className="relative lg:border-r border-border/60 flex flex-col">
              <div className="p-6 lg:p-8">
                <p className="text-foreground/90 text-xs md:text-sm font-semibold mb-3 tracking-wide uppercase">
                  <span className="whitespace-nowrap block">Deep-Dive AI Insights.</span>
                  <span className="normal-case font-normal text-slate-400 block">
                    Stay updated with clear, practical explanations of the latest AI research, breakthroughs, and technologies — simplified for learners, yet detailed enough for professionals.
                  </span>
                </p>
              </div>
              
              <div className="flex-1 flex bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1519743521-6d60422a9c2d?w=2160&q=80')] bg-cover" />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
                    <BarChart className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-1">AI Knowledge Hub</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">Training • Research Simplified for everyone</p>
                </div>
              </div>
            </div>

            {/* Column 2 - SmartSync Technology */}
            <div className="relative lg:border-r border-slate-700 flex flex-col">
              <div className="p-6 lg:p-8">
                <p className="text-slate-200 text-sm font-medium mb-4 tracking-wider uppercase">
                  <span className="whitespace-nowrap block">Hands-On AI Projects</span>
                  <span className="normal-case font-normal text-slate-400 block">
                    Step-by-step guides on building real-world AI applications — from LLM-powered apps to RAG systems, APIs, and automation workflows that you can actually deploy
                  </span>
                </p>
              </div>
              
              <div className="flex-1 flex bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2160&q=80')] bg-cover"></div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/60 to-transparent"></div>
                
                <div className="relative z-10 space-y-4 w-full">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="w-10 h-10 bg-green-500/90 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Hands-on Tutorials</p>
                      <p className="text-muted-foreground text-xs">Instant guides with code you can run</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="w-10 h-10 bg-blue-500/90 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white rounded"></div>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Project Walkthroughs</p>
                      <p className="text-muted-foreground text-xs">Step-by-step builds you can follow anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3 - Everything You Need */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-start justify-between p-6 lg:p-8 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black/90 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold text-black tracking-tight">LLMWave</span>
                </div>
                
                <div className="flex items-center space-x-4 text-black">
                  <div className="p-2 hover:bg-black/10 rounded-lg transition-colors cursor-pointer">
                    <div className="w-5 h-5"></div>
                  </div>
                  <div className="p-2 hover:bg-black/10 rounded-lg transition-colors cursor-pointer">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="p-2 hover:bg-black/10 rounded-lg transition-colors cursor-pointer">
                    <Settings className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="px-6 lg:px-8 relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-medium text-black tracking-tighter mb-6">
                  Explore. Learn. Build
                </h2>
                
                <p className="max-w-sm text-lg leading-relaxed text-black/90 mb-8">
                  From cutting-edge model comparisons to practical coding tutorials, discover everything you need to create with AI. Each blog post is crafted to give you both knowledge and real implementation skills to level up your AI journey.
                </p>
              </div>
              
              <div className="lg:px-8 lg:pb-8 relative z-10 mt-auto pr-6 pb-6 pl-6">
                <div className="bg-black/20 rounded-2xl p-6 border border-black/15">
                  <div className="flex items-center gap-4">
                    <div className="bg-black rounded-lg p-3 relative">
                      <Smartphone className="h-6 w-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">∞</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-black font-semibold text-lg">AI Project Library</h4>
                      <p className="text-gray-800 text-sm leading-relaxed">
                        Unlimited access to real-world AI projects and implementations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Section - Premium Mobile App */}
          <section className="border-t border-border bg-card">
            <div className="p-6 lg:p-8">
              <p className="text-foreground/90 text-xs md:text-sm font-semibold mb-3 tracking-wide uppercase">
                <span className="whitespace-nowrap block">Always Learning, Always Building.</span>
                <span className="normal-case font-normal text-slate-400 block">
                  Our content is designed to be accessible anywhere — dive into blogs, code snippets, and project tutorials whether you’re on desktop, mobile, or in your development environment.
                </span>
              </p>
            </div>
            
            {/* 14-day trial info at bottom of entire card stack */}
            <div className="flex items-center justify-end gap-4 p-6 lg:p-8 pt-0 text-sm text-muted-foreground">
              <span>••• Always Up To Date Content</span>
              <span>⊝ Videos Coming Soon</span>
            </div>
          </section>
        </main>
      </div>
    </section>
  )
}
