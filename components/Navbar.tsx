'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, User, LogOut, Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from('profiles').select('username,avatar_url').eq('id', user.id).single()
          .then(({ data }) => setProfile(data))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-ink/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-lg tracking-[4px] text-text hover:text-text">
          APEX<span className="text-blue">ARTIST</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/gallery" className="text-xs tracking-[2px] uppercase text-muted hover:text-text transition-colors">Gallery</Link>
          <Link href="/artists" className="text-xs tracking-[2px] uppercase text-muted hover:text-text transition-colors">Artists</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/upload" className="hidden sm:flex btn-primary items-center gap-1.5">
                <Upload size={12} /> Share
              </Link>
              <div className="relative group">
                <button className="p-1.5 hover:bg-surface transition-colors">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt="avatar" width={28} height={28} className="object-cover" />
                  ) : (
                    <div className="w-7 h-7 bg-blue-dim flex items-center justify-center">
                      <User size={14} className="text-blue" />
                    </div>
                  )}
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                  <Link href={`/artists/${profile?.username}`} className="flex items-center gap-2 px-4 py-3 text-xs tracking-wider uppercase text-muted hover:text-text hover:bg-surface transition-colors">
                    <User size={12} /> Profile
                  </Link>
                  <Link href="/profile/edit" className="flex items-center gap-2 px-4 py-3 text-xs tracking-wider uppercase text-muted hover:text-text hover:bg-surface transition-colors border-t border-border">
                    Edit
                  </Link>
                  <button onClick={signOut} className="flex items-center gap-2 px-4 py-3 text-xs tracking-wider uppercase text-blue hover:bg-surface transition-colors border-t border-border w-full text-left">
                    <LogOut size={12} /> Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn-ghost hidden sm:flex">Sign In</Link>
              <Link href="/auth" className="btn-primary">Join</Link>
            </>
          )}
          <button className="md:hidden p-2 text-muted hover:text-text" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-ink px-6 py-3 space-y-1">
          <Link href="/gallery" className="block px-3 py-2.5 text-xs tracking-widest uppercase text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link href="/artists" className="block px-3 py-2.5 text-xs tracking-widest uppercase text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Artists</Link>
          {user && <Link href="/upload" className="block px-3 py-2.5 text-xs tracking-widest uppercase text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Share Work</Link>}
        </div>
      )}
    </nav>
  )
}
