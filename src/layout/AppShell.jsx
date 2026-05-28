import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar       from './Navbar.jsx'
import SearchDrawer from '../search/SearchDrawer.jsx'

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (params) => {
    navigate(`/?${params.toString()}`)
    setDrawerOpen(false)
  }

  return (
    <div className="app-shell">
      <Navbar onSearchOpen={() => setDrawerOpen(true)} />
      <main className="app-main">
        <Outlet />
      </main>
      <SearchDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  )
}
