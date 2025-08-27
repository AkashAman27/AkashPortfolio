'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PricingTemplate } from '@/lib/mongodb'

interface EditPricingTemplatePageProps {
  params: {
    id: string
  }
}

export default function EditPricingTemplatePage({ params }: EditPricingTemplatePageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [template, setTemplate] = useState<PricingTemplate | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    period: 'month',
    description: ''
  })

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch('/api/pricing-templates')
        if (!response.ok) {
          throw new Error('Failed to fetch templates')
        }
        const templates = await response.json()
        const foundTemplate = templates.find((t: PricingTemplate) => t._id === params.id)
        
        if (!foundTemplate) {
          throw new Error('Template not found')
        }

        setTemplate(foundTemplate)
        setFormData({
          id: foundTemplate.id,
          name: foundTemplate.name,
          price: foundTemplate.price.toString(),
          period: foundTemplate.period,
          description: foundTemplate.description
        })
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to fetch template')
        router.push('/admin/pricing-templates')
      } finally {
        setFetching(false)
      }
    }

    fetchTemplate()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/pricing-templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: params.id,
          ...formData,
          price: Number(formData.price)
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update template')
      }

      router.push('/admin/pricing-templates')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update template')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Template not found</p>
        <Button asChild>
          <Link href="/admin/pricing-templates">Back to Templates</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/pricing-templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Pricing Template</h1>
          <p className="text-muted-foreground">
            Update template: {template.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>
            Modify the pricing information for this template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Premium, Basic, Enterprise"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id">Template ID *</Label>
                <Input
                  id="id"
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="e.g., premium, basic, enterprise"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Billing Period *</Label>
                <Select value={formData.period} onValueChange={(value) => handleInputChange('period', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="day">Daily</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of this pricing tier..."
                rows={3}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Template'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/pricing-templates">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}