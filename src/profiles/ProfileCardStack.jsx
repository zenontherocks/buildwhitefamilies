import { Link } from 'react-router-dom'
import { relativeTime, parseJSON } from '../lib/utils.js'

export default function ProfileCardStack({ profile }) {
  const photos = parseJSON(profile.photos)
  const photo  = photos[0]

  return (
    <Link to={`/profile/${profile.id}`} className="profile-card-stack">
      <div className="stack-photo">
        {photo
          ? <img src={`/api/photos/${photo}`} alt={profile.name} loading="lazy" />
          : <div className="photo-placeholder" />
        }
      </div>
      <div className="stack-body">
        <div className="stack-name">{profile.name}{profile.age_years ? `, ${profile.age_years}` : ''}</div>
        {profile.location_region && <div className="stack-sub">{profile.location_region}</div>}
        {profile.denomination    && <div className="stack-sub">{profile.denomination} · {profile.faith_importance}</div>}
        {profile.about_me        && (
          <div className="stack-excerpt">
            {profile.about_me.length > 130 ? profile.about_me.slice(0, 130) + '…' : profile.about_me}
          </div>
        )}
        <div className="stack-active">{relativeTime(profile.last_active)}</div>
      </div>
    </Link>
  )
}
