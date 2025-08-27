'use client'

import { Brain, Zap, Smartphone, Settings, Heart, BarChart } from 'lucide-react'

export default function LLMEmpowermentSection() {
  return (
    <section className="max-w-7xl lg:px-8 mx-auto pt-12 px-4 pb-0">
      <div className="max-w-5xl text-center mx-auto mb-12">
        <h1 className="md:text-7xl lg:text-8xl leading-tight text-5xl font-normal text-white tracking-tighter mb-8">
          The Future of{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            LLM
          </span>{' '}
          Empowerment
        </h1>
        <p className="md:text-xl max-w-3xl leading-relaxed text-lg text-slate-300 mx-auto mb-12">
          Experience premium AI content like never before with crystal-clear intelligence, smart synchronization, and seamless integration across all your devices.
        </p>
      </div>

      {/* Three Cards Section */}
      <div className="overflow-hidden bg-[#1a1a2e] rounded-3xl shadow-2xl border border-slate-700">
        <main className="flex flex-col">
          <section className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Column 1 - Crystal Clear Intelligence */}
            <div className="relative lg:border-r border-slate-700 flex flex-col">
              <div className="p-6 lg:p-8">
                <p className="text-slate-200 text-sm font-medium mb-4 tracking-wider uppercase">
                  Crystal Clear Intelligence.{' '}
                  <span className="normal-case font-normal text-slate-400">
                    Professional-grade processing with advanced neural technology captures every nuance of context with exceptional clarity.
                  </span>
                </p>
              </div>
              
              <div className="flex-1 flex bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-center opacity-30 bg-[url('https://images.unsplash.com/photo-1519743521-6d60422a9c2d?w=2160&q=80')] bg-cover"></div>
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
                    <BarChart className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Neural Engine v4.0</h3>
                  <p className="text-slate-300 text-sm">Training • 2.4B parameters</p>
                </div>
              </div>
            </div>

            {/* Column 2 - SmartSync Technology */}
            <div className="relative lg:border-r border-slate-700 flex flex-col">
              <div className="p-6 lg:p-8">
                <p className="text-slate-200 text-sm font-medium mb-4 tracking-wider uppercase">
                  SmartSync Technology™{' '}
                  <span className="normal-case font-normal text-slate-400">
                    Intelligent cross-device synchronization keeps your listening progress, bookmarks, and notes perfectly synced across all platforms.
                  </span>
                </p>
              </div>
              
              <div className="flex-1 flex bg-gradient-to-br from-emerald-900/20 to-teal-900/20 p-6 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-center opacity-30 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2160&q=80')] bg-cover"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                
                <div className="relative z-10 space-y-4 w-full">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Real-time Processing</p>
                      <p className="text-slate-400 text-xs">Instant</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white rounded"></div>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Offline Capabilities</p>
                      <p className="text-slate-400 text-xs">Premium feature</p>
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
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-light text-black tracking-tighter">LLMWave</span>
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-medium text-gray-900 tracking-tighter mb-6">
                  Everything you need{' '}
                  <span className="text-gray-700">to discover.</span>
                </h2>
                
                <p className="max-w-sm text-base leading-relaxed text-gray-800 mb-8">
                  Designed for innovators, built for creators. Each LLM Premium subscription 
                  includes exclusive models, early access, and advanced capabilities to 
                  elevate your AI experience.
                </p>
              </div>
              
              <div className="lg:px-8 lg:pb-8 relative z-10 mt-auto pr-6 pb-6 pl-6">
                <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-black/10">
                  <div className="flex items-center gap-4">
                    <div className="bg-black rounded-lg p-3 relative">
                      <Smartphone className="h-6 w-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">∞</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-black font-semibold text-lg">LLM Premium Suite</h4>
                      <p className="text-gray-800 text-sm leading-relaxed">
                        Unlimited access to exclusive models, ad-free processing, 
                        and early access to new features from your favorite AI providers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Section - Premium Mobile App */}
          <section className="border-t border-slate-700 bg-[#1a1a2e]">
            <div className="p-6 lg:p-8">
              <p className="text-slate-200 text-sm font-medium mb-4 tracking-wider uppercase">
                Premium Mobile App.{' '}
                <span className="normal-case font-normal text-slate-400">
                  Hand-crafted mobile experience with smart recommendations, sleep timer, and voice control keeps your favorite AI models always within reach.
                </span>
              </p>
            </div>
            
            {/* 14-day trial info at bottom of entire card stack */}
            <div className="flex items-center justify-end gap-4 p-6 lg:p-8 pt-0 text-sm text-slate-400">
              <span>••• 14-day free trial</span>
              <span>⊝ Cancel anytime</span>
            </div>
          </section>
        </main>
      </div>
    </section>
  )
}