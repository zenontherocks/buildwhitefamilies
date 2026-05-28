const ALG = { name: 'HMAC', hash: 'SHA-256' }

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function b64urlToStr(s) {
  return atob(s.replace(/-/g, '+').replace(/_/g, '/'))
}

async function importKey(secret) {
  return crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), ALG, false, ['sign', 'verify']
  )
}

export async function signJWT(payload, secret, ttlSeconds = 86400) {
  const now = Math.floor(Date.now() / 1000)
  const enc = new TextEncoder()
  const header  = b64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const body    = b64url(enc.encode(JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds })))
  const input   = `${header}.${body}`
  const key     = await importKey(secret)
  const sigBuf  = await crypto.subtle.sign(ALG, key, enc.encode(input))
  return `${input}.${b64url(sigBuf)}`
}

export async function verifyJWT(token, secret) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('malformed')
  const [h, p, s] = parts
  const key     = await importKey(secret)
  const sigBytes = Uint8Array.from(b64urlToStr(s), c => c.charCodeAt(0))
  const valid   = await crypto.subtle.verify(ALG, key, sigBytes, new TextEncoder().encode(`${h}.${p}`))
  if (!valid) throw new Error('invalid signature')
  const claims  = JSON.parse(b64urlToStr(p))
  if (claims.exp < Math.floor(Date.now() / 1000)) throw new Error('expired')
  return claims
}
