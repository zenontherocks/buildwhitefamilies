import { useState, useEffect } from 'react'
import { api }                from '../lib/api.js'
import { parseJSON }          from '../lib/utils.js'
import {
  DENOMINATIONS, FAITH_IMPORTANCE, CHURCH_ATTENDANCE,
  WANTS_CHILDREN, SMOKING, DRINKING, COMM_STYLES, CONTACT_METHODS,
} from '../lib/constants.js'

function Field({ label, children }) {
  return (
    <label className="edit-field">
      <span className="edit-field-label">{label}</span>
      {children}
    </label>
  )
}

export default function EditProfilePage() {
  const [form,   setForm]   = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg,    setMsg]    = useState(null)

  useEffect(() => {
    api.get('/api/profile').then(setForm)
  }, [])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const setVal = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      await api.put('/api/profile', form)
      setMsg({ type: 'success', text: 'Profile saved.' })
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <div className="page-state">Loading your profile…</div>

  const contactVal = parseJSON(form.preferred_initial_contact)

  return (
    <div className="edit-page">
      <h1>Edit Profile</h1>
      <form onSubmit={save} className="edit-form">

        <section className="edit-section">
          <h2>Identity</h2>
          <Field label="Display Name">
            <input value={form.name || ''} onChange={set('name')} placeholder="Your name" />
          </Field>
          <Field label="Gender">
            <select value={form.gender || 'man'} onChange={set('gender')}>
              <option value="man">Man</option>
              <option value="woman">Woman</option>
            </select>
          </Field>
        </section>

        <section className="edit-section">
          <h2>Faith</h2>
          <Field label="Denomination">
            <select value={form.denomination || ''} onChange={set('denomination')}>
              <option value="">Select…</option>
              {DENOMINATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Faith Importance">
            <select value={form.faith_importance || ''} onChange={set('faith_importance')}>
              <option value="">Select…</option>
              {FAITH_IMPORTANCE.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Church Attendance">
            <select value={form.church_attendance || ''} onChange={set('church_attendance')}>
              <option value="">Select…</option>
              {CHURCH_ATTENDANCE.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
        </section>

        <section className="edit-section">
          <h2>Physical</h2>
          <Field label="Age">
            <input type="number" min={18} max={99} value={form.age_years || ''} onChange={set('age_years')} />
          </Field>
          <Field label="Height (cm)">
            <input type="number" min={100} max={250} value={form.height_cm || ''} onChange={set('height_cm')} />
          </Field>
          <Field label="Weight (kg)">
            <input type="number" min={30} max={300} value={form.weight_kg || ''} onChange={set('weight_kg')} />
          </Field>
        </section>

        <section className="edit-section">
          <h2>Family</h2>
          <Field label="Existing Children">
            <select value={form.children_count ?? ''} onChange={set('children_count')}>
              <option value="">Select…</option>
              {[0,1,2,3,4].map(n => <option key={n} value={n}>{n === 4 ? '4+' : n}</option>)}
            </select>
          </Field>
          <Field label="Wants Children">
            <select value={form.wants_children || ''} onChange={set('wants_children')}>
              <option value="">Select…</option>
              {WANTS_CHILDREN.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
        </section>

        <section className="edit-section">
          <h2>Location & Language</h2>
          <Field label="Country">
            <input value={form.location_country || ''} onChange={set('location_country')} placeholder="e.g. United States" />
          </Field>
          <Field label="Region / State">
            <input value={form.location_region || ''} onChange={set('location_region')} placeholder="e.g. Texas" />
          </Field>
          <Field label="Primary Language">
            <input value={form.language_primary || ''} onChange={set('language_primary')} placeholder="e.g. English" />
          </Field>
        </section>

        <section className="edit-section">
          <h2>Habits</h2>
          <Field label="Smoking">
            <select value={form.smoking || ''} onChange={set('smoking')}>
              <option value="">Select…</option>
              {SMOKING.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Drinking">
            <select value={form.drinking || ''} onChange={set('drinking')}>
              <option value="">Select…</option>
              {DRINKING.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Diet">
            <input value={form.diet || ''} onChange={set('diet')} placeholder="e.g. omnivore, vegetarian" />
          </Field>
        </section>

        <section className="edit-section">
          <h2>Communication</h2>
          <Field label="Style">
            <select value={form.comm_style || ''} onChange={set('comm_style')}>
              <option value="">Select…</option>
              {COMM_STYLES.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <div className="edit-field">
            <span className="edit-field-label">Preferred First Contact</span>
            <div className="checkbox-group">
              {CONTACT_METHODS.map(method => (
                <label key={method} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={contactVal.includes(method)}
                    onChange={e => {
                      const next = e.target.checked
                        ? [...contactVal, method]
                        : contactVal.filter(m => m !== method)
                      setVal('preferred_initial_contact', JSON.stringify(next))
                    }}
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="edit-section">
          <h2>Background</h2>
          <Field label="Education">
            <input value={form.education || ''} onChange={set('education')} />
          </Field>
          <Field label="Occupation">
            <input value={form.occupation || ''} onChange={set('occupation')} />
          </Field>
        </section>

        <section className="edit-section">
          <h2>About</h2>
          <Field label="About Me">
            <textarea rows={5} value={form.about_me || ''} onChange={set('about_me')}
              placeholder="Share something about yourself…" />
          </Field>
          <Field label="About My Match">
            <textarea rows={5} value={form.about_my_match || ''} onChange={set('about_my_match')}
              placeholder="Describe who you're looking for…" />
          </Field>
        </section>

        {msg && <p className={msg.type === 'success' ? 'form-success' : 'form-error'}>{msg.text}</p>}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
