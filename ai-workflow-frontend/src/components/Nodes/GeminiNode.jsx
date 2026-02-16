import React, { useState, memo } from 'react';
import { Handle, Position } from 'reactflow';

const GeminiNode = ({ data, id, isConnectable }) => {
    const [model, setModel] = useState(data.model || 'gemini-2.5-flash');
    const [apiKey, setApiKey] = useState(data.apiKey || '');
    const [temperature, setTemperature] = useState(data.temperature || 0.7);
    const [maxTokens, setMaxTokens] = useState(data.maxTokens || 1000);
    const [showApiKey, setShowApiKey] = useState(false);

    const handleModelChange = (e) => {
        setModel(e.target.value);
        if (data.onChange) {
            data.onChange(id, { provider: 'gemini', model: e.target.value, apiKey, temperature, maxTokens });
        }
    };

    const handleApiKeyChange = (e) => {
        setApiKey(e.target.value);
        if (data.onChange) {
            data.onChange(id, { provider: 'gemini', model, apiKey: e.target.value, temperature, maxTokens });
        }
    };

    const handleTempChange = (e) => {
        setTemperature(parseFloat(e.target.value));
        if (data.onChange) {
            data.onChange(id, { provider: 'gemini', model, apiKey, temperature: parseFloat(e.target.value), maxTokens });
        }
    };

    const handleTokensChange = (e) => {
        setMaxTokens(parseInt(e.target.value));
        if (data.onChange) {
            data.onChange(id, { provider: 'gemini', model, apiKey, temperature, maxTokens: parseInt(e.target.value) });
        }
    };

    const getTempLabel = () => {
        if (temperature <= 0.3) return 'Precise';
        if (temperature <= 0.7) return 'Balanced';
        return 'Creative';
    };

    return (
        <div className="gemini-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="gemini-node-header">
                <div className="gemini-node-icon">🔷</div>
                <div className="gemini-node-title">Gemini Config</div>
                <div className="gemini-node-tag">Provider</div>
            </div>

            <div className="gemini-node-body">
                <div className="universal-badge">
                    Google AI Suite
                </div>

                <div className="input-field">
                    <label>Model Name</label>
                    <select className="nodrag" value={model} onChange={handleModelChange}>
                        <option value="gemini-2.5-flash">gemini-2.5-flash (Working)</option>
                        <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                        <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                        <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                    </select>
                </div>

                <div className="input-field">
                    <label>
                        Gemini API Key
                    </label>
                    <div className="manual-key-wrapper">
                        <input
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            className="nodrag"
                            placeholder="AIza..."
                        />
                        <button
                            className="toggle-visibility-btn"
                            onClick={() => setShowApiKey(!showApiKey)}
                        >
                            {showApiKey ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <small className="help-text-mini">Optional - uses backend key if empty</small>
                </div>

                <div className="input-field">
                    <div className="label-with-badge">
                        <label>Temperature</label>
                        <span className="temp-badge">{getTempLabel()} ({temperature.toFixed(2)})</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.01"
                        value={temperature}
                        onChange={handleTempChange}
                        className="nodrag range-slider"
                    />
                </div>

                <div className="input-field">
                    <label>Max Tokens</label>
                    <input
                        type="number"
                        value={maxTokens}
                        onChange={handleTokensChange}
                        className="nodrag number-input"
                        min="100"
                        max="8000"
                    />
                </div>

                <div className="info-text">
                    Configures Google Gemini brain ⚡
                    <br />
                    <small>Used by LLM execution nodes</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .gemini-node {
                    background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
                    border: 2px solid #1a73e8;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(26, 115, 232, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .gemini-node:hover {
                    box-shadow: 0 10px 30px rgba(26, 115, 232, 0.4);
                    transform: translateY(-3px);
                }
                .gemini-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(26, 115, 232, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .gemini-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .gemini-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #1a73e8, #4285f4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .gemini-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #1a73e8, #4285f4);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .gemini-node-body {
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
                select, .number-input, .manual-key-wrapper input {
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
                select:focus, .number-input:focus, .manual-key-wrapper input:focus {
                    outline: none;
                    border-color: #1a73e8;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
                }
                .manual-key-wrapper {
                    display: flex;
                    gap: 8px;
                }
                .toggle-visibility-btn {
                    padding: 4px 8px;
                    background: #f7fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                }
                .help-text-mini {
                    display: block;
                    font-size: 9px;
                    color: #718096;
                    margin-top: 4px;
                    font-weight: 500;
                }
                .label-with-badge {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 6px;
                }
                .temp-badge {
                    font-size: 10px;
                    font-weight: 800;
                    color: #1a73e8;
                    background: #e8f0fe;
                    padding: 2px 6px;
                    border-radius: 6px;
                }
                .range-slider {
                    width: 100%;
                    accent-color: #1a73e8;
                    cursor: pointer;
                }
                .universal-badge {
                    display: inline-block;
                    background: #e8f0fe;
                    color: #1a73e8;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #d2e3fc;
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

export default memo(GeminiNode);
