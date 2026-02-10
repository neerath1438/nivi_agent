import React from 'react';
import PurpleGlowBackground from './PurpleGlowBackground';

const BackgroundView = () => {
    return (
        <div className="background-view-showcase" style={{
            height: '400px',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <PurpleGlowBackground>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#64748b'
                }}>
                    Content Inside Purple Glow Background
                </div>
            </PurpleGlowBackground>
        </div>
    );
};

export default BackgroundView;
