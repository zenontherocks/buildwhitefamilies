import { json } from '../../lib/response.js'

export async function onRequestGet(context) {
  const { env, data } = context
  const rows = await env.DB.prepare(`
    SELECT mr.id, mr.target_id, mr.status, mr.created_at,
           u.name, u.gender, up.denomination, up.photos
    FROM match_requests mr
    JOIN users u ON u.id = mr.target_id
    LEFT JOIN user_profiles up ON up.user_id = mr.target_id
    WHERE mr.requester_id = ?
    ORDER BY mr.created_at DESC
  `).bind(data.user.id).all()

  return json({ results: rows.results ?? [] })
}
