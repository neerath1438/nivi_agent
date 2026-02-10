import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import './ThreeDCarousel.css';

const FALLBACK = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="220"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234a5568" font-size="18">Image</text></svg>';

const DEFAULT_IMAGES = [
    'https://i.pinimg.com/736x/9f/09/45/9f0945103fc6158cb16e1828a2665b5c.jpg',
    'https://i.pinimg.com/1200x/6e/4c/39/6e4c394783c731f261f295e7ffd1deed.jpg',
    'https://i.pinimg.com/1200x/1e/0c/1c/1e0c1c9c868bf07b4c27a275fb3087af.jpg',
    'https://i.pinimg.com/736x/30/91/09/3091098a15810ddbbd58d5e007bc7207.jpg',
    'https://i.pinimg.com/736x/07/cf/4a/07cf4a3a6f4144b4c7ac8e2ec5978dc1.jpg',
    'https://i.pinimg.com/736x/5d/bf/f2/5dbff2b4c0fdcb9815e989f0db386f95.jpg'
];

const CARD_W = 180;
const CARD_H = 240;
const RADIUS = 240;
const TILT_SENSITIVITY = 10;
const DRAG_SENSITIVITY = 0.5;
const INERTIA_FRICTION = 0.95;
const AUTOSPIN_SPEED = 0.08;
const IDLE_TIMEOUT = 2000;

const Card = React.memo(({ src, transform, cardW, cardH }) => (
    <div
        className="carousel-card"
        style={{
            width: cardW,
            height: cardH,
            transform,
            transformStyle: 'preserve-3d',
            willChange: 'transform'
        }}
    >
        <div className="carousel-card-inner">
            <img
                src={src}
                alt="Carousel item"
                width={cardW}
                height={cardH}
                className="carousel-card-image"
                loading="lazy"
                draggable="false"
                onError={(e) => {
                    e.currentTarget.src = FALLBACK;
                }}
            />
        </div>
    </div>
));

Card.displayName = 'Card';

const ThreeDCarousel = React.memo(({
    images = DEFAULT_IMAGES,
    radius = RADIUS,
    cardW = CARD_W,
    cardH = CARD_H
}) => {
    const parentRef = useRef(null);
    const wheelRef = useRef(null);
    const rotationRef = useRef(0);
    const tiltRef = useRef(0);
    const targetTiltRef = useRef(0);
    const velocityRef = useRef(0);
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef(0);
    const initialRotationRef = useRef(0);
    const lastInteractionRef = useRef(Date.now());
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!parentRef.current || isDraggingRef.current) return;
            lastInteractionRef.current = Date.now();

            const parentRect = parentRef.current.getBoundingClientRect();
            const mouseY = e.clientY - parentRect.top;
            const normalizedY = (mouseY / parentRect.height - 0.5) * 2;
            targetTiltRef.current = -normalizedY * TILT_SENSITIVITY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const animate = () => {
            if (!isDraggingRef.current) {
                if (Math.abs(velocityRef.current) > 0.01) {
                    rotationRef.current += velocityRef.current;
                    velocityRef.current *= INERTIA_FRICTION;
                } else if (Date.now() - lastInteractionRef.current > IDLE_TIMEOUT) {
                    rotationRef.current += AUTOSPIN_SPEED;
                }
            }

            tiltRef.current += (targetTiltRef.current - tiltRef.current) * 0.1;

            if (wheelRef.current) {
                wheelRef.current.style.transform = `rotateX(${tiltRef.current}deg) rotateY(${rotationRef.current}deg)`;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleDragStart = useCallback((clientX) => {
        lastInteractionRef.current = Date.now();
        isDraggingRef.current = true;
        velocityRef.current = 0;
        dragStartRef.current = clientX;
        initialRotationRef.current = rotationRef.current;
    }, []);

    const handleDragMove = useCallback((clientX) => {
        if (!isDraggingRef.current) return;
        lastInteractionRef.current = Date.now();

        const deltaX = clientX - dragStartRef.current;
        const newRotation = initialRotationRef.current + deltaX * DRAG_SENSITIVITY;
        velocityRef.current = newRotation - rotationRef.current;
        rotationRef.current = newRotation;
    }, []);

    const handleDragEnd = useCallback(() => {
        isDraggingRef.current = false;
        lastInteractionRef.current = Date.now();
    }, []);

    const onMouseDown = (e) => handleDragStart(e.clientX);
    const onMouseMove = (e) => handleDragMove(e.clientX);
    const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);

    const cards = useMemo(
        () =>
            images.map((src, idx) => {
                const angle = (idx * 360) / images.length;
                return {
                    key: idx,
                    src,
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                };
            }),
        [images, radius]
    );

    return (
        <div
            ref={parentRef}
            className="carousel-3d-container"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={handleDragEnd}
        >
            <div
                className="carousel-3d-perspective"
                style={{
                    perspective: 1500,
                    perspectiveOrigin: 'center',
                    width: Math.max(cardW * 1.5, radius * 2.2),
                    height: Math.max(cardH * 1.8, radius * 1.5)
                }}
            >
                <div
                    ref={wheelRef}
                    className="carousel-3d-wheel"
                    style={{
                        width: cardW,
                        height: cardH,
                        transformStyle: 'preserve-3d',
                        willChange: 'transform',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginLeft: -cardW / 2,
                        marginTop: -cardH / 2
                    }}
                >
                    {cards.map((card) => (
                        <Card
                            key={card.key}
                            src={card.src}
                            transform={card.transform}
                            cardW={cardW}
                            cardH={cardH}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

ThreeDCarousel.displayName = 'ThreeDCarousel';

export default ThreeDCarousel;
