'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PricingTemplate } from '@/lib/mongodb'
import Link from 'next/link'
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Package, Clock } from 'lucide-react'

export default function PricingTemplatesPage() {
  const [templates, setTemplates] = useState<PricingTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalTemplates: 0,
    averagePrice: 0,
    freeTemplates: 0,
    premiumTemplates: 0
  })

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/pricing-templates')
      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }
      const data = await response.json()
      setTemplates(data)
      
      // Calculate stats
      const totalTemplates = data.length
      const averagePrice = totalTemplates > 0 ? data.reduce((sum: number, t: PricingTemplate) => sum + t.price, 0) / totalTemplates : 0
      const freeTemplates = data.filter((t: PricingTemplate) => t.price === 0).length
      const premiumTemplates = data.filter((t: PricingTemplate) => t.price > 0).length
      
      setStats({
        totalTemplates,
        averagePrice: Math.round(averagePrice * 100) / 100,
        freeTemplates,
        premiumTemplates
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      const response = await fetch(`/api/pricing-templates?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete template')
      }

      await fetchTemplates()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete template')
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={fetchTemplates}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pricing Templates</h1>
          <p className="text-muted-foreground">
            Manage reusable pricing options for your plans
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pricing-templates/new">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              Pricing options available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averagePrice}</div>
            <p className="text-xs text-muted-foreground">
              Per month average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Templates</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.freeTemplates}</div>
            <p className="text-xs text-muted-foreground">
              No-cost options
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Templates</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premiumTemplates}</div>
            <p className="text-xs text-muted-foreground">
              Revenue generating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first pricing template to get started.
            </p>
            <Button asChild>
              <Link href="/admin/pricing-templates/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template._id} className="relative group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold text-purple-400">
                        ${template.price}
                      </span>
                      <Badge variant="outline">
                        /{template.period}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    ID: {template.id}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/pricing-templates/edit/${template._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteTemplate(template._id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}