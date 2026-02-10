import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const HttpNode = ({ data, isConnectable }) => {
    return (
        <div className="http-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="http-node-header">
                <div className="http-node-icon">🌐</div>
                <div className="http-node-title">API Connector</div>
                <div className="http-node-tag">System</div>
            </div>

            <div className="http-node-body">
                <div className="universal-badge">
                    HTTP Request
                </div>

                <div className="input-field">
                    <label>Method</label>
                    <select
                        value={data.method || 'GET'}
                        onChange={(e) => data.onChange(data.id, { method: e.target.value })}
                        className="nodrag"
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>

                <div className="input-field">
                    <label>URL</label>
                    <input
                        type="text"
                        value={data.url || ''}
                        onChange={(e) => data.onChange(data.id, { url: e.target.value })}
                        placeholder="https://api.example.com/data"
                        className="nodrag"
                    />
                </div>

                <div className="input-field">
                    <label>Payload (JSON)</label>
                    <textarea
                        rows="3"
                        value={data.body || '{}'}
                        onChange={(e) => data.onChange(data.id, { body: e.target.value })}
                        placeholder='{"key": "{input}"}'
                        className="nodrag"
                    />
                </div>

                <div className="info-text">
                    Connects to external APIs ⚡
                    <br />
                    <small>Supports JSON payloads & Variables</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .http-node {
                    background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
                    border: 2px solid #2c3e50;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(44, 62, 80, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .http-node:hover {
                    box-shadow: 0 10px 30px rgba(44, 62, 80, 0.4);
                    transform: translateY(-3px);
                }
                .http-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(44, 62, 80, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .http-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .http-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #2c3e50, #4ca1af);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .http-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #2c3e50, #4ca1af);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .http-node-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    text-align: center;
                }
                .input-field {
                    text-align: left;
                    margin-bottom: 12px;
                }
                label {
                    display: block;
                    font-size: 11px;
                    font-weight: 700;
                    color: #4a5568;
                    margin-bottom: 6px;
                }
                select, input, textarea {
                    width: 100%;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 8px 10px;
                    font-size: 12px;
                    color: #2d3748;
                    background: #f7fafc;
                    transition: all 0.2s;
                    font-weight: 500;
                    box-sizing: border-box;
                }
                select:focus, input:focus, textarea:focus {
                    outline: none;
                    border-color: #2c3e50;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
                }
                textarea {
                    font-family: 'Fira Code', monospace;
                    resize: vertical;
                    min-height: 60px;
                }
                .universal-badge {
                    display: inline-block;
                    background: #f8f9fa;
                    color: #2c3e50;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #e2e8f0;
                    text-transform: uppercase;
                }
                .info-text {
                    font-size: 12px;
                    color: #4a5568;
                    font-weight: 600;
                    line-height: 1.5;
                    margin-top: 10px;
                }
                .info-text small {
                    display: block;
                    margin-top: 6px;
                    font-size: 10px;
                    color: #a0aec0;
                    font-weight: 400;
                }
            `}</style>
        </div>
    );
};

export default memo(HttpNode);
