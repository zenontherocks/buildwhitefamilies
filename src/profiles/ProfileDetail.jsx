import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import { api }                 from '../lib/api.js'
import { relativeTime, parseJSON } from '../lib/utils.js'
import MatchButton             from './MatchButton.jsx'

function Row({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  )
}

export default function ProfileDetail() {
  const { id }              = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/users/${id}`)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)  return <div className="page-state">Loading profile…</div>
  if (!profile) return <div className="page-state">Profile not found or no longer visible.</div>

  const photos  = parseJSON(profile.photos)
  const contact = parseJSON(profile.preferred_initial_contact)
  const since   = new Date(profile.created_at * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="profile-detail">
      {photos.length > 0 && (
        <div className="detail-photos">
          {photos.map((key, i) => (
            <img key={i} src={`/api/photos/${key}`} alt={`${profile.name} photo ${i + 1}`} />
          ))}
        </div>
      )}

      <div className="detail-content">
        <div className="detail-header">
          <h1>{profile.name}{profile.age_years ? `, ${profile.age_years}` : ''}</h1>
          <MatchButton targetId={Number(id)} />
        </div>

        <div className="transparency-bar">
          <span>{relativeTime(profile.last_active)}</span>
          <span>Member since {since}</span>
          <span>{profile.users_contacted_count} introduction{profile.users_contacted_count !== 1 ? 's' : ''} initiated</span>
          {contact.length > 0 && <span>Prefers: {contact.join(', ')}</span>}
        </div>

        {profile.about_me && (
          <section className="detail-section">
            <h2>About</h2>
            <p>{profile.about_me}</p>
          </section>
        )}

        {profile.about_my_match && (
          <section className="detail-section">
            <h2>About My Match</h2>
            <p>{profile.about_my_match}</p>
          </section>
        )}

        <section className="detail-section">
          <h2>Faith</h2>
          <dl>
            <Row label="Denomination"      value={profile.denomination} />
            <Row label="Faith importance"  value={profile.faith_importance} />
            <Row label="Church attendance" value={profile.church_attendance} />
          </dl>
        </section>

        <section className="detail-section">
          <h2>Family</h2>
          <dl>
            <Row label="Existing children" value={profile.children_count === 4 ? '4+' : profile.children_count} />
            <Row label="Wants children"    value={profile.wants_children} />
          </dl>
        </section>

        <section className="detail-section">
          <h2>Background</h2>
          <dl>
            <Row label="Location"   value={[profile.location_region, profile.location_country].filter(Boolean).join(', ')} />
            <Row label="Language"   value={profile.language_primary} />
            <Row label="Education"  value={profile.education} />
            <Row label="Occupation" value={profile.occupation} />
          </dl>
        </section>

        <section className="detail-section">
          <h2>Lifestyle</h2>
          <dl>
            <Row label="Smoking"               value={profile.smoking} />
            <Row label="Drinking"              value={profile.drinking} />
            <Row label="Diet"                  value={profile.diet} />
            <Row label="Communication style"   value={profile.comm_style} />
          </dl>
        </section>
      </div>
    </div>
  )
}
