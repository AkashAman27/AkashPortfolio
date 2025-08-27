'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, DollarSign, Star } from 'lucide-react'
import Link from 'next/link'
import { PricingTemplate } from '@/lib/mongodb'

interface PricingPlan {
  _id?: string
  id: string
  name: string
  pricingTemplateId: string
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant: 'default' | 'outline'
}

interface PricingPlanWithTemplate extends PricingPlan {
  template?: PricingTemplate
}

export default function AdminPricing() {
  const [plans, setPlans] = useState<PricingPlanWithTemplate[]>([])
  const [templates, setTemplates] = useState<PricingTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      // Fetch both plans and templates
      const [plansResponse, templatesResponse] = await Promise.all([
        fetch('/api/pricing'),
        fetch('/api/pricing-templates')
      ])
      
      if (!plansResponse.ok || !templatesResponse.ok) {
        throw new Error('Failed to fetch pricing data')
      }
      
      const [plansData, templatesData] = await Promise.all([
        plansResponse.json(),
        templatesResponse.json()
      ])
      
      setTemplates(templatesData)
      
      // Map plans with their corresponding templates
      const plansWithTemplates = plansData.map((plan: PricingPlan) => ({
        ...plan,
        template: templatesData.find((t: PricingTemplate) => t.id === plan.pricingTemplateId)
      }))
      
      setPlans(plansWithTemplates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) {
      return
    }

    try {
      const response = await fetch(`/api/pricing?id=${planId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete plan')
      }

      setPlans(plans.filter(plan => plan._id !== planId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete plan')
    }
  }

  const togglePopular = async (plan: PricingPlanWithTemplate) => {
    try {
      const response = await fetch('/api/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: plan._id,
          id: plan.id,
          name: plan.name,
          pricingTemplateId: plan.pricingTemplateId,
          description: plan.description,
          features: plan.features,
          popular: !plan.popular,
          buttonText: plan.buttonText,
          buttonVariant: plan.buttonVariant
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update plan')
      }

      const updatedPlan = await response.json()
      // Map the updated plan with its template
      const updatedPlanWithTemplate = {
        ...updatedPlan,
        template: templates.find(t => t.id === updatedPlan.pricingTemplateId)
      }
      setPlans(plans.map(p => p._id === plan._id ? updatedPlanWithTemplate : p))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update plan')
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pricing Management</h1>
            <p className="text-muted-foreground">Manage your pricing plans and packages.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pricing Management</h1>
            <p className="text-muted-foreground">Manage your pricing plans and packages.</p>
          </div>
        </div>
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchPlans} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pricing Management</h1>
          <p className="text-muted-foreground">
            Manage your pricing plans and packages. Changes will be reflected immediately on your website.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pricing/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Plan
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">
              Active pricing options
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Plan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.find(p => p.popular)?.name || 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              Featured pricing plan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Range</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.length > 0 ? (
                `$${Math.min(...plans.map(p => p.template?.price || 0))} - $${Math.max(...plans.map(p => p.template?.price || 0))}`
              ) : (
                '$0 - $0'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Per month pricing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pricing plans</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first pricing plan.
            </p>
            <Button asChild>
              <Link href="/admin/pricing/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan._id} className={plan.popular ? 'border-blue-200 bg-blue-50/50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      {plan.popular && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="text-3xl font-bold">
                    ${plan.template?.price || 0}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.template?.period || 'month'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {feature}
                    </div>
                  ))}
                  {plan.features.length > 5 && (
                    <div className="text-sm text-muted-foreground font-medium">
                      +{plan.features.length - 5} more features
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    asChild
                    className="flex-1"
                  >
                    <Link href={`/admin/pricing/edit/${plan._id}`}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePopular(plan)}
                    className={plan.popular ? 'bg-yellow-50 border-yellow-300' : ''}
                  >
                    <Star className={`w-4 h-4 ${plan.popular ? 'text-yellow-600 fill-current' : ''}`} />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => plan._id && deletePlan(plan._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}