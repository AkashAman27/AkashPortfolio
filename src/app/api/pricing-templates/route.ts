import { NextResponse } from 'next/server'
import { getPricingTemplatesCollection, initializeDefaultPricingTemplates, PricingTemplate } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const collection = await getPricingTemplatesCollection()
    
    // Initialize default pricing templates if empty
    await initializeDefaultPricingTemplates()
    
    const templates = await collection.find({}).sort({ price: 1 }).toArray()
    
    // Remove any duplicates based on id field before sending
    const uniqueTemplates = templates.filter((template, index, self) => 
      index === self.findIndex(t => t.id === template.id)
    )
    
    return NextResponse.json(uniqueTemplates.map(template => ({
      ...template,
      _id: template._id?.toString()
    })))
  } catch (error) {
    console.error('Error fetching pricing templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, price, period, description } = body

    // Validate required fields
    if (!id || !name || price === undefined || !period || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const collection = await getPricingTemplatesCollection()
    
    // Check if template with this ID already exists
    const existingTemplate = await collection.findOne({ id })
    if (existingTemplate) {
      return NextResponse.json(
        { error: 'Template with this ID already exists' },
        { status: 409 }
      )
    }

    const newTemplate: Omit<PricingTemplate, '_id'> = {
      id,
      name,
      price: Number(price),
      period,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(newTemplate)
    
    return NextResponse.json({
      ...newTemplate,
      _id: result.insertedId.toString()
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating pricing template:', error)
    return NextResponse.json(
      { error: 'Failed to create pricing template' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { _id, id, name, price, period, description } = body

    if (!_id) {
      return NextResponse.json(
        { error: 'Template ID is required for updates' },
        { status: 400 }
      )
    }

    const collection = await getPricingTemplatesCollection()
    
    const updateData: Partial<PricingTemplate> = {
      updatedAt: new Date()
    }

    if (id !== undefined) updateData.id = id
    if (name !== undefined) updateData.name = name
    if (price !== undefined) updateData.price = Number(price)
    if (period !== undefined) updateData.period = period
    if (description !== undefined) updateData.description = description

    const objectId = new ObjectId(_id)
    const result = await collection.updateOne(
      { _id: objectId } as any,
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const updatedTemplate = await collection.findOne({ _id: objectId } as any)
    
    return NextResponse.json({
      ...updatedTemplate,
      _id: updatedTemplate?._id?.toString()
    })
  } catch (error) {
    console.error('Error updating pricing template:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing template' },
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
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const collection = await getPricingTemplatesCollection()
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) } as any)

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting pricing template:', error)
    return NextResponse.json(
      { error: 'Failed to delete pricing template' },
      { status: 500 }
    )
  }
}