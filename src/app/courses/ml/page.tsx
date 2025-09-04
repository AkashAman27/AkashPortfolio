import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Brain, Play, Book, Code, Award, Clock, Users, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Machine Learning Journey Course',
  description: 'Master machine learning from fundamentals to advanced techniques, including deep learning, MLOps, and production deployment.',
}

const modules = [
  {
    id: 1,
    title: 'ML Fundamentals',
    description: 'Foundation of machine learning concepts and mathematics',
    duration: '10 hours',
    lessons: 16,
    level: 'Beginner',
    topics: ['Linear algebra', 'Statistics', 'Probability', 'Python basics', 'NumPy/Pandas'],
    progress: 100
  },
  {
    id: 2,
    title: 'Supervised Learning',
    description: 'Classification and regression algorithms',
    duration: '12 hours',
    lessons: 20,
    level: 'Beginner',
    topics: ['Linear regression', 'Decision trees', 'Random forest', 'SVM', 'Model evaluation'],
    progress: 85
  },
  {
    id: 3,
    title: 'Unsupervised Learning',
    description: 'Clustering, dimensionality reduction, and pattern discovery',
    duration: '8 hours',
    lessons: 14,
    level: 'Intermediate',
    topics: ['K-means', 'Hierarchical clustering', 'PCA', 't-SNE', 'Association rules'],
    progress: 60
  },
  {
    id: 4,
    title: 'Deep Learning',
    description: 'Neural networks and deep learning architectures',
    duration: '15 hours',
    lessons: 24,
    level: 'Advanced',
    topics: ['Neural networks', 'CNN', 'RNN', 'LSTM', 'Transfer learning'],
    progress: 30
  },
  {
    id: 5,
    title: 'Feature Engineering',
    description: 'Data preprocessing and feature selection techniques',
    duration: '6 hours',
    lessons: 10,
    level: 'Intermediate',
    topics: ['Data cleaning', 'Feature scaling', 'Selection methods', 'Encoding', 'Pipeline creation'],
    progress: 15
  },
  {
    id: 6,
    title: 'Model Deployment & MLOps',
    description: 'Production deployment and ML operations',
    duration: '10 hours',
    lessons: 16,
    level: 'Advanced',
    topics: ['Model serving', 'Docker', 'API creation', 'Monitoring', 'CI/CD for ML'],
    progress: 0
  }
]

const projects = [
  {
    title: 'House Price Prediction',
    description: 'End-to-end regression project with real estate data',
    skills: ['Regression', 'Feature Engineering', 'Model Selection'],
    difficulty: 'Beginner'
  },
  {
    title: 'Image Classification System',
    description: 'Build a CNN for multi-class image recognition',
    skills: ['Deep Learning', 'CNN', 'Computer Vision'],
    difficulty: 'Intermediate'
  },
  {
    title: 'Recommendation Engine',
    description: 'Create a collaborative filtering system',
    skills: ['Unsupervised Learning', 'Matrix Factorization', 'API Development'],
    difficulty: 'Advanced'
  },
  {
    title: 'MLOps Pipeline',
    description: 'Full production ML pipeline with monitoring',
    skills: ['MLOps', 'Docker', 'Model Monitoring'],
    difficulty: 'Expert'
  }
]

const tools = ['Python', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Matplotlib', 'Docker']

export default function MLCoursePage() {
  const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0) / modules.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Machine Learning Journey
              </h1>
              <p className="text-muted-foreground mt-2">
                From fundamentals to production-ready ML systems
              </p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">61+ hours content</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">3.2k+ students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Book className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">100 lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Industry certificate</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Learning Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(totalProgress)}% complete</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Modules */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Learning Path</h2>
            
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
                  <Code className="h-4 w-4 mr-2" />
                  Jupyter Notebooks
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Practice Problems
                </Button>
              </CardContent>
            </Card>

            {/* Tools & Technologies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tools You'll Master</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capstone Projects</CardTitle>
                <CardDescription>Build your ML portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{project.title}</h4>
                      <Badge 
                        variant={project.difficulty === 'Beginner' ? 'secondary' : 
                                project.difficulty === 'Intermediate' ? 'default' : 
                                project.difficulty === 'Advanced' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {project.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
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
                <CardTitle className="text-lg">ML Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/resources/ml" className="block text-sm text-primary hover:underline">
                  Python for ML Cheat Sheet
                </Link>
                <Link href="/resources/ml" className="block text-sm text-primary hover:underline">
                  Algorithm Selection Guide
                </Link>
                <Link href="/resources/ml" className="block text-sm text-primary hover:underline">
                  Common Datasets Repository
                </Link>
                <Link href="/resources/ml" className="block text-sm text-primary hover:underline">
                  Model Evaluation Metrics
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}