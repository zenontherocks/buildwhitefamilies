import { verifyJWT } from './lib/jwt.js'

// Routes that are publicly accessible (user context attached if cookie present)
const PUBLIC_PREFIXES = ['/api/auth/', '/api/users/', '/api/photos/']

export async function onRequest(context) {
  const { request, next, env } = context
  const path = new URL(request.url).pathname

  if (!path.startsWith('/api/')) return next()

  const isPublic = PUBLIC_PREFIXES.some(p => path.startsWith(p))
  const cookie   = request.headers.get('Cookie') || ''
  const match    = cookie.match(/(?:^|;\s*)session=([^;]+)/)

  if (match) {
    try {
      const claims = await verifyJWT(match[1], env.JWT_SECRET)
      context.data.user = { id: claims.sub, email: claims.email }
    } catch {
      // invalid cookie — treat as unauthenticated
    }
  }

  if (!isPublic && !context.data.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return next()
}
