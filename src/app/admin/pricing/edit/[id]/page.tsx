'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Minus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PricingTemplate } from '@/lib/mongodb'

interface PricingFormData {
  _id?: string
  id: string
  name: string
  pricingTemplateId: string
  description: string
  features: string[]
  popular: boolean
  buttonText: string
  buttonVariant: 'default' | 'outline'
}

export default function EditPricingPlan() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [templates, setTemplates] = useState<PricingTemplate[]>([])
  const [formData, setFormData] = useState<PricingFormData>({
    id: '',
    name: '',
    pricingTemplateId: '',
    description: '',
    features: [''],
    popular: false,
    buttonText: 'Get Started',
    buttonVariant: 'default'
  })

  useEffect(() => {
    fetchPlan()
    fetchTemplates()
  }, [planId])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/pricing-templates')
      if (response.ok) {
        const data = await response.json()
        // Remove duplicates based on id field
        const uniqueTemplates = data.filter((template: PricingTemplate, index: number, self: PricingTemplate[]) => 
          index === self.findIndex(t => t.id === template.id)
        )
        setTemplates(uniqueTemplates)
      }
    } catch (error) {
      console.error('Failed to fetch pricing templates:', error)
    } finally {
      setTemplatesLoading(false)
    }
  }

  const selectedTemplate = templates.find(t => t.id === formData.pricingTemplateId)

  const fetchPlan = async () => {
    try {
      const response = await fetch('/api/pricing')
      if (!response.ok) {
        throw new Error('Failed to fetch pricing plans')
      }
      const plans = await response.json()
      const plan = plans.find((p: any) => p._id === planId)
      
      if (!plan) {
        throw new Error('Plan not found')
      }

      setFormData(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plan')
    } finally {
      setFetching(false)
    }
  }

  const handleInputChange = (field: keyof PricingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.id || !formData.name || !formData.pricingTemplateId || !formData.description || !formData.buttonText) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.features.some(feature => feature.trim() === '')) {
      alert('Please fill in all features or remove empty ones')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim() !== '')
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update pricing plan')
      }

      router.push('/admin/pricing')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update pricing plan')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/pricing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Pricing Plan</h1>
            <p className="text-muted-foreground">Loading plan details...</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/pricing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Pricing Plan</h1>
            <p className="text-muted-foreground">Error loading plan.</p>
          </div>
        </div>
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchPlan} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/pricing">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Pricing Plan</h1>
          <p className="text-muted-foreground">
            Update your pricing plan details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Core details about your pricing plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="id">Plan ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    placeholder="basic, pro, enterprise"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Unique identifier (lowercase, no spaces)
                  </p>
                </div>
                <div>
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Basic Plan"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Perfect for getting started..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="pricingTemplate">Pricing Template *</Label>
                <Select 
                  value={formData.pricingTemplateId} 
                  onValueChange={(value) => handleInputChange('pricingTemplateId', value)}
                  disabled={templatesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={templatesLoading ? "Loading templates..." : "Select pricing template"} />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template, index) => (
                      <SelectItem key={template._id || `${template.id}-${index}`} value={template.id}>
                        {template.name} - ${template.price}/{template.period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      ${selectedTemplate.price}/{selectedTemplate.period}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedTemplate.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features & Settings</CardTitle>
              <CardDescription>
                What&apos;s included in this plan and how it appears.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-3 block">Features *</Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Feature description"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        disabled={formData.features.length === 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div>
                <Label htmlFor="buttonText">Button Text *</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  placeholder="Get Started"
                  required
                />
              </div>

              <div>
                <Label htmlFor="buttonVariant">Button Style</Label>
                <Select value={formData.buttonVariant} onValueChange={(value) => handleInputChange('buttonVariant', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Primary (Filled)</SelectItem>
                    <SelectItem value="outline">Secondary (Outline)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) => handleInputChange('popular', checked)}
                />
                <Label htmlFor="popular" className="text-sm">
                  Mark as popular plan (recommended)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/pricing">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Plan'}
          </Button>
        </div>
      </form>
    </div>
  )
}