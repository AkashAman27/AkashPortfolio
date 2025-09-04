import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, Brain, Bot, Sparkles, Download, ExternalLink, BookOpen, Code, FileText, Video } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Learning Resources - Free Guides, Cheat Sheets & Tools',
  description: 'Access comprehensive learning resources for Oracle, ML, AI, and more. Free downloads, cheat sheets, datasets, and tools.',
}

const resourceCategories = [
  {
    id: 'oracle',
    title: 'Oracle Resources',
    description: 'SQL guides, PL/SQL references, DBA tools, and performance optimization resources',
    icon: Database,
    href: '/resources/oracle',
    color: 'from-red-500 to-orange-500',
    count: '25+ resources'
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    description: 'Algorithm guides, datasets, Python libraries, and model evaluation tools',
    icon: Brain,
    href: '/resources/ml',
    color: 'from-blue-500 to-cyan-500',
    count: '40+ resources'
  },
  {
    id: 'llm',
    title: 'LLM Resources',
    description: 'Language model guides, fine-tuning tutorials, and prompt engineering',
    icon: Bot,
    href: '/resources/llm',
    color: 'from-purple-500 to-pink-500',
    count: '20+ resources'
  },
  {
    id: 'ai',
    title: 'AI Tools & Frameworks',
    description: 'AI platforms, frameworks, ethics guides, and research papers',
    icon: Sparkles,
    href: '/resources/ai',
    color: 'from-green-500 to-emerald-500',
    count: '30+ resources'
  }
]

const featuredResources = [
  {
    title: 'Complete SQL Reference Guide',
    description: 'Comprehensive 50-page guide covering SQL basics to advanced queries',
    category: 'Oracle',
    type: 'PDF Guide',
    icon: FileText,
    downloads: '12.5k',
    rating: 4.9
  },
  {
    title: 'ML Algorithm Cheat Sheet',
    description: 'Visual guide to choosing the right machine learning algorithm',
    category: 'ML',
    type: 'Infographic',
    icon: FileText,
    downloads: '18.2k',
    rating: 4.8
  },
  {
    title: 'Python for Data Science Toolkit',
    description: 'Essential Python libraries and code snippets for data science',
    category: 'ML',
    type: 'Code Repository',
    icon: Code,
    downloads: '8.7k',
    rating: 4.7
  },
  {
    title: 'LLM Fine-tuning Tutorial',
    description: 'Step-by-step guide to fine-tuning GPT models for specific tasks',
    category: 'LLM',
    type: 'Video Course',
    icon: Video,
    downloads: '5.3k',
    rating: 4.9
  },
  {
    title: 'Oracle Performance Tuning Checklist',
    description: 'Essential checklist for optimizing Oracle database performance',
    category: 'Oracle',
    type: 'PDF Guide',
    icon: FileText,
    downloads: '7.1k',
    rating: 4.6
  },
  {
    title: 'Common ML Datasets Collection',
    description: 'Curated list of high-quality datasets for machine learning projects',
    category: 'ML',
    type: 'Dataset',
    icon: Database,
    downloads: '15.9k',
    rating: 4.8
  }
]

const toolCategories = [
  {
    title: 'Development Tools',
    tools: ['VS Code Extensions', 'Jupyter Notebooks', 'Git Templates', 'Docker Configs']
  },
  {
    title: 'Oracle Tools',
    tools: ['SQL Developer Scripts', 'TOAD Templates', 'AWR Report Analyzer', 'PL/SQL Snippets']
  },
  {
    title: 'ML/AI Platforms',
    tools: ['Google Colab Templates', 'Kaggle Kernels', 'MLflow Configs', 'TensorFlow Models']
  },
  {
    title: 'Learning Aids',
    tools: ['Flashcard Decks', 'Mind Maps', 'Study Schedules', 'Progress Trackers']
  }
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Learning Resources Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access comprehensive guides, cheat sheets, datasets, and tools to accelerate your learning journey. 
            All resources are free and regularly updated.
          </p>
        </div>

        {/* Resource Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Resource Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 text-center">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {category.description}
                    </CardDescription>
                    <Badge variant="secondary" className="mx-auto w-fit">
                      {category.count}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={category.href}>
                        Browse Resources
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Featured Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => {
              const IconComponent = resource.icon
              return (
                <Card key={index} className="group hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <Badge variant="outline" className="text-xs mb-2">
                            {resource.category}
                          </Badge>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {resource.title}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{resource.downloads} downloads</span>
                      </span>
                      <span>⭐ {resource.rating}</span>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      {resource.type}
                    </Badge>

                    <div className="flex space-x-2">
                      <Button variant="default" className="flex-1" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tools & Utilities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tools & Utilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {toolCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                      <span className="text-sm">{tool}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">Study Guides</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Cheat Sheets</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
              <Code className="h-6 w-6" />
              <span className="text-sm">Code Snippets</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
              <Database className="h-6 w-6" />
              <span className="text-sm">Datasets</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}