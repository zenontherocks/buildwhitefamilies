export default function CategoryFilter({ label, options, value, onChange }) {
  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <select value={value ?? ''} onChange={e => onChange(e.target.value || null)}>
        <option value="">Any</option>
        {options.map(opt => {
          const val  = typeof opt === 'string' ? opt : opt.value
          const text = typeof opt === 'string' ? opt : opt.label
          return <option key={val} value={val}>{text}</option>
        })}
      </select>
    </div>
  )
}
