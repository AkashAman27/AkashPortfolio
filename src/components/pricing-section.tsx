'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
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

export default function PricingSection() {
  const [plans, setPlans] = useState<PricingPlanWithTemplate[]>([])
  const [templates, setTemplates] = useState<PricingTemplate[]>([])
  const [loading, setLoading] = useState(true)

  // Default pricing plans (fallback)
  const defaultPlans: PricingPlanWithTemplate[] = [
    {
      id: 'basic',
      name: 'Basic',
      pricingTemplateId: 'free',
      description: 'Perfect for getting started',
      features: [
        '1 Project',
        'Basic Support',
        '5 Team Members',
        '10GB Storage',
        'Email Support'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline',
      template: {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'month',
        description: 'No cost option'
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      pricingTemplateId: 'professional',
      description: 'Best for growing teams',
      features: [
        'Unlimited Projects',
        'Priority Support',
        'Unlimited Team Members',
        '100GB Storage',
        'Advanced Analytics',
        'Custom Integrations'
      ],
      popular: true,
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default',
      template: {
        id: 'professional',
        name: 'Professional',
        price: 29,
        period: 'month',
        description: 'For growing businesses'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      pricingTemplateId: 'enterprise',
      description: 'For large-scale operations',
      features: [
        'Everything in Pro',
        'Dedicated Account Manager',
        'Custom Solutions',
        'Unlimited Storage',
        'Advanced Security',
        'SLA Guarantee',
        '24/7 Phone Support'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      template: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        period: 'month',
        description: 'Full-scale business solution'
      }
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both pricing plans and templates
        const [plansResponse, templatesResponse] = await Promise.all([
          fetch('/api/pricing'),
          fetch('/api/pricing-templates')
        ])

        let templatesData: PricingTemplate[] = []
        if (templatesResponse.ok) {
          templatesData = await templatesResponse.json()
          setTemplates(templatesData)
        }

        if (plansResponse.ok) {
          const plansData = await plansResponse.json()
          
          if (plansData.length > 0 && templatesData.length > 0) {
            // Map plans with their corresponding templates
            const plansWithTemplates = plansData.map((plan: PricingPlan) => ({
              ...plan,
              template: templatesData.find((t: PricingTemplate) => t.id === plan.pricingTemplateId)
            }))
            setPlans(plansWithTemplates)
          } else {
            setPlans(defaultPlans)
          }
        } else {
          setPlans(defaultPlans)
        }
      } catch (error) {
        console.error('Failed to fetch pricing data:', error)
        setPlans(defaultPlans)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-96 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-8 animate-pulse">
                  <div className="h-6 bg-gray-800 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-800 rounded w-32 mb-6"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-gray-800 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Choose Your Plan</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-extralight leading-relaxed">
            Flexible pricing options to match your needs. Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-br from-gray-900 to-black rounded-xl border transition-all duration-300 group ${
                plan.popular
                  ? 'border-blue-500/30 scale-105 shadow-2xl shadow-blue-500/10'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      ${plan.template?.price || 0}
                    </span>
                    <span className="text-gray-400 ml-1">/{plan.template?.period || 'month'}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none'
                      : plan.buttonVariant === 'outline'
                      ? 'bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                      : 'bg-white text-black hover:bg-gray-100'
                  } transition-all duration-300`}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </div>

              {plan.popular && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm mb-4">
            All plans include 30-day money-back guarantee
          </p>
          <p className="text-gray-500 text-xs">
            Prices may vary based on your location and applicable taxes.
          </p>
        </div>
      </div>
    </section>
  )
}