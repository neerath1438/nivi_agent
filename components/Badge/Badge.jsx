import React from 'react';
import './Badge.css';

const Badge = ({
    children,
    className = '',
    onDismiss,
    onClick,
    href,
    iconLeft,
    iconRight,
    ...props
}) => {
    const baseClass = 'wui-gem';
    const combinedClass = `${baseClass} ${className}`.trim();

    if (href) {
        return (
            <a href={href} className={combinedClass} {...props}>
                {iconLeft && <span className="wui-gem-left">{iconLeft}</span>}
                {children}
                {iconRight && <span className="wui-gem-right">{iconRight}</span>}
            </a>
        );
    }

    if (onClick) {
        return (
            <button onClick={onClick} className={combinedClass} {...props}>
                {iconLeft && <span className="wui-gem-left">{iconLeft}</span>}
                {children}
                {iconRight && <span className="wui-gem-right">{iconRight}</span>}
            </button>
        );
    }

    return (
        <span className={combinedClass} {...props}>
            {iconLeft && <span className="wui-gem-left">{iconLeft}</span>}
            {children}
            {iconRight && <span className="wui-gem-right">{iconRight}</span>}
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="wui-gem-exit"
                    aria-label="Dismiss"
                >
                    ×
                </button>
            )}
        </span>
    );
};

export default Badge;
