'use client'
// app/profile/setup/page.tsx
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { User, Camera, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfileSetupPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({
    username: '',
    display_name: '',
    bio: '',
    location: '',
    website: '',
    youtube_url: '',
    twitter_url: '',
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'taken' | 'available'>('idle')
  const [error, setError] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()
  const usernameTimer = useRef<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const name = user.user_metadata?.full_name || user.user_metadata?.name || ''
      const emailUser = user.email?.split('@')[0] || ''
      const raw = name.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 20) || emailUser
      setForm(f => ({ ...f, display_name: name, username: raw }))
      setAvatar(user.user_metadata?.avatar_url || user.user_metadata?.picture || null)
    })
  }, [])

  const checkUsername = (value: string) => {
    clearTimeout(usernameTimer.current)
    if (!value || value.length < 3) { setUsernameStatus('idle'); return }
    setUsernameStatus('checking')
    usernameTimer.current = setTimeout(async () => {
      const { data } = await supabase.from('profiles').select('id').eq('username', value).neq('id', user?.id ?? '').single()
      setUsernameStatus(data ? 'taken' : 'available')
    }, 500)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatar(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!user) return
    if (!form.username || form.username.length < 3) { setError('Username must be at least 3 characters'); return }
    if (usernameStatus === 'taken') { setError('Username is taken'); return }
    setLoading(true)
    setError('')

    try {
      let avatarUrl = avatar && !avatar.startsWith('blob:') ? avatar : null

      if (avatarFile) {
        avatarUrl = await uploadToCloudinary(avatarFile, 'avatars')
      }

      await supabase.from('profiles').upsert({
        id: user.id,
        ...form,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })

      router.push(`/artists/${form.username}`)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-accent" />
            <span className="text-accent text-sm font-medium">Profile Setup</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-text mb-2">Create your artist profile</h1>
          <p className="text-text-dim text-sm">This is how others will discover your work</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-accent w-8' : 'bg-border w-4'}`} />
          ))}
        </div>

        <div className="card p-6 glow-accent">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold mb-4">Basic Info</h2>

              {/* Avatar upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-surface border border-border overflow-hidden flex items-center justify-center">
                    {avatar ? (
                      <Image src={avatar} alt="avatar" width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <User size={28} className="text-muted" />
                    )}
                  </div>
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-accent rounded-lg flex items-center justify-center hover:bg-accent-glow transition-colors"
                  >
                    <Camera size={13} className="text-white" />
                  </button>
                  <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Profile Photo</p>
                  <p className="text-xs text-muted mt-0.5">JPG, PNG up to 5MB</p>
                  <button onClick={() => avatarInputRef.current?.click()} className="text-accent text-xs mt-1 hover:text-accent-glow">
                    Upload photo
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Display Name</label>
                <input
                  className="input"
                  value={form.display_name}
                  onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  placeholder="Your artist name"
                />
              </div>

              <div>
                <label className="label">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                  <input
                    className={`input pl-8 ${usernameStatus === 'taken' ? 'border-red-500' : usernameStatus === 'available' ? 'border-green-500' : ''}`}
                    value={form.username}
                    onChange={e => {
                      const v = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                      setForm(f => ({ ...f, username: v }))
                      checkUsername(v)
                    }}
                    placeholder="username"
                    maxLength={30}
                  />
                  {usernameStatus === 'checking' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  )}
                  {usernameStatus === 'available' && (
                    <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                </div>
                {usernameStatus === 'taken' && <p className="text-red-400 text-xs mt-1">Username is already taken</p>}
                {usernameStatus === 'available' && <p className="text-green-400 text-xs mt-1">Username is available</p>}
                <p className="text-muted text-xs mt-1">apexartist.vercel.app/artists/{form.username || 'yourname'}</p>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full flex items-center justify-center gap-2">
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold mb-4">About You</h2>

              <div>
                <label className="label">Bio</label>
                <textarea
                  className="input resize-none h-24"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell people about your art, style, and what inspires you..."
                  maxLength={300}
                />
                <p className="text-muted text-xs text-right">{form.bio.length}/300</p>
              </div>

              <div>
                <label className="label">Location</label>
                <input
                  className="input"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Manipur, India"
                />
              </div>

              <div>
                <label className="label">Website</label>
                <input
                  className="input"
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="https://yoursite.com"
                  type="url"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold mb-4">Social Links <span className="text-muted text-sm font-normal">(optional)</span></h2>

              <div>
                <label className="label">YouTube Channel URL</label>
                <input
                  className="input"
                  value={form.youtube_url}
                  onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))}
                  placeholder="https://youtube.com/@yourchannel"
                  type="url"
                />
              </div>

              <div>
                <label className="label">Twitter / X</label>
                <input
                  className="input"
                  value={form.twitter_url}
                  onChange={e => setForm(f => ({ ...f, twitter_url: e.target.value }))}
                  placeholder="https://x.com/yourhandle"
                  type="url"
                />
              </div>

              {error && (
                <div className="text-xs px-3 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-ghost flex-1">Back</button>
                <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle size={15} />
                  )}
                  {loading ? 'Saving...' : 'Create Profile'}
                </button>
              </div>

              <button
                onClick={() => router.push('/')}
                className="w-full text-center text-muted text-xs hover:text-text-dim transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
