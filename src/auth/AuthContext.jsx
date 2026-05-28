import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(undefined) // undefined = loading
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/auth/me')
      .then(data  => setUser(data))
      .catch(()   => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await api.post('/api/auth/logout').catch(() => {})
    setUser(null)
    window.location.href = '/auth'
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
