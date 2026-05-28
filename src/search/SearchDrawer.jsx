import { useEffect } from 'react'
import SearchForm from './SearchForm.jsx'

export default function SearchDrawer({ open, onClose, onSearch }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />}
      <aside className={`search-drawer${open ? ' open' : ''}`} aria-label="Advanced search" aria-hidden={!open}>
        <div className="drawer-header">
          <h2>Advanced Search</h2>
          <button className="drawer-close" onClick={onClose} aria-label="Close search">×</button>
        </div>
        <SearchForm onSearch={onSearch} />
      </aside>
    </>
  )
}
