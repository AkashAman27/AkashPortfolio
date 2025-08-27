import { MongoClient, Db, Collection } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const MONGODB_DB = process.env.MONGODB_DB || 'akash-portfolio'

interface GlobalMongo {
  client?: MongoClient
  db?: Db
}

declare global {
  var __mongo: GlobalMongo | undefined
}

let cached = global.__mongo

if (!cached) {
  cached = global.__mongo = {}
}

export interface PricingTemplate {
  _id?: string
  id: string
  name: string
  price: number
  period: string
  description: string
  createdAt?: Date
  updatedAt?: Date
}

export interface PricingPlan {
  _id?: string
  id: string
  name: string
  pricingTemplateId: string  // Reference to PricingTemplate
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant: 'default' | 'outline'
  createdAt?: Date
  updatedAt?: Date
}

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  if (cached?.client && cached?.db) {
    return {
      client: cached.client,
      db: cached.db,
    }
  }

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db(MONGODB_DB)

    cached!.client = client
    cached!.db = db

    console.log('Connected to MongoDB')

    return {
      client,
      db,
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function getPricingCollection(): Promise<Collection<PricingPlan>> {
  const { db } = await connectToDatabase()
  return db.collection<PricingPlan>('pricing')
}

export async function getPricingTemplatesCollection(): Promise<Collection<PricingTemplate>> {
  const { db } = await connectToDatabase()
  return db.collection<PricingTemplate>('pricing_templates')
}

export async function initializeDefaultPricingTemplates(): Promise<void> {
  const collection = await getPricingTemplatesCollection()
  
  // Check if we already have pricing templates
  const existingCount = await collection.countDocuments()
  if (existingCount > 0) {
    return
  }

  const defaultTemplates: PricingTemplate[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'No cost, perfect for getting started',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 5,
      period: 'month',
      description: 'Affordable starter option',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 19,
      period: 'month',
      description: 'Most popular pricing tier',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 29,
      period: 'month',
      description: 'For growing businesses',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49,
      period: 'month',
      description: 'Advanced features included',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'Full-scale business solution',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await collection.insertMany(defaultTemplates)
  console.log('Default pricing templates initialized')
}

export async function initializeDefaultPricing(): Promise<void> {
  // First initialize pricing templates
  await initializeDefaultPricingTemplates()
  
  const collection = await getPricingCollection()
  
  // Check if we already have pricing data
  const existingCount = await collection.countDocuments()
  if (existingCount > 0) {
    return
  }

  const defaultPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
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
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'pro',
      name: 'Pro Plan',
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
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await collection.insertMany(defaultPlans)
  console.log('Default pricing plans initialized')
}