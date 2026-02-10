import './Checkbox.css'

const Checkbox = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`wui-mark-field ${className} ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="wui-mark"
        {...props}
      />
      <span className="wui-mark-gem"></span>
      {label && <span className="wui-mark-voice">{label}</span>}
    </label>
  )
}

export default Checkbox

