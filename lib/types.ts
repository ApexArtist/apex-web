// lib/types.ts

export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  website: string | null
  youtube_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  location: string | null
  created_at: string
  post_count?: number
  follower_count?: number
}

export interface Post {
  id: string
  user_id: string
  title: string
  prompt: string
  negative_prompt: string | null
  image_url: string
  model: string | null
  tags: string[]
  likes_count: number
  saves_count: number
  created_at: string
  profile?: Profile
  user_liked?: boolean
  user_saved?: boolean
}

export interface Tag {
  id: string
  name: string
  slug: string
  post_count: number
}
