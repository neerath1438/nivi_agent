import React, { useEffect, useState } from "react";

const variants = {
    blue: {
        dark: {
            outerGlow: "rgba(59, 130, 246, 0.4)",
            blobGlow: "rgba(59, 130, 246, 0.6)",
            blobHighlight: "#60a5fa",
            blobShadow: "rgba(59, 130, 246, 0.25)",
            innerGlow: "rgba(59, 130, 246, 0.1)",
            innerHighlight: "rgba(147, 197, 253, 0.15)",
            outerBg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            innerBg: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
            textColor: "#1e293b",
        },
    },
    pink: {
        dark: {
            outerGlow: "rgba(255, 230, 255, 0.4)",
            blobGlow: "rgba(255, 0, 150, 0.5)",
            blobHighlight: "#ff66cc",
            blobShadow: "rgba(255, 0, 150, 0.18)",
            innerGlow: "rgba(255, 0, 150, 0.07)",
            innerHighlight: "rgba(255, 102, 204, 0.1)",
            outerBg: "radial-gradient(circle 80px at 80% -10%, #ffffff, #181b1b)",
            innerBg: "radial-gradient(circle 80px at 80% -50%, #777777, #0f1111)",
            textColor: "#ffffff",
        },
    },
    green: {
        dark: {
            outerGlow: "rgba(230, 255, 230, 0.4)",
            blobGlow: "rgba(0, 255, 100, 0.5)",
            blobHighlight: "#adff2f",
            blobShadow: "rgba(0, 255, 100, 0.18)",
            innerGlow: "rgba(0, 255, 100, 0.07)",
            innerHighlight: "rgba(173, 255, 47, 0.1)",
            outerBg: "radial-gradient(circle 80px at 80% -10%, #ffffff, #181b1b)",
            innerBg: "radial-gradient(circle 80px at 80% -50%, #777777, #0f1111)",
            textColor: "#ffffff",
        },
    },
};

const GlowButton = ({
    children,
    variant = "blue",
    onClick,
    style = {}
}) => {
    const colors = variants[variant]?.dark || variants.blue.dark;

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation(); // Avoid triggering card events
        console.log(`GlowButton ${variant} clicked`);
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            style={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '1rem',
                border: 'none',
                padding: '2px',
                transition: 'transform 0.2s cubic-bezier(0.1, 0.7, 1.0, 0.1)',
                transform: isActive ? 'scale(0.92)' : (isHovered ? 'scale(1.08)' : 'scale(1)'),
                background: colors.outerBg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50, // Ensure high z-index
                pointerEvents: 'auto',
                ...style
            }}
        >
            {/* Decorative Blur */}
            <div style={{
                position: 'absolute',
                top: 0, right: 0, height: '60%', width: '65%',
                borderRadius: '120px', zIndex: -1,
                boxShadow: `0 0 30px ${colors.outerGlow}`,
                pointerEvents: 'none'
            }} />

            {/* Surface Layer */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                height: '42px',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '14px',
                padding: '0 1.5rem',
                background: colors.innerBg,
                color: colors.textColor,
                pointerEvents: 'none' // Click passes to button
            }}>
                <span style={{
                    position: 'relative', zIndex: 10, whiteSpace: 'nowrap',
                    fontSize: '1rem', fontWeight: 600, display: 'flex',
                    alignItems: 'center', gap: '0.5rem'
                }}>
                    {children}
                </span>
            </div>
        </button>
    );
};

export default GlowButton;
