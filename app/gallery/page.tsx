import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Sparkles } from 'lucide-react'
import { placeholderPosts } from '@/lib/placeholder-gallery'

interface GalleryPageProps {
  searchParams: { sort?: string; tag?: string }
}

const validTags = ['All', '3D', 'Blender', 'VFX', 'Editing', 'Concept', 'Prompt']

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const supabase = createClient()
  const sort = searchParams.sort === 'popular' ? 'popular' : 'latest'
  const tagFilter = searchParams.tag?.trim() || ''

  let query = supabase
    .from('posts')
    .select('id,title,image_url,likes_count,saves_count,created_at,tags,profiles(username,display_name,avatar_url)')
    .order('created_at', { ascending: false })

  if (sort === 'popular') {
    query = query.order('likes_count', { ascending: false })
  }

  if (tagFilter && tagFilter !== 'All') {
    query = query.contains('tags', [tagFilter])
  }

  const { data: posts } = await query.limit(24)
  const galleryPosts = posts?.length ? posts : placeholderPosts

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-border pb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-blue" />
            <span className="text-[11px] uppercase tracking-[4px] text-muted">Public Gallery</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-4xl text-text sm:text-5xl">Apex Gallery</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-dim">
                Discover polished prompts, cinematic stills, and serious AI-augmented craft from the community.
              </p>
            </div>
            <Link href="/upload" className="btn-primary inline-flex items-center gap-2 self-start">
              <Sparkles size={14} /> Share Work
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2 border border-border bg-surface/70 p-3">
          {validTags.map((item) => {
            const isActive = (tagFilter || 'All') === item
            const href = `/gallery?sort=${sort}${item === 'All' ? '' : `&tag=${encodeURIComponent(item)}`}`
            return (
              <Link
                key={item}
                href={href}
                className={`px-3 py-2 text-[11px] uppercase tracking-[2px] transition-colors ${isActive ? 'bg-blue text-ink' : 'border border-transparent text-muted hover:border-blue hover:text-text'}`}
              >
                {item}
              </Link>
            )
          })}
          <div className="ml-auto flex items-center gap-2">
            <Link href={`/gallery?sort=latest${tagFilter ? `&tag=${encodeURIComponent(tagFilter)}` : ''}`} className={`px-3 py-2 text-[11px] uppercase tracking-[2px] ${sort === 'latest' ? 'bg-blue text-ink' : 'text-muted hover:text-text'}`}>
              Latest
            </Link>
            <Link href={`/gallery?sort=popular${tagFilter ? `&tag=${encodeURIComponent(tagFilter)}` : ''}`} className={`px-3 py-2 text-[11px] uppercase tracking-[2px] ${sort === 'popular' ? 'bg-blue text-ink' : 'text-muted hover:text-text'}`}>
              Popular
            </Link>
          </div>
        </div>

        {!galleryPosts.length ? (
          <div className="border border-border bg-surface/60 px-6 py-16 text-center">
            <p className="text-sm text-muted">No posts match this filter yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {galleryPosts.map((post: any) => (
              <Link key={post.id} href={`/gallery/${post.id}`} className="group border border-border bg-surface/70 transition-colors hover:border-blue">
                <div className="relative aspect-[4/5] overflow-hidden border-b border-border bg-card">
                  <Image src={post.image_url} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <div className="mb-3 h-px w-12 bg-blue" />
                  <h2 className="text-sm font-medium uppercase tracking-[2px] text-text">{post.title}</h2>
                  <p className="mt-2 text-xs uppercase tracking-[2px] text-muted">
                    {(post.profiles as any)?.display_name || (post.profiles as any)?.username || 'Artist'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-[10px] uppercase tracking-[2px] text-blue">♥ {post.likes_count || 0}</span>
                    <span className="text-[10px] uppercase tracking-[2px] text-muted">★ {post.saves_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
