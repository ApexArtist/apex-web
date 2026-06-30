// app/artists/[username]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { MapPin, Globe, Youtube, Twitter, Instagram, Edit, Grid3X3, Heart } from 'lucide-react'

export async function generateMetadata({ params }: { params: { username: string } }) {
  const supabase = createClient()
  const { data: profile } = await supabase.from('profiles').select('display_name, bio').eq('username', params.username).single()
  if (!profile) return { title: 'Artist Not Found' }
  return {
    title: `${profile.display_name || params.username} — Apex Artist`,
    description: profile.bio || `View ${params.username}'s AI art and prompts on Apex Artist`,
  }
}

export default async function ArtistProfilePage({ params }: { params: { username: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, image_url, likes_count, tags')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(30)

  const isOwner = user?.id === profile.id

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      {/* Banner */}
      <div className="relative h-52 bg-gradient-to-br from-accent/30 via-surface to-ink overflow-hidden">
        {profile.banner_url && (
          <Image src={profile.banner_url} alt="banner" fill className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Profile header */}
        <div className="relative -mt-16 mb-6 flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="w-28 h-28 rounded-2xl border-4 border-ink bg-surface overflow-hidden flex items-center justify-center shadow-2xl">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.display_name || profile.username} width={112} height={112} className="object-cover w-full h-full" />
              ) : (
                <span className="text-4xl font-display text-accent">
                  {(profile.display_name || profile.username)[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="pb-1">
              <h1 className="font-display text-2xl font-bold text-text">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-text-dim text-sm">@{profile.username}</p>
            </div>
          </div>

          {isOwner && (
            <Link href="/profile/edit" className="btn-ghost flex items-center gap-2 mb-1">
              <Edit size={14} /> Edit Profile
            </Link>
          )}
        </div>

        {/* Bio & meta */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="flex-1">
            {profile.bio && <p className="text-text-dim leading-relaxed mb-4">{profile.bio}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              {profile.location && (
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {profile.location}</span>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                  <Globe size={13} /> {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {profile.youtube_url && (
                <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                  <Youtube size={13} /> YouTube
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                  <Twitter size={13} /> X
                </a>
              )}
              {profile.instagram_url && (
                <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                  <Instagram size={13} /> Instagram
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 md:flex-col md:gap-3 md:text-right">
            <div>
              <p className="text-2xl font-display font-bold text-text">{posts?.length ?? 0}</p>
              <p className="text-muted text-xs">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text">
                {posts?.reduce((s, p) => s + (p.likes_count || 0), 0) ?? 0}
              </p>
              <p className="text-muted text-xs">Likes</p>
            </div>
          </div>
        </div>

        {/* Posts grid */}
        <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
          <Grid3X3 size={15} className="text-accent" />
          <span className="text-sm font-medium">Posts</span>
        </div>

        {!posts?.length ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm mb-4">No posts yet</p>
            {isOwner && <Link href="/upload" className="btn-primary inline-flex">Share your first work</Link>}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-12">
            {posts.map(post => (
              <Link href={`/gallery/${post.id}`} key={post.id} className="group relative aspect-square rounded-xl overflow-hidden bg-surface">
                <Image src={post.image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium truncate">{post.title}</p>
                    <p className="text-white/70 text-xs flex items-center gap-1">
                      <Heart size={10} /> {post.likes_count}
                    </p>
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
