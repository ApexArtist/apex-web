import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createClient()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimalist hero - Google-inspired */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Apex Artist Logo - Large & Centered */}
        <div className="mb-12 text-center">
          <div className="font-display text-[clamp(64px,14vw,120px)] leading-none tracking-wide font-bold">
            <div className="text-gray-900">APEX</div>
            <div className="text-blue">ARTIST</div>
          </div>
        </div>

        {/* Action Buttons - Rounded */}
        <div className="flex flex-wrap gap-4 justify-center w-full max-w-2xl mb-8">
          <Link
            href="/profile/setup"
            className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-900 text-sm font-semibold uppercase tracking-[1px] rounded-full hover:border-blue hover:text-blue transition-all shadow-sm"
          >
            Character Sheet
          </Link>
          <Link
            href="/upload"
            className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-900 text-sm font-semibold uppercase tracking-[1px] rounded-full hover:border-blue hover:text-blue transition-all shadow-sm"
          >
            Prompt
          </Link>
          <Link
            href="/gallery"
            className="px-8 py-3 bg-blue text-white text-sm font-semibold uppercase tracking-[1px] rounded-full hover:bg-blue-glow transition-all shadow-md"
          >
            Gallery
          </Link>
        </div>

        {/* Tagline */}
        <p className="text-center text-gray-600 text-sm tracking-[0.5px] max-w-sm font-medium">
          Where AI meets mastery. Share. Create. Inspire.
        </p>
      </div>

      {/* Footer bar */}
      <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
        <span className="text-xs tracking-[2px] uppercase text-gray-600 font-semibold">Apex Artist</span>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue rounded-full opacity-70" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-blue rounded-full opacity-40" />
        </div>
      </div>
    </div>
  )
}
