import React, { useState } from 'react';

const LeftNavbar = ({ activeView, onViewChange, theme, toggleTheme }) => {
    const navItems = [
        { id: 'workflows', icon: '🔄', label: 'Workflows', tooltip: 'Build Workflows' },
        { id: 'saved-flows', icon: '💾', label: 'Saved Flows', tooltip: 'Manage Saved Flows' },
        { id: 'knowledge', icon: '📚', label: 'Knowledge Base', tooltip: 'Manage Knowledge Base' },
        { id: 'analytics', icon: '📊', label: 'Analytics', tooltip: 'View Analytics' },
        { id: 'credentials', icon: '🔑', label: 'Credentials', tooltip: 'Manage Credentials' },
        { id: 'settings', icon: '⚙️', label: 'Settings', tooltip: 'Settings' },
        { id: 'themes', icon: '🎨', label: 'Themes', tooltip: 'Theme Customizer' },
        { id: 'users', icon: '👥', label: 'Users', tooltip: 'User Management' },
        { id: 'help', icon: '❓', label: 'Help', tooltip: 'Help & Support' },
    ];

    return (
        <div className="left-navbar">
            <div className="left-navbar-logo">
                <div className="logo-icon">🤖</div>
            </div>

            <div className="left-navbar-items">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                        title={item.tooltip}
                    >
                        <div className="nav-item-icon">{item.icon}</div>
                        {activeView === item.id && (
                            <div className="nav-item-indicator"></div>
                        )}
                    </div>
                ))}
            </div>

            <div className="left-navbar-footer">
                <div
                    className="nav-item theme-toggle"
                    onClick={toggleTheme}
                    title={theme === 'theme-light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    <div className="nav-item-icon">{theme === 'theme-light' ? '🌙' : '☀️'}</div>
                </div>
                <div className="nav-item" title="Logout">
                    <div className="nav-item-icon">🚪</div>
                </div>
            </div>

            <style jsx>{`
                .left-navbar {
                    width: 72px;
                    background: var(--bg-primary);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px 0;
                    z-index: 1000;
                    border-right: 1px solid var(--border-color);
                }

                .left-navbar-logo {
                    margin-bottom: 30px;
                }

                .logo-icon {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .logo-icon:hover {
                    transform: scale(1.05) translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .left-navbar-items {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                    align-items: center;
                    padding: 0 10px;
                }

                .nav-item {
                    position: relative;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 11px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    background: transparent;
                    color: var(--text-secondary);
                }

                .nav-item:hover {
                    background: rgba(0, 0, 0, 0.05);
                    color: #000000;
                    transform: scale(1.02);
                }

                .nav-item.active {
                    background: var(--accent-primary);
                    color: #ffffff;
                }

                .nav-item-icon {
                    font-size: 1.4rem;
                    transition: transform 0.2s;
                }

                .nav-item-indicator {
                    position: absolute;
                    left: -14px;
                    width: 4px;
                    height: 20px;
                    background: #007aff;
                    border-radius: 0 4px 4px 0;
                    box-shadow: 0 0 10px rgba(0, 122, 255, 0.5);
                }

                .left-navbar-footer {
                    margin-top: auto;
                    padding-top: 20px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
};

export default LeftNavbar;
