import React from 'react';
import './GlassBadge.css';

export const GlassBadge = ({ children, className = '', ...props }) => (
    <div className={`glass-badge ${className}`} {...props}>
        {children}
    </div>
);

export const NeonBadge = ({ children, color = 'blue', className = '', ...props }) => {
    const colorClass = `neon-badge-${color}`;
    return (
        <div className={`neon-badge ${colorClass} ${className}`} {...props}>
            {children}
        </div>
    );
};

export const GradientBadge = ({ children, gradient = 'blue', className = '', ...props }) => {
    const gradientClass = `gradient-badge-${gradient}`;
    return (
        <div className={`gradient-badge ${gradientClass} ${className}`} {...props}>
            {children}
        </div>
    );
};

export const FrostedBadge = ({ children, className = '', ...props }) => (
    <div className={`frosted-badge ${className}`} {...props}>
        {children}
    </div>
);

export const HolographicBadge = ({ children, className = '', ...props }) => (
    <div className={`holographic-badge ${className}`} {...props}>
        {children}
    </div>
);

export const CrystalBadge = ({ children, className = '', ...props }) => (
    <div className={`crystal-badge ${className}`} {...props}>
        {children}
    </div>
);

export const MetallicBadge = ({ children, className = '', ...props }) => (
    <div className={`metallic-badge ${className}`} {...props}>
        {children}
    </div>
);

export const GoldBadge = ({ children, className = '', ...props }) => (
    <div className={`gold-badge ${className}`} {...props}>
        {children}
    </div>
);
