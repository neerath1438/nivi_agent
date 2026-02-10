import React from 'react';
import { Share2, Bell, CheckCircle2, AlertTriangle, Bug } from 'lucide-react';

const StatusBar = ({ line, col, language }) => {
    return (
        <div className="ide-status-bar">
            <div className="status-left">
                <div className="status-item remote">
                    <Share2 size={12} />
                    <span>SSH: Local</span>
                </div>
                <div className="status-item">
                    <span>main*</span>
                </div>
                <div className="status-item">
                    <CheckCircle2 size={12} className="success" />
                    <span>0</span>
                    <AlertTriangle size={12} className="warning" />
                    <span>0</span>
                </div>
            </div>

            <div className="status-right">
                <div className="status-item clickable">Ln {line || 1}, Col {col || 1}</div>
                <div className="status-item clickable">Spaces: 4</div>
                <div className="status-item clickable">UTF-8</div>
                <div className="status-item clickable">{language || 'Python'}</div>
                <div className="status-item feedback">
                    <Bug size={12} />
                </div>
                <div className="status-item notify">
                    <Bell size={12} />
                </div>
            </div>

            <style jsx>{`
                .ide-status-bar {
                    height: 22px;
                    background: #007acc;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 10px;
                    color: white;
                    font-size: 11px;
                    user-select: none;
                }
                .status-left, .status-right {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 0 8px;
                    height: 100%;
                    cursor: default;
                }
                .status-item.clickable:hover {
                    background: rgba(255, 255, 255, 0.1);
                    cursor: pointer;
                }
                .status-item.remote {
                    background: #16825d;
                    margin-right: 5px;
                }
                .success { color: #fff; }
                .warning { color: #fff; opacity: 0.8; }
                .status-item.feedback, .status-item.notify {
                    padding: 0 10px;
                }
                .status-item.feedback:hover, .status-item.notify:hover {
                    background: rgba(255, 255, 255, 0.1);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default StatusBar;
