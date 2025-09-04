import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users, Calendar, Award, ExternalLink, Heart, Zap, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Community - Connect, Learn, Grow Together',
  description: 'Join our vibrant community of Oracle, ML, AI, and tech enthusiasts. Get support, share knowledge, and grow together.',
}

const features = [
  {
    title: 'Discussion Forums',
    description: 'Ask questions, share insights, and get help from fellow learners',
    icon: MessageSquare,
    href: '#forums',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Study Groups',
    description: 'Join collaborative learning sessions and peer support groups',
    icon: Users,
    href: '#study-groups',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Live Events',
    description: 'Attend webinars, Q&A sessions, and expert talks',
    icon: Calendar,
    href: '#events',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Recognition Program',
    description: 'Earn badges and showcase your achievements',
    icon: Award,
    href: '#recognition',
    color: 'from-orange-500 to-red-500'
  }
]

const stats = [
  { label: 'Active Members', value: '12.5K+', icon: Users },
  { label: 'Daily Discussions', value: '250+', icon: MessageSquare },
  { label: 'Expert Contributors', value: '150+', icon: Award },
  { label: 'Study Groups', value: '45+', icon: BookOpen }
]

const upcomingEvents = [
  {
    title: 'Oracle Performance Tuning Masterclass',
    date: 'Dec 15, 2024',
    time: '2:00 PM EST',
    speaker: 'Senior Oracle DBA',
    type: 'Webinar'
  },
  {
    title: 'ML Model Deployment Workshop',
    date: 'Dec 18, 2024',
    time: '6:00 PM EST',
    speaker: 'ML Engineer at Google',
    type: 'Workshop'
  },
  {
    title: 'LLM Fine-tuning Q&A Session',
    date: 'Dec 22, 2024',
    time: '3:00 PM EST',
    speaker: 'AI Research Scientist',
    type: 'Q&A'
  }
]

const topContributors = [
  { name: 'Sarah Chen', title: 'ML Engineer', contributions: 145, badge: 'Expert' },
  { name: 'Mike Rodriguez', title: 'Oracle DBA', contributions: 128, badge: 'Mentor' },
  { name: 'Priya Patel', title: 'Data Scientist', contributions: 112, badge: 'Helper' },
  { name: 'David Kim', title: 'AI Researcher', contributions: 95, badge: 'Contributor' }
]

const channels = [
  {
    name: 'general-discussion',
    description: 'General tech discussions and introductions',
    members: '8.2k',
    activity: 'Very High'
  },
  {
    name: 'oracle-help',
    description: 'Oracle database questions and solutions',
    members: '5.1k',
    activity: 'High'
  },
  {
    name: 'ml-projects',
    description: 'Share and discuss ML projects',
    members: '6.8k',
    activity: 'High'
  },
  {
    name: 'llm-innovations',
    description: 'Latest in language model research',
    members: '4.5k',
    activity: 'Medium'
  },
  {
    name: 'career-advice',
    description: 'Career guidance and job opportunities',
    members: '3.9k',
    activity: 'Medium'
  },
  {
    name: 'study-buddies',
    description: 'Find study partners and form groups',
    members: '2.7k',
    activity: 'Medium'
  }
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join Our Learning Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with like-minded professionals, share knowledge, get support, and accelerate your learning journey in Oracle, ML, AI, and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="px-8">
              <ExternalLink className="h-5 w-5 mr-2" />
              Join Discord Server
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <MessageSquare className="h-5 w-5 mr-2" />
              Browse Forums
            </Button>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Community Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Community Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon
              return (
                <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 text-center">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" size="sm">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Popular Channels */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Popular Discussion Channels</h2>
            <div className="space-y-4">
              {channels.map((channel, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <CardTitle className="text-lg">#{channel.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{channel.members} members</span>
                        <Badge variant={channel.activity === 'Very High' ? 'default' : channel.activity === 'High' ? 'secondary' : 'outline'}>
                          {channel.activity}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{event.date}</span>
                    </div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">{event.time} • {event.speaker}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Events
                </Button>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Top Contributors</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {contributor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">{contributor.title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {contributor.badge}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {contributor.contributions} helps
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Community Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Be respectful and constructive in all interactions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Share knowledge and help others learn</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Stay on topic and use appropriate channels</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>No spam, self-promotion, or off-topic content</span>
                </div>
                <Button variant="ghost" className="w-full mt-4" size="sm">
                  Read Full Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Connect with thousands of learners, get expert help, share your knowledge, 
            and accelerate your career in tech.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="px-8">
              <ExternalLink className="h-5 w-5 mr-2" />
              Join Discord Now
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <MessageSquare className="h-5 w-5 mr-2" />
              Browse Forums
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}