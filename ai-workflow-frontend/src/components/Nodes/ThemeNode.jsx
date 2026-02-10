import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Palette, Box, Sun, Moon, Zap, RefreshCw, Sparkles, Layout } from 'lucide-react';

const ThemeNode = ({ data, isConnectable }) => {
    const selectedTheme = data.theme || 'Glassmorphism';

    const themes = [
        { id: 'glass', label: 'Glassmorphism', icon: <Box size={14} />, color: '#ffffff' },
        { id: 'cyber', label: 'Cyberpunk', icon: <Zap size={14} />, color: '#ff00ff' },
        { id: 'minimal', label: 'Minimalist', icon: <Sun size={14} />, color: '#111827' },
        { id: 'retro', label: 'Retro', icon: <Moon size={14} />, color: '#ff6b6b' },
        { id: 'ios', label: 'iOS 16 Luxury', icon: <Sparkles size={14} />, color: '#007aff' },
        { id: 'material', label: 'Material You', icon: <Box size={14} />, color: '#d2e3af' },
        { id: 'snow', label: 'Snow Dashboard', icon: <Layout size={14} />, color: '#3b82f6' },
        { id: 'designcode', label: 'DesignCode Luxury', icon: <Sparkles size={14} />, color: '#a855f7' },
        { id: 'random', label: 'All Themes (Random)', icon: <RefreshCw size={14} />, color: '#8b5cf6' }
    ];

    const handleSelect = (themeLabel) => {
        if (data.onChange) {
            data.onChange(data.id, { theme: themeLabel });
        }
    };

    return (
        <div className="theme-node">
            <div className="theme-header">
                <div className="theme-icon">
                    <Palette size={18} color="#8b5cf6" />
                </div>
                <div className="theme-title">Visual Theme</div>
                <div className="theme-tag">Design</div>
            </div>

            <div className="theme-body">
                <div className="instruction">Select design system:</div>
                <div className="theme-grid">
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            className={`theme-card ${selectedTheme === theme.label ? 'active' : ''}`}
                            onClick={() => handleSelect(theme.label)}
                        >
                            <div className="theme-card-icon" style={{ color: theme.color }}>
                                {theme.icon}
                            </div>
                            <div className="theme-card-label">{theme.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />

            <style jsx>{`
                .theme-node {
                    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
                    border: 2px solid #8b5cf6;
                    border-radius: 14px;
                    min-width: 300px;
                    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
                    overflow: hidden;
                    color: white;
                }
                .theme-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(139, 92, 246, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .theme-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    flex: 1;
                }
                .theme-tag {
                    font-size: 9px;
                    background: #f5f3ff;
                    color: #6d28d9;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .theme-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    color: #4b5563;
                }
                .instruction {
                    font-size: 10px;
                    font-weight: 700;
                    color: #94a3b8;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                }
                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }
                .theme-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 10px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .theme-card:hover {
                    background: #f1f5f9;
                    transform: translateY(-2px);
                }
                .theme-card.active {
                    background: #f5f3ff;
                    border-color: #8b5cf6;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
                }
                .theme-card-icon {
                    background: white;
                    padding: 6px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .theme-card.active .theme-card-icon {
                    background: #8b5cf6;
                    color: white !important;
                }
                .theme-card-label {
                    font-size: 10px;
                    font-weight: 600;
                    color: #475569;
                    text-align: center;
                }
                .theme-card.active .theme-card-label {
                    color: #6d28d9;
                }
            `}</style>
        </div>
    );
};

export default memo(ThemeNode);
