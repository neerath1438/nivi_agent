import React from 'react';
import './Background.css';

const PurpleGlowBackground = ({ children, className = "" }) => {
    return (
        <div className={`background-container ${className}`}>
            <div className="purple-glow-wrapper" />
            <div className="background-content">
                {children}
            </div>
        </div>
    );
};

export default PurpleGlowBackground;
