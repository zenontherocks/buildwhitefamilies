import { json, error } from '../../lib/response.js'
import { sendEmail } from '../../lib/email.js'

function parseContact(val) {
  if (!val) return 'not specified'
  try { return JSON.parse(val).join(', ') } catch { return val }
}

export async function onRequestPost(context) {
  const { params, env, data } = context
  const myId     = data.user.id
  const targetId = parseInt(params.targetId)

  if (!targetId || isNaN(targetId) || targetId === myId) {
    return error('Invalid target')
  }

  const target = await env.DB.prepare(`
    SELECT u.id, u.email, u.name, up.preferred_initial_contact
    FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id WHERE u.id = ?
  `).bind(targetId).first()

  if (!target) return error('User not found', 404)

  await env.DB.prepare(
    `INSERT OR IGNORE INTO match_requests (requester_id, target_id) VALUES (?, ?)`
  ).bind(myId, targetId).run()

  const mirror = await env.DB.prepare(
    `SELECT id FROM match_requests WHERE requester_id = ? AND target_id = ? AND status = 'pending'`
  ).bind(targetId, myId).first()

  if (!mirror) return json({ status: 'pending' })

  // Mutual match — commit atomically
  const now = Math.floor(Date.now() / 1000)
  await env.DB.batch([
    env.DB.prepare(
      `UPDATE match_requests SET status = 'mutual'
       WHERE (requester_id = ? AND target_id = ?) OR (requester_id = ? AND target_id = ?)`
    ).bind(myId, targetId, targetId, myId),
    env.DB.prepare(
      `UPDATE users SET users_contacted_count = users_contacted_count + 1 WHERE id IN (?, ?)`
    ).bind(myId, targetId),
    env.DB.prepare(`UPDATE users SET last_active = ? WHERE id IN (?, ?)`)
      .bind(now, myId, targetId),
  ])

  const me = await env.DB.prepare(`
    SELECT u.name, u.email, up.preferred_initial_contact
    FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id WHERE u.id = ?
  `).bind(myId).first()

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:2rem">
      <h2 style="color:#2c4a3e">You've been mutually introduced</h2>
      <p>You and <strong>${target.name}</strong> have both expressed interest in connecting.
         The details below are shared with both parties.</p>

      <table style="width:100%;border-collapse:collapse;margin:1.5rem 0">
        <tr style="background:#f5f2ef">
          <td style="padding:0.75rem;font-weight:bold">${me.name}</td>
          <td style="padding:0.75rem;color:#555">Preferred contact: ${parseContact(me.preferred_initial_contact)}</td>
        </tr>
        <tr>
          <td style="padding:0.75rem;font-weight:bold">${target.name}</td>
          <td style="padding:0.75rem;color:#555">Preferred contact: ${parseContact(target.preferred_initial_contact)}</td>
        </tr>
      </table>

      <h3 style="color:#2c4a3e;font-size:1rem">A note on safety</h3>
      <p style="color:#555;font-size:0.95rem">Take your time. Verify identity before sharing personal details.
         Consider a video call before meeting in person. Trust your instincts.</p>

      <h3 style="color:#2c4a3e;font-size:1rem">Getting started</h3>
      <p style="color:#555;font-size:0.95rem">A brief, warm introduction referencing shared values or faith makes
         the best first impression. There is no rush.</p>
    </div>
  `

  await sendEmail(env, {
    to: me.email,
    cc: target.email,
    subject: `Introduction: ${me.name} & ${target.name}`,
    html,
  })

  return json({ status: 'mutual' })
}

export async function onRequestDelete(context) {
  const { params, env, data } = context
  const targetId = parseInt(params.targetId)

  await env.DB.prepare(
    `UPDATE match_requests SET status = 'withdrawn'
     WHERE requester_id = ? AND target_id = ? AND status = 'pending'`
  ).bind(data.user.id, targetId).run()

  return json({ success: true })
}
