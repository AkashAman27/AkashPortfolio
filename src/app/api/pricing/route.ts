import { NextResponse } from 'next/server'
import { getPricingCollection, initializeDefaultPricing, PricingPlan } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const collection = await getPricingCollection()
    
    // Initialize default pricing if empty
    await initializeDefaultPricing()
    
    const plans = await collection.find({}).sort({ price: 1 }).toArray()
    
    return NextResponse.json(plans.map(plan => ({
      ...plan,
      _id: plan._id?.toString()
    })))
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, pricingTemplateId, description, features, popular, buttonText, buttonVariant } = body

    // Validate required fields
    if (!id || !name || !pricingTemplateId || !description || !features || !buttonText || !buttonVariant) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const collection = await getPricingCollection()
    
    // Check if plan with this ID already exists
    const existingPlan = await collection.findOne({ id })
    if (existingPlan) {
      return NextResponse.json(
        { error: 'Plan with this ID already exists' },
        { status: 409 }
      )
    }

    const newPlan: Omit<PricingPlan, '_id'> = {
      id,
      name,
      pricingTemplateId,
      description,
      features: Array.isArray(features) ? features : [],
      popular: Boolean(popular),
      buttonText,
      buttonVariant: buttonVariant === 'default' ? 'default' : 'outline',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(newPlan)
    
    return NextResponse.json({
      ...newPlan,
      _id: result.insertedId.toString()
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to create pricing plan' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { _id, id, name, pricingTemplateId, description, features, popular, buttonText, buttonVariant } = body

    if (!_id) {
      return NextResponse.json(
        { error: 'Plan ID is required for updates' },
        { status: 400 }
      )
    }

    const collection = await getPricingCollection()
    
    const updateData: Partial<PricingPlan> = {
      updatedAt: new Date()
    }

    if (id !== undefined) updateData.id = id
    if (name !== undefined) updateData.name = name
    if (pricingTemplateId !== undefined) updateData.pricingTemplateId = pricingTemplateId
    if (description !== undefined) updateData.description = description
    if (features !== undefined) updateData.features = Array.isArray(features) ? features : []
    if (popular !== undefined) updateData.popular = Boolean(popular)
    if (buttonText !== undefined) updateData.buttonText = buttonText
    if (buttonVariant !== undefined) updateData.buttonVariant = buttonVariant === 'default' ? 'default' : 'outline'

    const objectId = new ObjectId(_id)
    const result = await collection.updateOne(
      { _id: objectId } as any,
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    const updatedPlan = await collection.findOne({ _id: objectId } as any)
    
    return NextResponse.json({
      ...updatedPlan,
      _id: updatedPlan?._id?.toString()
    })
  } catch (error) {
    console.error('Error updating pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing plan' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    const collection = await getPricingCollection()
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) } as any)

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Plan deleted successfully' })
  } catch (error) {
    console.error('Error deleting pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete pricing plan' },
      { status: 500 }
    )
  }
}