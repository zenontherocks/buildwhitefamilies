import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Navbar({ onSearchOpen }) {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">HeritageConnect</Link>
      <div className="navbar-actions">
        <button className="btn-secondary" onClick={onSearchOpen}>Search</button>
        {user ? (
          <>
            <Link to="/profile/edit" className="navbar-link">My Profile</Link>
            <button className="navbar-link" onClick={logout}>Sign Out</button>
          </>
        ) : (
          <Link to="/auth" className="btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  )
}
