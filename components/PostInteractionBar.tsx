'use client'

import { useState } from 'react'
import { Heart, Bookmark, Loader2 } from 'lucide-react'

interface PostInteractionBarProps {
  postId: string
  initialLiked?: boolean
  initialSaved?: boolean
  initialLikesCount?: number
  initialSavesCount?: number
}

export default function PostInteractionBar({
  postId,
  initialLiked = false,
  initialSaved = false,
  initialLikesCount = 0,
  initialSavesCount = 0,
}: PostInteractionBarProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [saved, setSaved] = useState(initialSaved)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [savesCount, setSavesCount] = useState(initialSavesCount)
  const [pending, setPending] = useState<'like' | 'save' | null>(null)

  async function toggleLike() {
    setPending('like')
    const method = liked ? 'DELETE' : 'POST'
    const res = await fetch(`/api/posts/${postId}/like`, { method })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setLiked(!liked)
      setLikesCount((count) => (liked ? Math.max(count - 1, 0) : count + 1))
    }
    setPending(null)
  }

  async function toggleSave() {
    setPending('save')
    const method = saved ? 'DELETE' : 'POST'
    const res = await fetch(`/api/posts/${postId}/save`, { method })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setSaved(!saved)
      setSavesCount((count) => (saved ? Math.max(count - 1, 0) : count + 1))
    }
    setPending(null)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={toggleLike}
        disabled={pending === 'like'}
        className={`flex items-center gap-2 border px-3 py-2 text-[11px] tracking-[2px] uppercase transition-colors ${liked ? 'border-blue text-blue' : 'border-border text-muted hover:border-blue hover:text-text'}`}
      >
        {pending === 'like' ? <Loader2 size={13} className="animate-spin" /> : <Heart size={13} fill={liked ? 'currentColor' : 'none'} />}
        {likesCount}
      </button>

      <button
        onClick={toggleSave}
        disabled={pending === 'save'}
        className={`flex items-center gap-2 border px-3 py-2 text-[11px] tracking-[2px] uppercase transition-colors ${saved ? 'border-blue text-blue' : 'border-border text-muted hover:border-blue hover:text-text'}`}
      >
        {pending === 'save' ? <Loader2 size={13} className="animate-spin" /> : <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />}
        {savesCount}
      </button>
    </div>
  )
}
