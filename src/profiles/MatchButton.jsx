import { useState, useEffect } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../auth/AuthContext.jsx'

const LABELS = {
  none:      'Request Introduction',
  pending:   'Introduction Requested',
  mutual:    'Introduced',
  withdrawn: 'Request Introduction',
}

export default function MatchButton({ targetId }) {
  const { user }                  = useAuth()
  const [status,  setStatus]      = useState(null)
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!user) return
    api.get('/api/matches')
      .then(data => {
        const req = (data?.results ?? []).find(r => r.target_id === targetId)
        setStatus(req?.status ?? 'none')
      })
      .catch(() => setStatus('none'))
  }, [targetId, user])

  if (!user || status === null) return null

  const handleClick = async () => {
    if (status === 'mutual') return
    setLoading(true)
    try {
      if (status === 'pending') {
        await api.delete(`/api/matches/${targetId}`)
        setStatus('none')
      } else {
        const data = await api.post(`/api/matches/${targetId}`)
        setStatus(data?.status ?? 'pending')
      }
    } catch {
      // leave status unchanged on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={`match-btn match-btn--${status}`}
      onClick={handleClick}
      disabled={loading || status === 'mutual'}
      title={status === 'pending' ? 'Click to withdraw request' : undefined}
    >
      {loading ? '…' : LABELS[status]}
    </button>
  )
}
