export async function sendEmail(env, { to, cc, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, cc, subject, html }),
  })
  if (!res.ok) throw new Error(`Email failed: ${await res.text()}`)
  return res.json()
}
