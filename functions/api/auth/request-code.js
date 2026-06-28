import { sendEmail } from '../../lib/email.js'
import { json, error } from '../../lib/response.js'

function generateCode() {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return String(buf[0] % 1000000).padStart(6, '0')
}

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

  // Surface missing bindings immediately instead of a cryptic 500
  if (!env.DB)             return error('Server misconfiguration: DB binding missing', 500)
  if (!env.JWT_SECRET)     return error('Server misconfiguration: JWT_SECRET not set', 500)
  if (!env.RESEND_API_KEY) return error('Server misconfiguration: RESEND_API_KEY not set', 500)
  if (!env.EMAIL_FROM)     return error('Server misconfiguration: EMAIL_FROM not set', 500)

  const body  = await request.json().catch(() => ({}))
  const email = (body.email || '').toLowerCase().trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return error('Valid email address required')
  }

  try {
    const db  = env.DB
    const now = Math.floor(Date.now() / 1000)

    await db.prepare(`INSERT OR IGNORE INTO users (email) VALUES (?)`).bind(email).run()
    await db.prepare(`UPDATE auth_codes SET used = 1 WHERE email = ? AND used = 0`).bind(email).run()

    const code    = generateCode()
    const hashed  = await hashCode(code, env.JWT_SECRET)
    const expires = now + 600

    await db.prepare(`INSERT INTO auth_codes (email, code, expires_at) VALUES (?, ?, ?)`)
      .bind(email, hashed, expires).run()

    await sendEmail(env, {
      to: email,
      subject: 'Your sign-in code',
      html: `<p style="font-family:Georgia,serif;font-size:1.1rem">Your verification code is:</p>
             <p style="font-size:2rem;font-weight:bold;letter-spacing:0.2em">${code}</p>
             <p style="color:#666">Valid for 10 minutes. Do not share this code.</p>`,
    })

    return json({ success: true })
  } catch (e) {
    console.error('request-code error:', e)
    return error(`Failed to send code: ${e.message}`, 500)
  }
}
