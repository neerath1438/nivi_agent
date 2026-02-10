import './Loader.css'

const Loader = ({ size = 'medium', fullScreen = false, className = '' }) => {
  const sizeClass = `loader-${size}`
  
  if (fullScreen) {
    return (
      <div className={`loader-fullscreen ${className}`}>
        <div className={`loader ${sizeClass}`}></div>
      </div>
    )
  }

  return <div className={`loader ${sizeClass} ${className}`}></div>
}

export default Loader

