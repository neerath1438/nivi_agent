import React, { useState, useEffect } from 'react';
import GlowButton from './GlowButton';

const ThemeCustomizer = ({ onApplyTheme, theme }) => {
    const [colors, setColors] = useState(['#4f46e5', '#4654e3']);
    const [type, setType] = useState('linear');
    const [angle, setAngle] = useState(45);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSmooth, setIsSmooth] = useState(true);
    const [baseColor, setBaseColor] = useState('#4f46e5');

    const generateShades = (hex) => {
        // Simplified shade generation for UI demonstration
        return [
            { weight: 50, color: '#f8fafc' },
            { weight: 100, color: '#f1f5f9' },
            { weight: 200, color: '#e2e8f0' },
            { weight: 300, color: '#cbd5e1' },
            { weight: 400, color: '#94a3b8' },
            { weight: 500, color: hex },
            { weight: 600, color: '#475569' },
            { weight: 700, color: '#334155' },
            { weight: 800, color: '#1e293b' },
            { weight: 900, color: '#0f172a' },
        ];
    };

    const shades = generateShades(baseColor);

    const generateGradient = () => {
        const colorStr = colors.join(', ');
        if (type === 'linear') {
            return `linear-gradient(${angle}deg, ${colorStr})`;
        } else if (type === 'radial') {
            return `radial-gradient(circle, ${colorStr})`;
        } else if (type === 'conic') {
            return `conic-gradient(from ${angle}deg, ${colorStr})`;
        }
        return '';
    };

    const currentGradient = generateGradient();

    const handleApply = () => {
        onApplyTheme(currentGradient, isAnimating);
    };

    const addColor = () => {
        setColors([...colors, '#ffffff']);
    };

    const updateColor = (index, value) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };

    const removeColor = (index) => {
        if (colors.length > 2) {
            setColors(colors.filter((_, i) => i !== index));
        }
    };

    const handleReset = () => {
        setColors(['#4f46e5', '#4654e3']);
        setType('linear');
        setAngle(45);
        setIsAnimating(false);
        setBaseColor('#4f46e5');
        onApplyTheme('', false);
    };

    return (
        <div className="theme-customizer">
            <div className="customizer-header">
                <h2>🎨 Theme Customizer</h2>
                <button className="mac-btn reset-btn" onClick={handleReset}>↺ Reset to Default</button>
            </div>

            <div className="customizer-grid">
                {/* Left Controls */}
                <div className="customizer-controls">
                    <div className="control-section">
                        <h4>Base Color & Palette</h4>
                        <div className="base-color-picker-row">
                            <input
                                type="color"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="color-picker large"
                            />
                            <input
                                type="text"
                                value={baseColor.toUpperCase()}
                                readOnly
                                className="hex-input"
                            />
                        </div>

                        <div className="palette-grid">
                            {shades.map((shade) => (
                                <div
                                    key={shade.weight}
                                    className="shade-item"
                                    onClick={() => updateColor(0, shade.color)}
                                >
                                    <div className="shade-box" style={{ background: shade.color }}></div>
                                    <span className="shade-label">{shade.weight}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="control-section">
                        <h4>Gradient Builder</h4>
                        <div className="color-swatches">
                            {colors.map((color, index) => (
                                <div key={index} className="color-input-wrapper">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => updateColor(index, e.target.value)}
                                        className="color-picker"
                                    />
                                    {colors.length > 2 && (
                                        <button onClick={() => removeColor(index)} className="remove-color">×</button>
                                    )}
                                </div>
                            ))}
                            <button className="add-color-btn" onClick={addColor}>+</button>
                        </div>
                        <div className="quick-actions">
                            <button className="mac-btn-small" onClick={() => setColors(['#4f46e5', '#06b6d4'])}>Random</button>
                            <button className="mac-btn-small">Presets</button>
                        </div>
                    </div>

                    <div className="control-section">
                        <h4>Type & Controls</h4>
                        <div className="type-toggle-pills">
                            <button className={type === 'linear' ? 'active' : ''} onClick={() => setType('linear')}>Linear</button>
                            <button className={type === 'radial' ? 'active' : ''} onClick={() => setType('radial')}>Radial</button>
                            <button className={type === 'conic' ? 'active' : ''} onClick={() => setType('conic')}>Conic</button>
                        </div>

                        <div className="angle-control-wrapper">
                            <span>Angle</span>
                            <div className="angle-knob-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={angle}
                                    onChange={(e) => setAngle(e.target.value)}
                                    className="angle-slider"
                                />
                                <div className="angle-display">{angle}°</div>
                            </div>
                        </div>
                    </div>

                    <div className="control-section">
                        <h4>Animation</h4>
                        <div className="animation-actions">
                            <button
                                className={`mac-btn ${isAnimating ? 'active' : ''}`}
                                onClick={() => setIsAnimating(!isAnimating)}
                            >
                                {isAnimating ? '⏸ Pause' : '▶ Animate'}
                            </button>
                            <button
                                className={`mac-btn ${isSmooth ? 'active' : ''}`}
                                onClick={() => setIsSmooth(!isSmooth)}
                            >
                                ⇌ {isSmooth ? 'Soft' : 'Hard'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Preview */}
                <div className="customizer-preview">
                    <div className="preview-header">
                        <h4>Preview</h4>
                        <button className="mac-btn apply-btn" onClick={handleApply}>✨ Apply Theme</button>
                    </div>
                    <div className="preview-card">
                        <div
                            className={`preview-box ${isAnimating ? 'animating' : ''}`}
                            style={{
                                background: currentGradient,
                                backgroundSize: isAnimating ? '400% 400%' : 'cover'
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .theme-customizer {
                    padding: 40px;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    color: var(--text-primary);
                }

                .customizer-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .reset-btn {
                    padding: 8px 16px;
                    font-size: 0.9rem;
                    background: var(--bg-secondary);
                    color: var(--accent-error) !important;
                    border-color: var(--accent-error);
                }

                .preview-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .apply-btn {
                    background: var(--accent-primary) !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 20px !important;
                    font-weight: 600 !important;
                    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
                }

                .apply-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
                }

                .customizer-grid {
                    display: grid;
                    grid-template-columns: 440px 1fr;
                    gap: 40px;
                }
                
                .base-color-picker-row {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .color-picker.large {
                    width: 60px;
                    height: 60px;
                }

                .hex-input {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    padding: 10px 15px;
                    color: var(--text-primary);
                    font-family: monospace;
                    font-size: 1.1rem;
                    width: 120px;
                }

                .palette-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;
                }

                .shade-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .shade-item:hover {
                    transform: scale(1.1);
                }

                .shade-box {
                    width: 100%;
                    aspect-ratio: 1;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                }

                .shade-label {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                }

                .control-section {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 24px;
                    box-shadow: var(--shadow);
                }

                .control-section h4 {
                    font-size: 1rem;
                    margin-bottom: 20px;
                    color: var(--text-secondary);
                }

                .color-swatches {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .color-input-wrapper {
                    position: relative;
                }

                .color-picker {
                    -webkit-appearance: none;
                    width: 44px;
                    height: 44px;
                    border: 2px solid var(--border-color);
                    border-radius: 50%;
                    cursor: pointer;
                    background: none;
                    padding: 0;
                    overflow: hidden;
                }

                .color-picker::-webkit-color-swatch-wrapper {
                    padding: 0;
                }

                .color-picker::-webkit-color-swatch {
                    border: none;
                    border-radius: 50%;
                }

                .remove-color {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 18px;
                    height: 18px;
                    background: var(--accent-error);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .add-color-btn {
                    width: 44px;
                    height: 44px;
                    border: 2px dashed var(--border-color);
                    border-radius: 50%;
                    background: none;
                    color: var(--text-secondary);
                    font-size: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .add-color-btn:hover {
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                }

                .quick-actions {
                    display: flex;
                    gap: 10px;
                }

                .mac-btn-small {
                    padding: 6px 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 0.8rem;
                    cursor: pointer;
                }

                .type-toggle-pills {
                    display: flex;
                    background: var(--bg-secondary);
                    padding: 4px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                }

                .type-toggle-pills button {
                    flex: 1;
                    padding: 8px;
                    border: none;
                    border-radius: 8px;
                    background: none;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .type-toggle-pills button.active {
                    background: var(--bg-primary);
                    color: var(--accent-primary);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .angle-control-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .angle-knob-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .angle-slider {
                    width: 150px;
                }

                .angle-display {
                    font-size: 0.9rem;
                    font-weight: 600;
                    min-width: 40px;
                }

                .animation-actions {
                    display: flex;
                    gap: 12px;
                }

                .mac-btn {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .mac-btn.active {
                    background: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }

                .preview-card {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 24px;
                    padding: 16px;
                    height: 400px;
                    box-shadow: var(--shadow-lg);
                }

                .preview-box {
                    width: 100%;
                    height: 100%;
                    border-radius: 16px;
                    transition: all 0.5s ease;
                }

                @keyframes gradient-animation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .preview-box.animating {
                    animation: gradient-animation 15s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default ThemeCustomizer;
