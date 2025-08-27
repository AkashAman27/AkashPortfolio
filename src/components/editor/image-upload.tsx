'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  onImageSelect: (url: string, alt?: string) => void
  className?: string
}

export default function ImageUpload({ onImageSelect, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; name: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file)

      if (error) {
        console.error('Upload error:', error)
        alert('Failed to upload image: ' + error.message)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath)

      setUploadedImages(prev => [...prev, { url: publicUrl, name: file.name }])
      onImageSelect(publicUrl, imageAlt || file.name)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (imageUrl) {
      onImageSelect(imageUrl, imageAlt)
      setImageUrl('')
      setImageAlt('')
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Add Image
        </CardTitle>
        <CardDescription>
          Upload an image or provide a URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-3">
          <Label>Upload Image</Label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-3">
          <Label>Or Enter Image URL</Label>
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <Input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Alt text (optional)"
            />
            <Button type="submit" variant="outline" disabled={!imageUrl} className="w-full">
              <Link className="mr-2 h-4 w-4" />
              Use URL
            </Button>
          </form>
        </div>

        {/* Recently Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <Label>Recently Uploaded</Label>
            <div className="grid grid-cols-2 gap-2">
              {uploadedImages.slice(-4).map((image, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer border rounded-lg overflow-hidden hover:border-primary"
                  onClick={() => onImageSelect(image.url, image.name)}
                >
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs">Use Image</span>
                  </div>
                  <button
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      setUploadedImages(prev => prev.filter((_, i) => i !== index))
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}