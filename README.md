# Apex Artist 🎨

A modern, community-driven platform for 3D artists, VFX creators, and prompt engineers to showcase, share, and discover AI-generated and digital artwork.

**Live Demo**: Coming Soon 🚀

---

## ✨ Features

- 🎯 **Browse & Discover** - Explore artwork gallery with tag filtering and sorting
- 📤 **Upload & Share** - Share your prompts, models, and AI art with the community
- 👤 **Artist Profiles** - Create portfolio pages showcasing your work
- ❤️ **Like & Save** - Bookmark favorite pieces for later viewing
- 🏷️ **Tagging System** - Organize work by tags (3D, Blender, VFX, Editing, Concept, etc.)
- 🔐 **Authentication** - Google OAuth + Email/Password with Supabase
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

---

## 🏗️ Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript, Tailwind CSS | ✅ Production |
| **Backend** | Next.js API Routes, Supabase | ✅ Production |
| **Database** | PostgreSQL (Supabase) | ✅ Production |
| **Auth** | Supabase Auth (Google OAuth + Email/Password) | ✅ Production |
| **Storage** | Cloudinary CDN | ✅ Production |
| **Hosting** | Vercel (auto-deploy from GitHub) | ✅ Configured |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Git
- [Supabase](https://supabase.com) account (free)
- [Cloudinary](https://cloudinary.com) account (free)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ApexArtist/apex-web.git
   cd apex-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase and Cloudinary credentials

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Required variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
```

---

## 📋 Setup Guide

### 1. Supabase Database

1. Create a [Supabase](https://supabase.com) project
2. In **SQL Editor**, run the `supabase-schema.sql` script
3. Enable **Google OAuth**:
   - Settings → Authentication → Providers → Google
   - Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Configure **Site URL**:
   - Settings → Authentication → URL Configuration
   - Site URL: `https://your-vercel-url.vercel.app`
   - Redirect URLs: `https://your-vercel-url.vercel.app/auth/callback`
5. Copy credentials from **Settings → API**:
   - Project URL
   - `anon public` key
   - `service_role` key (keep secret!)

### 2. Cloudinary Storage

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Create an **Upload Preset**:
   - Go to Settings → Upload → Upload Presets
   - Add preset named `apex_artist_unsigned`
   - Signing mode: Unsigned
   - Folder: `apex-artist`
3. Copy your **Cloud Name** from dashboard

### 3. Deploy to Vercel

1. Push code to GitHub (already done)
2. Go to [Vercel](https://vercel.com)
3. Click **New Project** → Import from GitHub
4. Select `apex-web` repository
5. Add environment variables from step 1 & 2
6. Click **Deploy**

Every push to `main` auto-deploys! 🚀

---

## 📁 Project Structure

```
apex-web/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout
│   ├── gallery/             # Gallery browsing
│   │   ├── page.tsx         # Gallery grid
│   │   └── [id]/            # Post detail
│   ├── upload/              # Upload form (protected)
│   ├── artists/             # Artists directory
│   │   └── [username]/      # Artist profile
│   ├── auth/                # Authentication
│   ├── profile/             # User profile
│   └── api/                 # API routes
├── components/              # Reusable React components
├── lib/                     # Utilities
│   ├── supabase/            # Supabase clients
│   ├── cloudinary.ts        # Image upload helpers
│   └── types.ts             # TypeScript types
├── public/                  # Static assets
├── middleware.ts            # Route protection
└── supabase-schema.sql      # Database schema
```

---

## 🎨 Key Pages

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Homepage | ✅ Live |
| `/gallery` | Browse all artwork | ✅ Live |
| `/gallery/[id]` | View single post | ✅ Live |
| `/upload` | Share new artwork | ✅ Live (Protected) |
| `/artists` | Community directory | ✅ Live |
| `/artists/[username]` | Artist portfolio | ✅ Live |
| `/profile/setup` | Onboarding | ✅ Live |
| `/profile/edit` | Edit profile | ✅ Live |
| `/auth` | Login/Signup | ✅ Live |

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server on port 3000

# Production
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Sync schema (if using migrations)
```

---

## 📦 Database Schema

Key tables:
- **profiles** - User profiles with avatars, bios, social links
- **posts** - Artwork submissions with prompts, models, tags
- **likes** - User likes on posts
- **saves** - User bookmarks/saves
- **auth.users** - Supabase auth users

See `supabase-schema.sql` for complete schema.

---

## 🔐 Security

- ✅ Google OAuth via Supabase
- ✅ Route protection middleware for `/upload`
- ✅ Row-Level Security (RLS) on database tables
- ✅ Environment variables in `.env.local` (never committed)
- ✅ Cloudinary unsigned uploads for safe client-side uploads

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

Have questions? Open an issue on [GitHub Issues](https://github.com/ApexArtist/apex-web/issues)

---

**Made with ❤️ for the 3D/VFX community**
