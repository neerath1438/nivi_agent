import React from 'react';
import { Menu, X, Minus, Square, Copy } from 'lucide-react';

const TopBar = ({ projectName, onMenuClick, onToggleFullscreen }) => {
    const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];

    return (
        <div className="ide-top-bar">
            <div className="top-bar-left">
                <div className="ide-logo">
                    <svg width="18" height="18" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5Z" fill="#007ACC" />
                        <path d="M30 35L50 50L30 65M70 65V35" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="menu-items">
                    {menuItems.map(item => (
                        <div
                            key={item}
                            className="menu-item"
                            onClick={() => onMenuClick && onMenuClick(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <div className="top-bar-center">
                <span className="project-name">{projectName || 'Generated Project'} - AI Workflow IDE</span>
            </div>

            <div className="top-bar-right">
                <div className="window-control"><Minus size={14} /></div>
                <div className="window-control" onClick={onToggleFullscreen} title="Toggle Fullscreen">
                    <Square size={12} />
                </div>
                <div className="window-control close"><X size={14} /></div>
            </div>

            <style jsx>{`
                .ide-top-bar {
                    height: 35px;
                    background: #3c3c3c;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 12px;
                    color: #cccccc;
                    font-size: 13px;
                    user-select: none;
                    border-bottom: 1px solid #2b2b2b;
                }
                .top-bar-left {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .ide-logo {
                    display: flex;
                    align-items: center;
                    margin-right: 5px;
                }
                .menu-items {
                    display: flex;
                    gap: 2px;
                }
                .menu-item {
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .menu-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .top-bar-center {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0.8;
                }
                .project-name {
                    font-weight: 400;
                }
                .top-bar-right {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
                .window-control {
                    width: 45px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .window-control:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .window-control.close:hover {
                    background: #e81123;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default TopBar;
