import { json, error } from '../../lib/response.js'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const MAX_BYTES     = 5 * 1024 * 1024

export async function onRequestPost(context) {
  const { request, env, data } = context
  const formData = await request.formData().catch(() => null)
  if (!formData) return error('Multipart form data required')

  const file = formData.get('photo')
  if (!file || typeof file === 'string') return error('No photo file provided')
  if (!ALLOWED_TYPES.includes(file.type))  return error('Unsupported image type')
  if (file.size > MAX_BYTES)               return error('Image must be under 5 MB')

  const ext = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const key = `${data.user.id}-${crypto.randomUUID()}.${ext}`

  await env.PHOTOS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  })

  return json({ key })
}
