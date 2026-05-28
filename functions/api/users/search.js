import { json } from '../../lib/response.js'

export async function onRequestGet(context) {
  const { request, env, data } = context
  const p     = new URL(request.url).searchParams
  const page  = Math.max(0, parseInt(p.get('page') || '0'))
  const limit = 24
  const offset = page * limit

  const conditions = ['up.profile_visible = 1', 'u.is_active = 1']
  const values     = []

  if (data.user) {
    conditions.push('u.id != ?')
    values.push(data.user.id)
  }

  const ranges = [
    ['up.age_years',     p.get('age_min'),      p.get('age_max')],
    ['up.height_cm',     p.get('height_min'),   p.get('height_max')],
    ['up.weight_kg',     p.get('weight_min'),   p.get('weight_max')],
    ['up.children_count',p.get('children_min'), p.get('children_max')],
  ]
  for (const [field, min, max] of ranges) {
    if (min !== null && min !== '') { conditions.push(`${field} >= ?`); values.push(Number(min)) }
    if (max !== null && max !== '') { conditions.push(`${field} <= ?`); values.push(Number(max)) }
  }

  const cats = [
    ['u.gender',           p.get('gender')],
    ['up.denomination',    p.get('denomination')],
    ['up.wants_children',  p.get('wants_children')],
    ['up.faith_importance',p.get('faith_importance')],
    ['up.church_attendance',p.get('church_attendance')],
    ['up.location_country',p.get('location_country')],
    ['up.language_primary',p.get('language')],
    ['up.smoking',         p.get('smoking')],
    ['up.drinking',        p.get('drinking')],
    ['up.comm_style',      p.get('comm_style')],
  ]
  for (const [field, val] of cats) {
    if (val) { conditions.push(`${field} = ?`); values.push(val) }
  }

  const sql = `
    SELECT u.id, u.name, u.gender, u.last_active, u.created_at, u.users_contacted_count,
           up.age_years, up.denomination, up.faith_importance,
           up.location_country, up.location_region, up.comm_style,
           up.preferred_initial_contact, up.about_me, up.photos, up.wants_children
    FROM users u JOIN user_profiles up ON up.user_id = u.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY u.last_active DESC LIMIT ? OFFSET ?
  `

  const rows = await env.DB.prepare(sql).bind(...values, limit, offset).all()
  return json({ results: rows.results ?? [], page, limit })
}
