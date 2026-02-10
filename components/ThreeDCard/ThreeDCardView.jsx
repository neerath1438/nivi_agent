import ThreeDCard from './ThreeDCard';

const ThreeDCardView = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem',
            background: '#000000',
            borderRadius: '8px',
            minHeight: '500px'
        }}>
            <ThreeDCard
                maxRotation={15}
                glowOpacity={0.3}
                shadowBlur={40}
                parallaxOffset={50}
                backgroundImage="https://i.pinimg.com/736x/9f/09/45/9f0945103fc6158cb16e1828a2665b5c.jpg"
                enableGlow={true}
                enableShadow={true}
                enableParallax={true}
            >
                <div style={{
                    width: '400px',
                    height: '250px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }}>
                    <div style={{
                        textAlign: 'center',
                        color: 'white',
                        position: 'relative',
                        zIndex: 20
                    }}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}>
                            3D Card Effect
                        </h2>
                        <p style={{
                            fontSize: '1rem',
                            opacity: 0.9,
                            textShadow: '0 1px 5px rgba(0,0,0,0.5)'
                        }}>
                            Hover to see the magic ✨
                        </p>
                    </div>
                </div>
            </ThreeDCard>
        </div>
    );
};

export default ThreeDCardView;
