import { Link } from 'react-router-dom'
import { relativeTime, parseJSON } from '../lib/utils.js'

export default function ProfileCard({ profile }) {
  const photos = parseJSON(profile.photos)
  const photo  = photos[0]

  return (
    <Link to={`/profile/${profile.id}`} className="profile-card">
      <div className="profile-card-photo">
        {photo
          ? <img src={`/api/photos/${photo}`} alt={profile.name} loading="lazy" />
          : <div className="photo-placeholder" />
        }
      </div>
      <div className="profile-card-body">
        <div className="profile-card-name">{profile.name}</div>
        <div className="profile-card-meta">
          {profile.denomination && <span>{profile.denomination}</span>}
          {profile.location_region && <span>{profile.location_region}</span>}
        </div>
        <div className="profile-card-active">{relativeTime(profile.last_active)}</div>
      </div>
    </Link>
  )
}
