import React from 'react'
import GlitchVault from '../GlitchVault/GlitchVault'
import './ProjectCard.css'

const ProjectCard = ({
  title = 'Project Launch',
  status = 'Ready to deploy',
  description = 'Your application is ready for production deployment with all tests passing.',
  icon = '🚀',
  iconGradient = 'from-red-400 to-pink-500',
  glitchColor = '#FF6B6B',
  primaryButtonText = 'Deploy Now',
  secondaryButtonText = 'View Details',
  onPrimaryClick,
  onSecondaryClick,
  className = ''
}) => {
  return (
    <GlitchVault
      className={`project-card-wrapper ${className}`}
      glitchColor={glitchColor}
      glitchRadius={80}
    >
      <div className="project-card-content">
        <div className="project-card-header">
          <div className={`project-card-icon ${iconGradient}`}>
            <span className="project-card-icon-text">{icon}</span>
          </div>
          <div className="project-card-title-section">
            <h3 className="project-card-title">{title}</h3>
            <p className="project-card-status">{status}</p>
          </div>
        </div>
        <p className="project-card-description">{description}</p>
        <div className="project-card-actions">
          <button
            className="project-card-button-primary"
            onClick={onPrimaryClick}
          >
            {primaryButtonText}
          </button>
          <button
            className="project-card-button-secondary"
            onClick={onSecondaryClick}
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </GlitchVault>
  )
}

export default ProjectCard

