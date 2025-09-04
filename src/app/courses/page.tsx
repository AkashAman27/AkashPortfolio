import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, Brain, Bot, Sparkles, Clock, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Courses - Advanced Technical Learning',
  description: 'Master Oracle databases, Machine Learning, Large Language Models, and AI through comprehensive courses designed for beginners to advanced learners.',
}

const courses = [
  {
    id: 'oracle',
    title: 'Oracle Database Mastery',
    description: 'From SQL fundamentals to advanced DBA skills and performance optimization',
    icon: Database,
    level: 'Beginner to Advanced',
    duration: '40+ hours',
    students: '2.5k+',
    topics: ['SQL & PL/SQL', 'Database Design', 'Performance Tuning', 'Oracle Cloud', 'Data Warehousing'],
    href: '/courses/oracle',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'ml',
    title: 'Machine Learning Journey',
    description: 'Comprehensive ML path from basics to production-ready models',
    icon: Brain,
    level: 'Beginner to Expert',
    duration: '60+ hours',
    students: '3.2k+',
    topics: ['Supervised Learning', 'Deep Learning', 'Feature Engineering', 'Model Deployment', 'MLOps'],
    href: '/courses/ml',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'llm',
    title: 'Large Language Models',
    description: 'Master GPT, BERT, and create your own fine-tuned language models',
    icon: Bot,
    level: 'Intermediate to Expert',
    duration: '45+ hours',
    students: '1.8k+',
    topics: ['Transformer Architecture', 'Fine-tuning', 'Prompt Engineering', 'RAG Systems', 'LLM Deployment'],
    href: '/courses/llm',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    description: 'AI theory, ethics, applications, and the future of intelligent systems',
    icon: Sparkles,
    level: 'All Levels',
    duration: '35+ hours',
    students: '2.1k+',
    topics: ['AI Fundamentals', 'Computer Vision', 'AI Ethics', 'Robotics', 'AGI Research'],
    href: '/courses/ai',
    color: 'from-green-500 to-emerald-500'
  }
]

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advanced Technical Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master cutting-edge technologies through hands-on courses designed for rapid skill development. 
            From database fundamentals to AI innovation.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {courses.map((course) => {
            const IconComponent = course.icon
            return (
              <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${course.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {course.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} students</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <p className="text-sm font-medium mb-2 text-muted-foreground">Key Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link href={course.href}>
                        Explore Course
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Learning Path Info */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Structured Learning Paths</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Each course is designed with a clear progression path, interactive exercises, 
            real-world projects, and community support to ensure your success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              🎯 Hands-on Projects
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              💬 Community Support
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              📚 Downloadable Resources
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              🏆 Completion Certificates
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}