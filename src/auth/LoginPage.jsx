import { useState } from 'react'
import { api } from '../lib/api.js'

export default function LoginPage({ onCodeSent }) {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      await api.post('/api/auth/request-code', { email })
      onCodeSent(email)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <h2>Sign In</h2>
      <p>Enter your email address to receive a verification code.</p>
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
        />
        {err && <p className="form-error">{err}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending…' : 'Send Code'}
        </button>
      </form>
    </div>
  )
}
