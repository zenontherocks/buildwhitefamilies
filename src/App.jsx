export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: "'Georgia', serif",
      color: '#fff',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-1px' }}>
        Build White Families
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#a0b4c8', maxWidth: '480px', lineHeight: '1.7' }}>
        A dating site for people who want to build a family. Coming soon.
      </p>
      <div style={{
        marginTop: '2.5rem',
        padding: '0.75rem 1.5rem',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '999px',
        fontSize: '0.9rem',
        color: '#a0b4c8',
      }}>
        Currently in development
      </div>
    </div>
  )
}
