import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PostInteractionBar from '@/components/PostInteractionBar'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, MapPin, Sparkles } from 'lucide-react'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: post } = await supabase.from('posts').select('title,prompt').eq('id', params.id).single()
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} — Apex Artist`,
    description: post.prompt || 'Apex Artist gallery post',
  }
}

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('id,title,prompt,negative_prompt,image_url,model,tags,likes_count,saves_count,created_at,user_id,profiles(username,display_name,avatar_url)')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: likeRow } = await supabase.from('likes').select('user_id').eq('post_id', post.id).eq('user_id', user?.id ?? '').maybeSingle()
  const { data: saveRow } = await supabase.from('saves').select('user_id').eq('post_id', post.id).eq('user_id', user?.id ?? '').maybeSingle()

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/gallery" className="mb-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-muted hover:text-text">
          <ArrowLeft size={13} /> Back to gallery
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-border bg-surface/70">
            <div className="relative aspect-[4/5] overflow-hidden border-b border-border">
              <Image src={post.image_url} alt={post.title} fill className="object-cover" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-border bg-surface/70 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-blue" />
                <span className="text-[11px] uppercase tracking-[4px] text-muted">Shared Work</span>
              </div>
              <h1 className="font-display text-3xl text-text sm:text-4xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[2px] text-muted">
                <span>By {(post.profiles as any)?.display_name || (post.profiles as any)?.username || 'Artist'}</span>
                <span className="text-blue">•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="mt-6">
                <PostInteractionBar
                  postId={post.id}
                  initialLiked={Boolean(likeRow)}
                  initialSaved={Boolean(saveRow)}
                  initialLikesCount={post.likes_count || 0}
                  initialSavesCount={post.saves_count || 0}
                />
              </div>
            </div>

            <div className="border border-border bg-surface/70 p-6">
              <h2 className="text-[11px] uppercase tracking-[3px] text-muted">Prompt</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text-dim">{post.prompt}</p>
            </div>

            {post.negative_prompt && (
              <div className="border border-border bg-surface/70 p-6">
                <h2 className="text-[11px] uppercase tracking-[3px] text-muted">Negative Prompt</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text-dim">{post.negative_prompt}</p>
              </div>
            )}

            <div className="border border-border bg-surface/70 p-6">
              <div className="flex flex-wrap gap-3">
                {post.model && <span className="border border-border px-3 py-2 text-[10px] uppercase tracking-[2px] text-blue">Model • {post.model}</span>}
                {post.tags?.map((tag: string) => (
                  <span key={tag} className="border border-border px-3 py-2 text-[10px] uppercase tracking-[2px] text-muted">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
