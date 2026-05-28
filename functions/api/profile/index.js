import { json, error } from '../../lib/response.js'

const PROFILE_FIELDS = [
  'age_years','height_cm','weight_kg','children_count','wants_children',
  'denomination','church_attendance','faith_importance',
  'location_country','location_region','language_primary','languages_spoken',
  'education','occupation','smoking','drinking','diet',
  'comm_style','preferred_initial_contact','about_me','about_my_match',
  'photos','profile_visible',
]

export async function onRequestGet(context) {
  const { env, data } = context
  const row = await env.DB.prepare(`
    SELECT u.id, u.email, u.name, u.gender, u.created_at, u.last_active, u.users_contacted_count,
           up.age_years, up.height_cm, up.weight_kg, up.children_count, up.wants_children,
           up.denomination, up.church_attendance, up.faith_importance,
           up.location_country, up.location_region, up.language_primary, up.languages_spoken,
           up.education, up.occupation, up.smoking, up.drinking, up.diet,
           up.comm_style, up.preferred_initial_contact, up.about_me, up.about_my_match,
           up.photos, up.profile_visible
    FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id WHERE u.id = ?
  `).bind(data.user.id).first()

  return json(row)
}

export async function onRequestPut(context) {
  const { request, env, data } = context
  const body = await request.json().catch(() => null)
  if (!body) return error('Invalid JSON')

  const { name, gender, ...profileFields } = body

  const userUpdates = []
  const userVals    = []
  if (name !== undefined)   { userUpdates.push('name = ?');   userVals.push(String(name)) }
  if (gender === 'man' || gender === 'woman') { userUpdates.push('gender = ?'); userVals.push(gender) }

  if (userUpdates.length) {
    await env.DB.prepare(`UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`)
      .bind(...userVals, data.user.id).run()
  }

  const updates = Object.entries(profileFields).filter(([k]) => PROFILE_FIELDS.includes(k))

  if (updates.length) {
    const existing = await env.DB.prepare(`SELECT user_id FROM user_profiles WHERE user_id = ?`)
      .bind(data.user.id).first()

    const serialize = (v) => (v !== null && typeof v === 'object') ? JSON.stringify(v) : v

    if (!existing) {
      const cols = ['user_id', ...updates.map(([k]) => k)]
      const vals = [data.user.id, ...updates.map(([, v]) => serialize(v))]
      await env.DB.prepare(
        `INSERT INTO user_profiles (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`
      ).bind(...vals).run()
    } else {
      const set  = updates.map(([k]) => `${k} = ?`).join(', ')
      const vals = [...updates.map(([, v]) => serialize(v)), data.user.id]
      await env.DB.prepare(`UPDATE user_profiles SET ${set} WHERE user_id = ?`).bind(...vals).run()
    }
  }

  await env.DB.prepare(`UPDATE users SET last_active = ? WHERE id = ?`)
    .bind(Math.floor(Date.now() / 1000), data.user.id).run()

  return json({ success: true })
}
