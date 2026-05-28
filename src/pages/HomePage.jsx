import { useState, useEffect } from 'react'
import { useSearchParams }    from 'react-router-dom'
import ProfileGrid            from '../profiles/ProfileGrid.jsx'
import { api }                from '../lib/api.js'

export default function HomePage() {
  const [searchParams]          = useSearchParams()
  const [profiles, setProfiles] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    const qs = searchParams.toString()
    api.get(`/api/users/search${qs ? `?${qs}` : ''}`)
      .then(data  => setProfiles(data?.results ?? []))
      .catch(()   => setProfiles([]))
      .finally(() => setLoading(false))
  }, [searchParams])

  return (
    <div className="home-page">
      <ProfileGrid profiles={profiles} loading={loading} />
    </div>
  )
}
