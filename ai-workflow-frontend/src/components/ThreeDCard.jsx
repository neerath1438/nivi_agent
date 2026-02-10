import React, { useState, useRef, useCallback } from 'react';

function ThreeDCard({
    children,
    className = '',
    maxRotation = 8,
    glowOpacity = 0.2,
    shadowBlur = 30,
    transitionDuration = '0.4s',
    backgroundImage = null,
    enableGlow = true,
    enableShadow = true,
    animatedGradient = false,
}) {
    const cardRef = useRef(null);

    const [transform, setTransform] = useState({
        rotateX: 0,
        rotateY: 0,
        glowX: 50,
        glowY: 50,
        isHovered: false,
    });

    const handleMouseMove = useCallback(
        (e) => {
            if (!cardRef.current) return;

            const rect = cardRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const xPct = mouseX / rect.width - 0.5;
            const yPct = mouseY / rect.height - 0.5;

            setTransform((prev) => ({
                ...prev,
                rotateX: yPct * -1 * maxRotation,
                rotateY: xPct * maxRotation,
                glowX: (mouseX / rect.width) * 100,
                glowY: (mouseY / rect.height) * 100,
            }));
        },
        [maxRotation]
    );

    const handleMouseEnter = () => setTransform(p => ({ ...p, isHovered: true }));
    const handleMouseLeave = () => setTransform({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, isHovered: false });

    const cardStyle = {
        transform: `perspective(1200px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        boxShadow: enableShadow ? `0 20px 40px rgba(0,0,0,0.4)` : 'none',
        transition: transform.isHovered ? 'none' : `transform ${transitionDuration} ease-out`,
        transformStyle: 'preserve-3d',
        position: 'relative',
        borderRadius: '1.25rem',
        backgroundColor: '#1f2937',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        cursor: 'default'
    };

    const gradientColors = 'linear-gradient(to right, #db2777, #9333ea, #3b82f6)';

    return (
        <div
            style={{ perspective: '1200px', width: '100%', padding: '10px' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <div ref={cardRef} style={cardStyle}>
                {/* Animated Background Layers (Z-Index 0) */}
                {animatedGradient && (
                    <>
                        <div style={{
                            position: 'absolute', top: -5, right: -5, bottom: -5, left: -5,
                            background: gradientColors, backgroundSize: '200% 200%',
                            animation: 'move-gradient 4s linear infinite',
                            filter: 'blur(20px)', opacity: transform.isHovered ? 1 : 0.6,
                            borderRadius: '1.5rem', zIndex: -1, pointerEvents: 'none'
                        }} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: gradientColors, backgroundSize: '200% 200%',
                            animation: 'move-gradient 4s linear infinite',
                            borderRadius: '1.25rem', padding: '2px', zIndex: 0, pointerEvents: 'none'
                        }}>
                            <div style={{ height: '100%', width: '100%', background: '#1f2937', borderRadius: 'calc(1.25rem - 2px)' }} />
                        </div>
                    </>
                )}

                {/* Shine/Glow Effect (Z-Index 1) */}
                {enableGlow && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                        background: `radial-gradient(circle at ${transform.glowX}% ${transform.glowY}%, rgba(255,255,255,${glowOpacity}), transparent)`,
                        opacity: transform.isHovered ? 1 : 0, borderRadius: '1.25rem'
                    }} />
                )}

                {/* CONTENT LAYER */}
                <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto', width: '100%', height: '100%' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ThreeDCard;
