import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const PdfNode = ({ data, isConnectable }) => {
    return (
        <div className="pdf-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="pdf-node-header">
                <div className="pdf-node-icon">📄</div>
                <div className="pdf-node-title">PDF Generator</div>
                <div className="pdf-node-tag">Export</div>
            </div>

            <div className="pdf-node-body">
                <div className="universal-badge">
                    Document Suite
                </div>

                <div className="input-field">
                    <label>Document Title</label>
                    <input
                        type="text"
                        value={data.title || 'AI Report'}
                        onChange={(e) => data.onChange(data.id, { title: e.target.value })}
                        placeholder="e.g. Monthly Summary"
                        className="nodrag"
                    />
                </div>

                <div className="info-text">
                    Transforms text into PDF ⚡
                    <br />
                    <small>Professional multi-page export</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .pdf-node {
                    background: linear-gradient(135deg, #ff4e50 0%, #f9d423 100%);
                    border: 2px solid #ff4e50;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(255, 78, 80, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .pdf-node:hover {
                    box-shadow: 0 10px 30px rgba(255, 78, 80, 0.4);
                    transform: translateY(-3px);
                }
                .pdf-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(255, 78, 80, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .pdf-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .pdf-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #ff4e50, #f9d423);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .pdf-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #ff4e50, #f9d423);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .pdf-node-body {
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
                input {
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
                input:focus {
                    outline: none;
                    border-color: #ff4e50;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(255, 78, 80, 0.1);
                }
                .universal-badge {
                    display: inline-block;
                    background: #fff5f5;
                    color: #ff4e50;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #fed7d7;
                    text-transform: uppercase;
                }
                .info-text {
                    font-size: 12px;
                    color: #4a5568;
                    font-weight: 600;
                    line-height: 1.5;
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

export default memo(PdfNode);
