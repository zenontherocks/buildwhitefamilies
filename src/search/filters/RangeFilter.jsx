export default function RangeFilter({ label, unit, value = ['', ''], onChange }) {
  return (
    <div className="filter-group">
      <label className="filter-label">{label}{unit && ` (${unit})`}</label>
      <div className="filter-range">
        <input
          type="number"
          placeholder="Min"
          value={value[0]}
          onChange={e => onChange([e.target.value, value[1]])}
          min={0}
        />
        <span className="filter-range-sep">–</span>
        <input
          type="number"
          placeholder="Max"
          value={value[1]}
          onChange={e => onChange([value[0], e.target.value])}
          min={0}
        />
      </div>
    </div>
  )
}
