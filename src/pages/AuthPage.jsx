import { useState }  from 'react'
import LoginPage  from '../auth/LoginPage.jsx'
import VerifyPage from '../auth/VerifyPage.jsx'

export default function AuthPage() {
  const [step,  setStep]  = useState('login')
  const [email, setEmail] = useState('')

  return (
    <div className="auth-page">
      {step === 'login'
        ? <LoginPage  onCodeSent={e => { setEmail(e); setStep('verify') }} />
        : <VerifyPage email={email} onBack={() => setStep('login')} />
      }
    </div>
  )
}
