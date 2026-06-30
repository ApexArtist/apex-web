# Apex Artist — Setup Guide

AI Art & Prompt sharing platform. Zero cost, fully free tier.

## Stack
- **Frontend + API**: Next.js 14 on Vercel (free)
- **Database + Auth**: Supabase (free tier)
- **Image Storage + CDN**: Cloudinary (free tier)

---

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. **SQL Editor** → paste `supabase-schema.sql` → Run
3. **Authentication → Providers → Google** → Enable:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 Client ID (Web application)
   - Authorized redirect URIs: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - Paste Client ID + Secret into Supabase
4. **Authentication → URL Configuration**:
   - Site URL: `https://your-vercel-url.vercel.app`
   - Redirect URLs: `https://your-vercel-url.vercel.app/auth/callback`
5. Copy from **Settings → API**:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep secret!)

---

## 2. Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com) (free)
2. Go to **Settings → Upload → Upload Presets**
3. Click **Add upload preset**:
   - Preset name: `apex_artist_unsigned`
   - Signing mode: **Unsigned**
   - Folder: `apex-artist`
4. Copy your **Cloud Name** from the dashboard

---

## 3. Local Development

```bash
# Clone your repo
git clone https://github.com/yourusername/apex-artist
cd apex-artist

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 4. Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all environment variables from `.env.local`
4. Deploy!

**Environment variables to add in Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
NEXT_PUBLIC_APP_URL
```

5. After deploy, update in Supabase:
   - Auth → URL Configuration → Site URL = your Vercel URL
   - Auth → URL Configuration → Redirect URLs = `https://yourapp.vercel.app/auth/callback`
   - Google OAuth → Authorized redirect URIs (in Google Cloud Console)

---

## 5. Google OAuth Setup (Detailed)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or use existing
3. **APIs & Services → OAuth consent screen** → External → Fill details
4. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorized JavaScript origins: `https://YOUR_PROJECT.supabase.co`
   - Authorized redirect URIs: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
5. Copy Client ID + Client Secret → paste into Supabase Auth → Google

---

## Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| Vercel | Unlimited deploys | 100GB bandwidth/month |
| Supabase | 500MB database | Pauses after 1 week inactivity* |
| Cloudinary | 25GB storage | 25GB bandwidth/month |

*Visit Supabase dashboard weekly to keep project active on free tier.

---

## File Structure

```
apex-artist/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── auth/
│   │   ├── page.tsx          ← Sign in / Sign up
│   │   └── callback/route.ts ← OAuth callback + profile creation
│   ├── profile/
│   │   ├── setup/page.tsx    ← New user profile wizard
│   │   └── edit/page.tsx     ← Edit profile
│   ├── artists/
│   │   └── [username]/page.tsx ← Public artist profile
│   ├── gallery/              ← Browse posts (add yourself)
│   └── upload/               ← Upload new post (add yourself)
├── components/
│   └── Navbar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts         ← Browser client
│   │   └── server.ts         ← Server client
│   ├── cloudinary.ts         ← Upload utility
│   └── types.ts              ← TypeScript types
├── middleware.ts              ← Auth protection
└── supabase-schema.sql       ← Run this in Supabase first!
```
