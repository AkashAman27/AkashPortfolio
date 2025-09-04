import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Database, Play, Book, Code, Award, Clock, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Oracle Database Mastery Course',
  description: 'Master Oracle databases from SQL fundamentals to advanced DBA skills, performance tuning, and cloud technologies.',
}

const modules = [
  {
    id: 1,
    title: 'SQL Fundamentals',
    description: 'Master the foundation of database queries',
    duration: '8 hours',
    lessons: 12,
    level: 'Beginner',
    topics: ['SELECT statements', 'JOINs', 'Functions', 'Subqueries', 'Data types'],
    progress: 100
  },
  {
    id: 2,
    title: 'Advanced SQL & PL/SQL',
    description: 'Deep dive into Oracle\'s procedural language',
    duration: '10 hours',
    lessons: 15,
    level: 'Intermediate',
    topics: ['Stored procedures', 'Functions', 'Triggers', 'Packages', 'Exception handling'],
    progress: 75
  },
  {
    id: 3,
    title: 'Database Design & Modeling',
    description: 'Design efficient and scalable database structures',
    duration: '6 hours',
    lessons: 10,
    level: 'Intermediate',
    topics: ['Normalization', 'ERD', 'Constraints', 'Indexes', 'Data modeling'],
    progress: 45
  },
  {
    id: 4,
    title: 'Performance Tuning',
    description: 'Optimize queries and database performance',
    duration: '8 hours',
    lessons: 14,
    level: 'Advanced',
    topics: ['Query optimization', 'Index strategies', 'Execution plans', 'Statistics', 'AWR reports'],
    progress: 20
  },
  {
    id: 5,
    title: 'Oracle DBA Essentials',
    description: 'Database administration and maintenance',
    duration: '12 hours',
    lessons: 18,
    level: 'Advanced',
    topics: ['Installation', 'Backup & recovery', 'User management', 'Security', 'Monitoring'],
    progress: 0
  },
  {
    id: 6,
    title: 'Oracle Cloud & Modern Features',
    description: 'Latest Oracle cloud technologies and features',
    duration: '6 hours',
    lessons: 8,
    level: 'Intermediate',
    topics: ['Oracle Cloud', 'Autonomous database', 'JSON support', 'Graph queries', 'Machine learning'],
    progress: 0
  }
]

const projects = [
  {
    title: 'E-commerce Database Design',
    description: 'Build a complete database for an online store',
    skills: ['Database Design', 'PL/SQL', 'Performance Tuning']
  },
  {
    title: 'Data Warehouse Implementation',
    description: 'Create an OLAP system with ETL processes',
    skills: ['Data Warehousing', 'ETL', 'Analytics']
  },
  {
    title: 'High-Availability Setup',
    description: 'Implement Oracle RAC and Data Guard',
    skills: ['DBA', 'High Availability', 'Disaster Recovery']
  }
]

export default function OracleCoursePage() {
  const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0) / modules.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 rounded-lg bg-gradient-to-r from-red-500 to-orange-500">
              <Database className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Oracle Database Mastery
              </h1>
              <p className="text-muted-foreground mt-2">
                Complete Oracle learning path from SQL basics to advanced DBA skills
              </p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">50+ hours content</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">2.5k+ students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Book className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">77 lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Certificate included</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(totalProgress)}% complete</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Modules */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Course Modules</h2>
            
            {modules.map((module) => (
              <Card key={module.id} className="group hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {module.id}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={module.level === 'Beginner' ? 'secondary' : module.level === 'Intermediate' ? 'default' : 'destructive'}>
                      {module.level}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Module Stats */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{module.duration}</span>
                    <span>•</span>
                    <span>{module.lessons} lessons</span>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">Progress</span>
                      <span className="text-xs text-muted-foreground">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-1.5" />
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant={module.progress > 0 ? "default" : "outline"}
                    className="w-full mt-4"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {module.progress === 0 ? 'Start Module' : module.progress === 100 ? 'Review' : 'Continue'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Book className="h-4 w-4 mr-2" />
                  Course Materials
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Code className="h-4 w-4 mr-2" />
                  Practice Lab
                </Button>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hands-on Projects</CardTitle>
                <CardDescription>Apply your skills in real-world scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{project.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Related Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Oracle Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/resources/oracle" className="block text-sm text-primary hover:underline">
                  Oracle SQL Reference Guide
                </Link>
                <Link href="/resources/oracle" className="block text-sm text-primary hover:underline">
                  PL/SQL Cheat Sheet
                </Link>
                <Link href="/resources/oracle" className="block text-sm text-primary hover:underline">
                  Performance Tuning Checklist
                </Link>
                <Link href="/resources/oracle" className="block text-sm text-primary hover:underline">
                  DBA Commands Reference
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}