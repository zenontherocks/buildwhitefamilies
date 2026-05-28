import { useState, useEffect } from 'react'
import ProfileCard      from './ProfileCard.jsx'
import ProfileCardStack from './ProfileCardStack.jsx'

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => window.innerWidth >= 640)
  useEffect(() => {
    const handler = () => setDesktop(window.innerWidth >= 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return desktop
}

export default function ProfileGrid({ profiles, loading }) {
  const isDesktop = useIsDesktop()

  if (loading)          return <div className="grid-state">Loading profiles…</div>
  if (!profiles.length) return <div className="grid-state">No profiles match your search. Try adjusting the filters.</div>

  return isDesktop ? (
    <div className="profile-grid">
      {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
    </div>
  ) : (
    <div className="profile-stack">
      {profiles.map(p => <ProfileCardStack key={p.id} profile={p} />)}
    </div>
  )
}
