// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') || '/'

  if (code) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // Auto-create profile from OAuth data
        const rawUsername = (
          user.user_metadata?.user_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'artist'
        ).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30)

        // Ensure unique username
        let username = rawUsername
        let suffix = 1
        while (true) {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single()
          if (!existing) break
          username = `${rawUsername}${suffix++}`
        }

        await supabase.from('profiles').insert({
          id: user.id,
          username,
          display_name: user.user_metadata?.full_name || user.user_metadata?.name || username,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          bio: null,
        })

        // New user → go to profile setup
        return NextResponse.redirect(`${origin}/profile/setup`)
      }

      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=callback_failed`)
}
