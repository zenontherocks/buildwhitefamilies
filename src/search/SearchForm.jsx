import { useState } from 'react'
import RangeFilter    from './filters/RangeFilter.jsx'
import CategoryFilter from './filters/CategoryFilter.jsx'
import {
  DENOMINATIONS, FAITH_IMPORTANCE, CHURCH_ATTENDANCE,
  WANTS_CHILDREN, SMOKING, DRINKING, COMM_STYLES, GENDERS,
} from '../lib/constants.js'

const EMPTY = {
  gender: null,
  age: ['', ''], height: ['', ''], weight: ['', ''], children: ['', ''],
  denomination: null, faith_importance: null, church_attendance: null,
  wants_children: null, location_country: null, language: null,
  smoking: null, drinking: null, comm_style: null,
}

export default function SearchForm({ onSearch }) {
  const [f, setF] = useState(EMPTY)
  const set = (key) => (val) => setF(prev => ({ ...prev, [key]: val }))

  const buildParams = () => {
    const p = new URLSearchParams()
    if (f.gender)           p.set('gender',           f.gender)
    if (f.age[0])           p.set('age_min',           f.age[0])
    if (f.age[1])           p.set('age_max',           f.age[1])
    if (f.height[0])        p.set('height_min',        f.height[0])
    if (f.height[1])        p.set('height_max',        f.height[1])
    if (f.weight[0])        p.set('weight_min',        f.weight[0])
    if (f.weight[1])        p.set('weight_max',        f.weight[1])
    if (f.children[0])      p.set('children_min',      f.children[0])
    if (f.children[1])      p.set('children_max',      f.children[1])
    if (f.denomination)     p.set('denomination',      f.denomination)
    if (f.faith_importance) p.set('faith_importance',  f.faith_importance)
    if (f.church_attendance)p.set('church_attendance', f.church_attendance)
    if (f.wants_children)   p.set('wants_children',    f.wants_children)
    if (f.location_country) p.set('location_country',  f.location_country)
    if (f.language)         p.set('language',          f.language)
    if (f.smoking)          p.set('smoking',           f.smoking)
    if (f.drinking)         p.set('drinking',          f.drinking)
    if (f.comm_style)       p.set('comm_style',        f.comm_style)
    return p
  }

  return (
    <div className="search-form">
      <CategoryFilter label="Seeking"           options={GENDERS}           value={f.gender}           onChange={set('gender')} />
      <RangeFilter    label="Age"               unit="years"                value={f.age}              onChange={set('age')} />
      <RangeFilter    label="Height"            unit="cm"                   value={f.height}           onChange={set('height')} />
      <RangeFilter    label="Weight"            unit="kg"                   value={f.weight}           onChange={set('weight')} />
      <RangeFilter    label="Existing Children"                             value={f.children}         onChange={set('children')} />
      <CategoryFilter label="Wants Children"    options={WANTS_CHILDREN}    value={f.wants_children}   onChange={set('wants_children')} />
      <CategoryFilter label="Denomination"      options={DENOMINATIONS}     value={f.denomination}     onChange={set('denomination')} />
      <CategoryFilter label="Faith Importance"  options={FAITH_IMPORTANCE}  value={f.faith_importance} onChange={set('faith_importance')} />
      <CategoryFilter label="Church Attendance" options={CHURCH_ATTENDANCE} value={f.church_attendance}onChange={set('church_attendance')} />
      <CategoryFilter label="Smoking"           options={SMOKING}           value={f.smoking}          onChange={set('smoking')} />
      <CategoryFilter label="Drinking"          options={DRINKING}          value={f.drinking}         onChange={set('drinking')} />
      <CategoryFilter label="Communication"     options={COMM_STYLES}       value={f.comm_style}       onChange={set('comm_style')} />

      <div className="filter-group">
        <label className="filter-label">Location (Country)</label>
        <input type="text" placeholder="e.g. United States" value={f.location_country ?? ''}
          onChange={e => set('location_country')(e.target.value || null)} />
      </div>
      <div className="filter-group">
        <label className="filter-label">Language</label>
        <input type="text" placeholder="e.g. English" value={f.language ?? ''}
          onChange={e => set('language')(e.target.value || null)} />
      </div>

      <div className="search-form-actions">
        <button className="btn-primary"    onClick={() => onSearch(buildParams())}>Search</button>
        <button className="btn-secondary"  onClick={() => { setF(EMPTY); onSearch(new URLSearchParams()) }}>Reset</button>
      </div>
    </div>
  )
}
