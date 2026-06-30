'use client'
// app/profile/edit/page.tsx
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { User, Camera, Save, ArrowLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({
    username: '', display_name: '', bio: '', location: '',
    website: '', youtube_url: '', twitter_url: '', instagram_url: '',
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const avatarRef = useRef<HTMLInputElement>(null)
  const bannerRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        setForm({
          username: profile.username || '',
          display_name: profile.display_name || '',
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          youtube_url: profile.youtube_url || '',
          twitter_url: profile.twitter_url || '',
          instagram_url: profile.instagram_url || '',
        })
        setAvatar(profile.avatar_url)
        setBanner(profile.banner_url)
      }
      setFetchLoading(false)
    })
  }, [])

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    setMessage(null)
    try {
      let avatarUrl = avatar && !avatar.startsWith('blob:') ? avatar : undefined
      let bannerUrl = banner && !banner.startsWith('blob:') ? banner : undefined

      if (avatarFile) avatarUrl = await uploadToCloudinary(avatarFile, 'avatars')
      if (bannerFile) bannerUrl = await uploadToCloudinary(bannerFile, 'banners')

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...form,
        ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
        ...(bannerUrl !== undefined && { banner_url: bannerUrl }),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      setMessage({ type: 'success', text: 'Profile updated!' })
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to update' })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/artists/${form.username}`} className="p-2 rounded-lg hover:bg-surface transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-semibold">Edit Profile</h1>
        </div>

        {/* Banner */}
        <div className="card mb-6 overflow-hidden">
          <div
            className="relative h-36 bg-gradient-to-br from-accent/20 to-surface cursor-pointer group"
            onClick={() => bannerRef.current?.click()}
          >
            {banner && <Image src={banner} alt="banner" fill className="object-cover" />}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <ImageIcon size={18} className="text-white" />
              <span className="text-white text-sm">Change Banner</span>
            </div>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) { setBannerFile(f); setBanner(URL.createObjectURL(f)) } }} />
          </div>

          <div className="px-6 pb-5">
            <div className="relative -mt-10 mb-4 inline-block">
              <div className="w-20 h-20 rounded-2xl border-4 border-card bg-surface overflow-hidden flex items-center justify-center">
                {avatar ? <Image src={avatar} alt="avatar" width={80} height={80} className="object-cover w-full h-full" /> : <User size={28} className="text-muted" />}
              </div>
              <button onClick={() => avatarRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-lg flex items-center justify-center hover:bg-accent-glow">
                <Camera size={13} className="text-white" />
              </button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) { setAvatarFile(f); setAvatar(URL.createObjectURL(f)) } }} />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-text mb-1">Basic Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Display Name</label>
              <input className="input" value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} placeholder="Your name" />
            </div>
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                <input className="input pl-8" value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                  placeholder="username" maxLength={30} />
              </div>
            </div>
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea className="input resize-none h-24" value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell people about your art..." maxLength={300} />
          </div>

          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, Country" />
          </div>

          <div className="border-t border-border pt-5">
            <h2 className="font-semibold text-text mb-4">Links</h2>
            <div className="space-y-3">
              {[
                { key: 'website', label: 'Website', placeholder: 'https://yoursite.com' },
                { key: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
                { key: 'twitter_url', label: 'Twitter / X', placeholder: 'https://x.com/handle' },
                { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/handle' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input className="input" value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder} type="url" />
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className={`text-xs px-3 py-2.5 rounded-lg ${
              message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>{message.text}</div>
          )}

          <button onClick={handleSave} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
