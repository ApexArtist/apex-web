import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Heart, Sparkles } from 'lucide-react'

export default async function ArtistsPage() {
  const supabase = createClient()

  const { data: artists } = await supabase
    .from('profiles')
    .select('id,username,display_name,avatar_url,bio,created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: postCounts } = await supabase
    .from('posts')
    .select('user_id')

  const postCountMap = postCounts?.reduce((acc: any, post) => {
    acc[post.user_id] = (acc[post.user_id] || 0) + 1
    return acc
  }, {}) || {}

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-border pb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-blue" />
            <span className="text-[11px] uppercase tracking-[4px] text-muted">Community</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-4xl text-text sm:text-5xl">Artists Directory</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-dim">
                Discover talented creators in the Apex Artist community.
              </p>
            </div>
          </div>
        </div>

        {!artists?.length ? (
          <div className="border border-border bg-surface/60 px-6 py-16 text-center">
            <p className="text-sm text-muted">No artists yet. Be the first to join!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist: any) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.username}`}
                className="group border border-border bg-surface/70 p-6 transition-colors hover:border-blue"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-border bg-card">
                    {artist.avatar_url ? (
                      <Image src={artist.avatar_url} alt={artist.display_name || artist.username} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-dim">
                        <span className="text-xl font-display font-bold text-blue">
                          {(artist.display_name || artist.username)[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold uppercase tracking-[1px] text-text group-hover:text-blue transition-colors truncate">
                      {artist.display_name || artist.username}
                    </h2>
                    <p className="text-[11px] uppercase tracking-[2px] text-muted">@{artist.username}</p>
                  </div>
                </div>

                {artist.bio && (
                  <p className="mb-4 text-xs leading-relaxed text-text-dim line-clamp-2">{artist.bio}</p>
                )}

                <div className="flex items-center gap-3 text-xs uppercase tracking-[2px] text-muted border-t border-border pt-3">
                  <span className="flex items-center gap-1">
                    <span className="text-blue">◆</span> {postCountMap[artist.id] || 0} posts
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
