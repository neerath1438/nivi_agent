import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const BrowserNode = ({ id, data, isConnectable }) => {
    return (
        <div className="browser-node">
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />

            <div className="browser-node-header">
                <div className="browser-node-icon">🌐</div>
                <div className="browser-node-title">Browser Automation</div>
            </div>

            <div className="browser-node-body">
                <div className="input-field">
                    <label>URL (Target)</label>
                    <input
                        type="text"
                        value={data.url || ''}
                        onChange={(e) => data.onChange?.(id, { url: e.target.value })}
                        placeholder="e.g. google.com"
                        className="nodrag"
                    />
                </div>

                <div className="input-field">
                    <label>Action</label>
                    <select
                        value={data.action || 'navigate'}
                        onChange={(e) => data.onChange?.(id, { action: e.target.value })}
                        className="nodrag"
                    >
                        <option value="navigate">Navigate Only</option>
                        <option value="screenshot">Take Screenshot</option>
                        <option value="content">Extract Content (HTML)</option>
                    </select>
                </div>

                <div className="input-field">
                    <label>Browser Mode</label>
                    <div className="toggle-group">
                        <button
                            className={`toggle-btn ${data.mode !== 'headed' ? 'active' : ''}`}
                            onClick={() => data.onChange?.(id, { mode: 'headless' })}
                        >
                            Headless
                        </button>
                        <button
                            className={`toggle-btn ${data.mode === 'headed' ? 'active' : ''}`}
                            onClick={() => data.onChange?.(id, { mode: 'headed' })}
                        >
                            Headed
                        </button>
                    </div>
                </div>

                <div className="info-text">
                    Automation Engine ⚡
                    <br />
                    <small>Modular Browser Controller</small>
                </div>
            </div>

            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />

            <style jsx>{`
                .browser-node {
                    background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
                    border: 2px solid #00d2ff;
                    border-radius: 12px;
                    min-width: 240px;
                    box-shadow: 0 6px 20px rgba(0, 210, 255, 0.3);
                    transition: all 0.3s ease;
                }
                .browser-node:hover {
                    box-shadow: 0 10px 30px rgba(0, 210, 255, 0.4);
                }
                .browser-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-radius: 10px 10px 0 0;
                    border-bottom: 1px solid rgba(0, 210, 255, 0.2);
                }
                .browser-node-icon { font-size: 1.4rem; }
                .browser-node-title {
                    font-weight: 800;
                    color: #2c3e50;
                    font-size: 14px;
                }
                .browser-node-body {
                    padding: 16px;
                    background: white;
                    border-radius: 0 0 10px 10px;
                    text-align: center;
                }
                .input-field { margin-bottom: 12px; text-align: left; }
                label { display: block; font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 5px; text-transform: uppercase; }
                input, select { 
                    width: 100%; 
                    padding: 8px; 
                    border: 2px solid #f1f5f9; 
                    border-radius: 6px; 
                    font-size: 12px;
                    box-sizing: border-box;
                    background: #f8fafc;
                    font-weight: 600;
                    color: #334155;
                }
                input:focus, select:focus { outline: none; border-color: #00d2ff; background: white; }
                .toggle-group { display: flex; gap: 6px; }
                .toggle-btn { 
                    flex: 1; 
                    font-size: 10px; 
                    padding: 6px; 
                    border: 2px solid #f1f5f9; 
                    background: #f8fafc; 
                    cursor: pointer;
                    border-radius: 6px;
                    font-weight: 700;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .toggle-btn.active { background: #00d2ff; color: white; border-color: #00d2ff; }
                .info-text { font-size: 11px; margin-top: 10px; color: #475569; font-weight: 600; }
                .info-text small { font-size: 9px; color: #94a3b8; }
            `}</style>
        </div>
    );
};

export default memo(BrowserNode);
