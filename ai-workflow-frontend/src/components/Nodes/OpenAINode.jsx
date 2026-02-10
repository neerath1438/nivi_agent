import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';
import { credentialsService } from '../../services/credentialsService';

const OpenAINode = ({ data, id, isConnectable }) => {
    const [model, setModel] = useState(data.model || 'gpt-4o-mini');
    const [apiKey, setApiKey] = useState(data.apiKey || '');
    const [temperature, setTemperature] = useState(data.temperature || 0.7);
    const [maxTokens, setMaxTokens] = useState(data.maxTokens || 1000);
    const [showApiKey, setShowApiKey] = useState(false);
    const [credentialMode, setCredentialMode] = useState(data.credentialId ? 'credential' : (data.apiKey ? 'manual' : 'backend'));
    const [credentialId, setCredentialId] = useState(data.credentialId || '');
    const [credentials, setCredentials] = useState([]);
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('openai');

    useEffect(() => {
        loadCredentials();
    }, []);

    const loadCredentials = async () => {
        try {
            const data = await credentialsService.getCredentials();
            setCredentials(data.filter(c => c.provider === 'openai'));
        } catch (error) {
            console.error('Failed to load credentials:', error);
        }
    };

    const handleModelChange = (e) => {
        setModel(e.target.value);
        updateNodeData({ model: e.target.value });
    };

    const handleCredentialModeChange = (e) => {
        const mode = e.target.value;
        setCredentialMode(mode);

        if (mode === 'backend') {
            updateNodeData({ model, temperature, maxTokens });
        } else if (mode === 'manual') {
            updateNodeData({ model, apiKey, temperature, maxTokens });
        }
    };

    const handleCredentialChange = (e) => {
        const credId = parseInt(e.target.value);
        setCredentialId(credId);
        updateNodeData({ model, credentialId: credId, temperature, maxTokens });
    };

    const handleApiKeyChange = (e) => {
        setApiKey(e.target.value);
        updateNodeData({ model, apiKey: e.target.value, temperature, maxTokens });
    };

    const handleTempChange = (e) => {
        setTemperature(parseFloat(e.target.value));
        updateNodeData({ temperature: parseFloat(e.target.value) });
    };

    const handleTokensChange = (e) => {
        setMaxTokens(parseInt(e.target.value));
        updateNodeData({ maxTokens: parseInt(e.target.value) });
    };

    const updateNodeData = (updates) => {
        if (data.onChange) {
            const baseData = { model, temperature, maxTokens };

            if (credentialMode === 'credential' && credentialId) {
                data.onChange(id, { ...baseData, credentialId, ...updates });
            } else if (credentialMode === 'manual' && apiKey) {
                data.onChange(id, { ...baseData, apiKey, ...updates });
            } else {
                data.onChange(id, { ...baseData, ...updates });
            }
        }
    };

    const getTempLabel = () => {
        if (temperature <= 0.3) return 'Precise';
        if (temperature <= 0.7) return 'Balanced';
        return 'Creative';
    };

    return (
        <>
            <div className="openai-node">
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div className="openai-node-header">
                    <div className="openai-node-icon">⚙️</div>
                    <div className="openai-node-title">OpenAI Config</div>
                    <div className="openai-node-tag">Provider</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="openai-node-body">
                    <div className="universal-badge">
                        Model Architect
                    </div>

                    <div className="input-field">
                        <label>Model Name</label>
                        <select className="nodrag" value={model} onChange={handleModelChange}>
                            <option value="gpt-4o-mini">gpt-4o-mini</option>
                            <option value="gpt-4o">gpt-4o</option>
                            <option value="gpt-4-turbo">gpt-4-turbo</option>
                            <option value="gpt-4">gpt-4</option>
                            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                        </select>
                    </div>

                    <div className="input-field">
                        <label>API Key Source</label>
                        <select className="nodrag" value={credentialMode} onChange={handleCredentialModeChange}>
                            <option value="backend">Use Backend Key</option>
                            <option value="credential">Use Saved Credential</option>
                            <option value="manual">Enter Manually</option>
                        </select>
                    </div>

                    {credentialMode === 'credential' && (
                        <div className="input-field">
                            <label>Select Credential</label>
                            <select className="nodrag" value={credentialId} onChange={handleCredentialChange}>
                                <option value="">-- Select a credential --</option>
                                {credentials.map(cred => (
                                    <option key={cred.id} value={cred.id}>{cred.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {credentialMode === 'manual' && (
                        <div className="input-field">
                            <label>OpenAI API Key</label>
                            <div className="manual-key-wrapper">
                                <input
                                    type={showApiKey ? 'text' : 'password'}
                                    value={apiKey}
                                    onChange={handleApiKeyChange}
                                    className="nodrag"
                                    placeholder="sk-proj-..."
                                />
                                <button
                                    className="toggle-visibility-btn"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                >
                                    {showApiKey ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>
                    )}

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
                            max="4000"
                        />
                    </div>

                    <div className="info-text">
                        Configures OpenAI brain ⚡
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
                    .openai-node {
                        background: linear-gradient(135deg, #10a37f 0%, #1a73e8 100%);
                        border: 2px solid #10a37f;
                        border-radius: 14px;
                        min-width: 260px;
                        box-shadow: 0 6px 20px rgba(16, 163, 127, 0.3);
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .openai-node:hover {
                        box-shadow: 0 10px 30px rgba(16, 163, 127, 0.4);
                        transform: translateY(-3px);
                    }
                    .openai-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        border-bottom: 2px solid rgba(16, 163, 127, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .openai-node-icon {
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    }
                    .openai-node-title {
                        font-weight: 700;
                        background: linear-gradient(135deg, #10a37f, #1a73e8);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 14px;
                        flex: 1;
                    }
                    .openai-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, #10a37f, #1a73e8);
                        color: #fff;
                        padding: 3px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        margin-right: 8px;
                    }
                    .openai-node-body {
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
                        border-color: #10a37f;
                        background: #fff;
                        box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.1);
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
                    .label-with-badge {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 6px;
                    }
                    .temp-badge {
                        font-size: 10px;
                        font-weight: 800;
                        color: #10a37f;
                        background: #e6fffa;
                        padding: 2px 6px;
                        border-radius: 6px;
                    }
                    .range-slider {
                        width: 100%;
                        accent-color: #10a37f;
                        cursor: pointer;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #e6fffa;
                        color: #10a37f;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        border: 1px solid #b2f5ea;
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

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="OpenAI Config"
                code={code}
                filePath="app/runners/openai_runner.py"
            />
        </>
    );
};

export default OpenAINode;
