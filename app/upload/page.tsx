import Navbar from '@/components/Navbar'
import UploadPostForm from '@/components/UploadPostForm'
import { createClient } from '@/lib/supabase/server'
import { Sparkles } from 'lucide-react'

export default async function UploadPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-border pb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-blue" />
            <span className="text-[11px] uppercase tracking-[4px] text-muted">Share Your Work</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-4xl text-text sm:text-5xl">Publish a new piece</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-dim">
                Post your image, prompt, and creative context for the broader Apex Artist community.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 border border-border bg-surface/70 px-3 py-2 text-[11px] uppercase tracking-[2px] text-blue">
              <Sparkles size={13} /> {user ? 'Signed in and ready' : 'Sign in to continue'}
            </div>
          </div>
        </div>

        <div className="border border-border bg-surface/70 p-6 sm:p-8">
          <UploadPostForm />
        </div>
      </div>
    </div>
  )
}
