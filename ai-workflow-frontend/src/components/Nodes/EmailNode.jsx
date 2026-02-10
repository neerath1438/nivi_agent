import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const EmailNode = ({ data, isConnectable }) => {
    const handleToChange = (e) => {
        data.onChange(data.id, { to_email: e.target.value });
    };

    const handleCcChange = (e) => {
        data.onChange(data.id, { cc_email: e.target.value });
    };

    const handleSubjectChange = (e) => {
        data.onChange(data.id, { subject: e.target.value });
    };

    return (
        <div className="email-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="email-node-header">
                <div className="email-node-icon">📧</div>
                <div className="email-node-title">Email Setup</div>
                <div className="email-node-tag">Messaging</div>
            </div>

            <div className="email-node-body">
                <div className="universal-badge">
                    SMTP Communication
                </div>

                <div className="input-group">
                    <label>To:</label>
                    <input
                        type="email"
                        value={data.to_email || ''}
                        onChange={handleToChange}
                        placeholder="recipient@example.com"
                        className="nodrag"
                    />
                </div>

                <div className="input-group">
                    <label>CC:</label>
                    <input
                        type="email"
                        value={data.cc_email || ''}
                        onChange={handleCcChange}
                        placeholder="cc@example.com"
                        className="nodrag"
                    />
                </div>

                <div className="input-group">
                    <label>Subject:</label>
                    <input
                        type="text"
                        value={data.subject || ''}
                        onChange={handleSubjectChange}
                        placeholder="Email Subject"
                        className="nodrag"
                    />
                </div>

                <div className="info-text">
                    Dispatch automated emails ⚡
                    <br />
                    <small>Supports dynamic subject and body</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .email-node {
                    background: linear-gradient(135deg, #4481eb 0%, #04befe 100%);
                    border: 2px solid #4481eb;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(68, 129, 235, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .email-node:hover {
                    box-shadow: 0 10px 30px rgba(68, 129, 235, 0.4);
                    transform: translateY(-3px);
                }
                .email-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(68, 129, 235, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .email-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .email-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #4481eb, #04befe);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .email-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #4481eb, #04befe);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .email-node-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    text-align: center;
                }
                .input-group {
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
                    border-color: #4481eb;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(68, 129, 235, 0.1);
                }
                .universal-badge {
                    display: inline-block;
                    background: #e3f2fd;
                    color: #4481eb;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #bbdefb;
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

export default memo(EmailNode);
