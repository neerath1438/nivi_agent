import './Card.css'

const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`wui-frame ${className}`}>
      {title && <h3 className="wui-frame-crown">{title}</h3>}
      <div className="wui-frame-core">
        {children}
      </div>
    </div>
  )
}

export default Card

