import Navigation from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Github, Linkedin, Mail, Download } from 'lucide-react'

export const metadata = {
  title: 'About - Akash Portfolio',
  description: 'Learn more about Akash - Full Stack Developer, AI Enthusiast, and technology innovator.',
}

export default function AboutPage() {
  const skills = {
    "Frontend": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Angular"],
    "Backend": ["Node.js", "Python", "PostgreSQL", "MongoDB", "Redis", "GraphQL"],
    "AI/ML": ["TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "Hugging Face"],
    "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "Vercel", "GitHub Actions"],
    "Tools": ["Git", "VS Code", "Figma", "Postman", "Jest", "Cypress"]
  }

  const experience = [
    {
      role: "Senior Full Stack Developer",
      company: "Tech Innovation Corp",
      period: "2022 - Present",
      description: "Leading development of modern web applications using React, Next.js, and AI integrations. Mentoring junior developers and architecting scalable solutions."
    },
    {
      role: "Full Stack Developer",
      company: "Digital Solutions Ltd",
      period: "2020 - 2022",
      description: "Developed and maintained multiple client projects using various tech stacks. Implemented CI/CD pipelines and improved application performance by 40%."
    },
    {
      role: "Frontend Developer",
      company: "Creative Web Agency",
      period: "2019 - 2020",
      description: "Created responsive, accessible web interfaces and collaborated with designers to bring creative visions to life using modern JavaScript frameworks."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              I&apos;m a passionate Full Stack Developer and AI enthusiast with over 5 years of experience 
              creating innovative digital solutions that bridge the gap between cutting-edge technology 
              and user-centered design.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>My Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    My journey in technology began with a curiosity about how things work under the hood. 
                    What started as tinkering with HTML and CSS has evolved into a comprehensive skill set 
                    spanning modern web development, artificial intelligence, and cloud technologies.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    I specialize in building scalable web applications using React, Next.js, and Node.js, 
                    while also exploring the fascinating world of AI and machine learning. My approach combines 
                    technical expertise with a deep understanding of user experience and business objectives.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    When I&apos;m not coding, you can find me contributing to open source projects, writing technical 
                    articles, or exploring the latest developments in AI and web technologies.
                  </p>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                  <CardDescription>My professional journey so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experience.map((job, index) => (
                      <div key={index} className="border-l-2 border-purple-200 dark:border-purple-800 pl-4 relative">
                        <div className="absolute w-3 h-3 bg-purple-400 rounded-full -left-[7px] top-1"></div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{job.role}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400 font-medium">{job.company}</span>
                            <span className="text-sm text-muted-foreground">• {job.period}</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Skills Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Technologies</CardTitle>
                  <CardDescription>Technologies I work with</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(skills).map(([category, techs]) => (
                      <div key={category}>
                        <h4 className="font-medium mb-2 text-purple-400">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {techs.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Get In Touch</CardTitle>
                  <CardDescription>Let&apos;s connect and collaborate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="mailto:contact@example.com">
                        <Mail className="mr-2 h-4 w-4" />
                        Email Me
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="https://linkedin.com" target="_blank">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="https://github.com" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Fun Facts */}
              <Card>
                <CardHeader>
                  <CardTitle>Fun Facts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>☕ Coffee enthusiast - I&apos;ve tried over 50 different coffee beans</li>
                    <li>🎮 Gaming lover - Strategy games and indie titles are my favorites</li>
                    <li>📚 Continuous learner - Always reading about new technologies</li>
                    <li>🌱 Open source contributor - Giving back to the community</li>
                    <li>🏃‍♂️ Marathon runner - Completed 3 marathons so far</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Ready to work together?</h2>
            <p className="text-muted-foreground">
              I&apos;m always interested in discussing new opportunities and exciting projects.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/projects">View My Work</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="mailto:contact@example.com">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}