import React from 'react'
import GlitchVault from '../GlitchVault/GlitchVault'
import './ProfileCard.css'

const ProfileCard = ({
  name = 'Aura',
  title = 'UI/UX Designer & Developer',
  avatarText = 'Hover me',
  buttonText = 'View Profile',
  glitchColor = '#0AF0F0',
  className = '',
  onButtonClick,
  ...props
}) => {
  return (
    <main className={`profile-card-wrapper ${className}`} {...props}>
      <div className="profile-card-background"></div>
      <GlitchVault
        className="profile-card-container"
        glitchColor={glitchColor}
        glitchRadius={120}
      >
        <div className="profile-card-content">
          <div className="profile-card-gradient-overlay"></div>

          {/* Avatar */}
          <div className="profile-card-avatar-wrapper">
            <div className="profile-card-avatar-outer">
              <div className="profile-card-avatar-inner">
                <span className="profile-card-avatar-text">{avatarText}</span>
              </div>
            </div>
          </div>

          {/* Name */}
          <h2 className="profile-card-name">{name}</h2>

          {/* Title */}
          <p className="profile-card-title">{title}</p>

          {/* Button */}
          <button
            className="profile-card-button"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </GlitchVault>
    </main>
  )
}

export default ProfileCard

