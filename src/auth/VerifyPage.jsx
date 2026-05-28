import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

export default function VerifyPage({ email, onBack }) {
  const [code,    setCode]    = useState('')
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState('')
  const { setUser } = useAuth()
  const navigate    = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const data = await api.post('/api/auth/verify-code', { email, code })
      setUser(data.user)
      navigate('/')
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <h2>Enter Your Code</h2>
      <p>We sent a 6-digit code to <strong>{email}</strong>.</p>
      <form onSubmit={submit}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          placeholder="000000"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
          required
          autoFocus
        />
        {err && <p className="form-error">{err}</p>}
        <button type="submit" className="btn-primary" disabled={loading || code.length < 6}>
          {loading ? 'Verifying…' : 'Verify & Sign In'}
        </button>
        <button type="button" className="btn-ghost" onClick={onBack}>
          Use a different email
        </button>
      </form>
    </div>
  )
}
