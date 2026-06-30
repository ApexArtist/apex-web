'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { Camera, Loader2, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function UploadPostForm() {
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/auth?redirect=/upload')
        return
      }
      setUserId(user.id)
    })
  }, [router, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !file) {
      setError('Please choose an image and sign in again if needed.')
      return
    }
    if (!title.trim() || !prompt.trim()) {
      setError('Title and prompt are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const imageUrl = await uploadToCloudinary(file, 'posts')
      const tagList = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      const { data, error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          title: title.trim(),
          prompt: prompt.trim(),
          negative_prompt: negativePrompt.trim() || null,
          image_url: imageUrl,
          model: model.trim() || null,
          tags: tagList,
        })
        .select('id')
        .single()

      if (insertError || !data) throw insertError || new Error('Unable to create post')
      router.push(`/gallery/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Unable to publish your work right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div>
            <label className="label">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Ethereal cityscape study" maxLength={80} />
          </div>

          <div>
            <label className="label">Prompt</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="input min-h-[140px] resize-none" placeholder="Describe the scene, lighting, style, and mood..." />
          </div>

          <div>
            <label className="label">Negative Prompt</label>
            <textarea value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className="input min-h-[110px] resize-none" placeholder="Things to avoid..." />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="label">Image</label>
            <label className="flex min-h-[240px] cursor-pointer items-center justify-center border border-dashed border-border bg-surface/70 hover:border-blue transition-colors">
              {preview ? (
                <div className="relative h-[240px] w-full">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="text-center px-6 py-10">
                  <Camera size={24} className="mx-auto mb-3 text-blue" />
                  <p className="text-sm text-text">Drop your image here</p>
                  <p className="text-xs uppercase tracking-[2px] text-muted mt-2">PNG, JPG, WEBP</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="label">Model</label>
            <input value={model} onChange={(e) => setModel(e.target.value)} className="input" placeholder="Flux, SDXL, Blender, etc." />
          </div>

          <div>
            <label className="label">Tags</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="input" placeholder="3D, VFX, concept, editing" />
          </div>
        </div>
      </div>

      {error && <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? 'Publishing…' : 'Publish Work'}
        </button>
        <p className="text-xs uppercase tracking-[2px] text-muted">Your post will appear in the public gallery instantly.</p>
      </div>
    </form>
  )
}
