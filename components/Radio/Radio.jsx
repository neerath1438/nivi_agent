import './Radio.css'

const Radio = ({
  label,
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`wui-choice-field ${className} ${disabled ? 'disabled' : ''}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="wui-choice"
        {...props}
      />
      <span className="wui-choice-gem"></span>
      {label && <span className="wui-choice-voice">{label}</span>}
    </label>
  )
}

export default Radio

