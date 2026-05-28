export async function onRequestGet(context) {
  const { params, env } = context
  const obj = await env.PHOTOS.get(params.key)
  if (!obj) return new Response('Not found', { status: 404 })

  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=2592000, immutable',
    },
  })
}
