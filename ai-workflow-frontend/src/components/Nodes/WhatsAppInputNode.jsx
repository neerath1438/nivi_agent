import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { getWhatsAppStatus } from '../../services/api';

const WhatsAppInputNode = ({ data, isConnectable }) => {
    const [status, setStatus] = useState('loading');
    const [qr, setQr] = useState(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await getWhatsAppStatus();
                setStatus(data.status);
                setQr(data.qr);
            } catch (err) {
                setStatus('error');
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 2000); // Lowered to 2 seconds for faster response
        return () => clearInterval(interval);
    }, []);

    const handleReset = async () => {
        if (!window.confirm("Are you sure you want to reset the WhatsApp connection? This will logout the current session.")) return;

        try {
            setStatus('loading');
            await fetch('/api/whatsapp/reset', { method: 'POST' });
            // Status will update via next poll
        } catch (err) {
            console.error("Failed to reset WhatsApp", err);
            alert("Failed to reset connection.");
        }
    };

    return (
        <div className="whatsapp-node">
            <div className="whatsapp-node-header">
                <div className="whatsapp-node-icon">📱</div>
                <div className="whatsapp-node-title">WhatsApp Trigger</div>
                <div className="whatsapp-node-tag">Channel</div>
            </div>

            <div className="whatsapp-node-body">
                <div className="status-container">
                    <div className={`status-badge ${status}`}>
                        {status === 'connected' ? '✅ Connected' : status === 'connecting' ? '⌛ Connecting...' : '❌ Disconnected'}
                    </div>
                    <button className="reset-btn nodrag" onClick={handleReset} title="Reset Session">
                        🔄
                    </button>
                </div>

                {status !== 'connected' && qr && (
                    <div className="qr-container">
                        <img src={qr} alt="WhatsApp QR Code" />
                        <p>Scan to link WhatsApp</p>
                    </div>
                )}

                {status === 'connected' && (
                    <div className="info-text">
                        Listening for messages... ⚡
                    </div>
                )}

                <div className="filter-settings">
                    <label>Selection Mode</label>
                    <select
                        value={data.mode || 'everyone'}
                        onChange={(e) => data.onChange(data.id, { mode: e.target.value })}
                        className="nodrag"
                    >
                        <option value="everyone">Everyone</option>
                        <option value="specific">Specific Numbers</option>
                    </select>

                    {data.mode === 'specific' && (
                        <>
                            <label>Allowed Numbers (comma separated)</label>
                            <textarea
                                className="nodrag"
                                placeholder="e.g. 919876543210, 1234567890"
                                value={data.allowedNumbers || ''}
                                onChange={(e) => data.onChange(data.id, { allowedNumbers: e.target.value })}
                            />
                            <small>Format: country code + number (no + or spaces)</small>
                        </>
                    )}
                </div>

                {status === 'loading' && <p>Checking status...</p>}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .whatsapp-node {
                    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
                    border: 2px solid #25d366;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    color: white;
                }
                .whatsapp-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(37, 211, 102, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .whatsapp-node-icon { font-size: 1.3rem; }
                .whatsapp-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #25d366, #128c7e);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    flex: 1;
                }
                .whatsapp-node-tag {
                    font-size: 9px;
                    background: #25d366;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .whatsapp-node-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    text-align: center;
                    color: #4a5568;
                }
                .status-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 12px;
                }
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                .reset-btn {
                    background: #f1f3f5;
                    border: 1px solid #dee2e6;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                .reset-btn:hover {
                    background: #e9ecef;
                    transform: rotate(180deg);
                }
                .status-badge.connected { background: #e6fffa; color: #25d366; border: 1px solid #25d366; }
                .status-badge.disconnected { background: #fff5f5; color: #e53e3e; border: 1px solid #feb2b2; }
                .status-badge.connecting { background: #fffaf0; color: #dd6b20; border: 1px solid #fbd38d; }
                
                .qr-container img {
                    width: 150px;
                    height: 150px;
                    margin: 10px auto;
                    border: 1px solid #eee;
                }
                .qr-container p { font-size: 11px; color: #718096; }
                .info-text { font-size: 12px; font-weight: 600; margin-bottom: 15px; }
                .info-text small { font-size: 10px; color: #a0aec0; }

                .filter-settings {
                    text-align: left;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    border-top: 1px solid #edf2f7;
                    padding-top: 15px;
                }
                .filter-settings label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #4a5568;
                }
                .filter-settings select, .filter-settings textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 12px;
                    background: #f7fafc;
                    color: #2d3748;
                    outline: none;
                }
                .filter-settings select:focus, .filter-settings textarea:focus {
                    border-color: #25d366;
                    background: white;
                }
                .filter-settings textarea {
                    min-height: 60px;
                    resize: vertical;
                    font-family: inherit;
                }
                .filter-settings small {
                    font-size: 9px;
                    color: #718096;
                    line-height: 1.2;
                }
            `}</style>
        </div>
    );
};

export default WhatsAppInputNode;
