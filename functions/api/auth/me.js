import { json } from '../../lib/response.js'

export async function onRequestGet(context) {
  const { env, data } = context
  if (!data.user) return json(null)

  const user = await env.DB.prepare(
    `SELECT id, email, name, gender, created_at, last_active, users_contacted_count FROM users WHERE id = ?`
  ).bind(data.user.id).first()

  return json(user ?? null)
}
