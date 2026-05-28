import { signJWT } from '../../lib/jwt.js'
import { json, error } from '../../lib/response.js'

async function hashCode(code, secret) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(code))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

export async function onRequestPost(context) {
  const { request, env } = context
  const body  = await request.json().catch(() => ({}))
  const email = (body.email || '').toLowerCase().trim()
  const code  = (body.code  || '').trim()

  if (!email || !code) return error('Email and code are required')

  const now = Math.floor(Date.now() / 1000)
  const db  = env.DB

  const row = await db.prepare(
    `SELECT id, code FROM auth_codes WHERE email = ? AND used = 0 AND expires_at > ? ORDER BY id DESC LIMIT 1`
  ).bind(email, now).first()

  if (!row) return error('Code is invalid or has expired', 401)

  const hashed = await hashCode(code, env.JWT_SECRET)
  if (hashed !== row.code) return error('Incorrect code', 401)

  await db.prepare(`UPDATE auth_codes SET used = 1 WHERE id = ?`).bind(row.id).run()

  const user = await db.prepare(
    `SELECT id, email, name, gender FROM users WHERE email = ?`
  ).bind(email).first()

  await db.prepare(`UPDATE users SET last_active = ? WHERE id = ?`).bind(now, user.id).run()

  const token  = await signJWT({ sub: user.id, email: user.email }, env.JWT_SECRET)
  const secure = env.ENVIRONMENT === 'production' ? '; Secure' : ''
  const cookie = `session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${secure}`

  return new Response(JSON.stringify({ success: true, user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
  })
}
