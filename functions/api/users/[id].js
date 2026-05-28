import { json, error } from '../../lib/response.js'

export async function onRequestGet(context) {
  const { params, env } = context
  const id = parseInt(params.id)
  if (!id || isNaN(id)) return error('Invalid profile ID')

  const row = await env.DB.prepare(`
    SELECT u.id, u.name, u.gender, u.last_active, u.created_at, u.users_contacted_count,
           up.age_years, up.height_cm, up.weight_kg, up.children_count, up.wants_children,
           up.denomination, up.church_attendance, up.faith_importance,
           up.location_country, up.location_region, up.language_primary,
           up.education, up.occupation, up.smoking, up.drinking, up.diet,
           up.comm_style, up.preferred_initial_contact, up.about_me, up.about_my_match,
           up.photos
    FROM users u JOIN user_profiles up ON up.user_id = u.id
    WHERE u.id = ? AND up.profile_visible = 1 AND u.is_active = 1
  `).bind(id).first()

  if (!row) return error('Profile not found', 404)
  return json(row)
}
