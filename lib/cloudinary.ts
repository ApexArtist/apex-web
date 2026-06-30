// lib/cloudinary.ts

export async function uploadToCloudinary(
  file: File,
  folder: 'posts' | 'avatars' | 'banners'
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', `apex-artist/${folder}`)

  if (folder === 'posts') {
    formData.append('transformation', JSON.stringify([
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }
    ]))
  } else if (folder === 'avatars') {
    formData.append('transformation', JSON.stringify([
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }
    ]))
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url
}
