import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import AppShell        from './layout/AppShell.jsx'
import HomePage        from './pages/HomePage.jsx'
import AuthPage        from './pages/AuthPage.jsx'
import ProfilePage     from './pages/ProfilePage.jsx'
import EditProfilePage from './pages/EditProfilePage.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user)   return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="/profile/edit" element={
              <ProtectedRoute><EditProfilePage /></ProtectedRoute>
            } />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
