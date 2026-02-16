import {
    RefreshCw,
    Save,
    BookText,
    BarChart3,
    Key,
    Settings,
    Palette,
    Users,
    HelpCircle,
    Moon,
    Sun,
    LogOut,
    Bot
} from 'lucide-react';

const LeftNavbar = ({ activeView, onViewChange, theme, toggleTheme }) => {
    const navItems = [
        { id: 'workflows', icon: <RefreshCw size={24} />, label: 'Workflows', tooltip: 'Build Workflows' },
        { id: 'saved-flows', icon: <Save size={24} />, label: 'Saved Flows', tooltip: 'Manage Saved Flows' },
        { id: 'knowledge', icon: <BookText size={24} />, label: 'Knowledge Base', tooltip: 'Manage Knowledge Base' },
        { id: 'analytics', icon: <BarChart3 size={24} />, label: 'Analytics', tooltip: 'View Analytics' },
        { id: 'credentials', icon: <Key size={24} />, label: 'Credentials', tooltip: 'Manage Credentials' },
        { id: 'settings', icon: <Settings size={24} />, label: 'Settings', tooltip: 'Settings' },
        { id: 'themes', icon: <Palette size={24} />, label: 'Themes', tooltip: 'Theme Customizer' },
        { id: 'users', icon: <Users size={24} />, label: 'Users', tooltip: 'User Management' },
        { id: 'help', icon: <HelpCircle size={24} />, label: 'Help', tooltip: 'Help & Support' },
    ];

    return (
        <div className="left-navbar">
            <div className="left-navbar-logo">
                <div className="logo-icon">
                    <Bot size={28} color="var(--accent-primary)" />
                </div>
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
                    <div className="nav-item-icon">
                        {theme === 'theme-light' ? <Moon size={24} /> : <Sun size={24} />}
                    </div>
                </div>
                <div className="nav-item" title="Logout">
                    <div className="nav-item-icon">
                        <LogOut size={24} />
                    </div>
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
                    background: var(--bg-tertiary);
                    color: var(--accent-primary);
                    transform: translateY(-1px);
                }

                .nav-item.active {
                    background: var(--accent-primary);
                    color: #ffffff;
                    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
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
