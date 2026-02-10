import React, { useState } from 'react';
import ThemeSwitch from './ThemeSwitch';

const ThemeSwitchView = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            padding: '2rem',
            background: isDarkMode ? '#1D1F2C' : '#FAFAFA',
            borderRadius: '12px',
            transition: 'all 0.5s ease',
            color: isDarkMode ? '#FAFAFA' : '#1D1F2C'
        }}>
            <h3 style={{ margin: 0 }}>Theme Switch Preview</h3>
            <ThemeSwitch
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
            />
            <p style={{ opacity: 0.7 }}>
                Current Theme: <strong>{isDarkMode ? 'Night' : 'Day'}</strong>
            </p>
        </div>
    );
};

export default ThemeSwitchView;
