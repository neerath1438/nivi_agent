import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const XPATHHelperNode = ({ id, data, isConnectable }) => {
    const fields = data.fields || [{ name: '', xpath: '', mode: 'get' }];

    const handleAddField = () => {
        const newFields = [...fields, { name: '', xpath: '', mode: 'get' }];
        data.onChange?.(id, { fields: newFields });
    };

    const handleRemoveField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        data.onChange?.(id, { fields: newFields });
    };

    const handleFieldChange = (index, key, value) => {
        const newFields = fields.map((field, i) => {
            if (i === index) {
                return { ...field, [key]: value };
            }
            return field;
        });
        data.onChange?.(id, { fields: newFields });
    };

    return (
        <div className="xpath-helper-node">
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />

            <div className="node-header">
                <div className="node-icon">🔎</div>
                <div className="node-title">XPATH Helper</div>
            </div>

            <div className="node-body">
                <div className="fields-container">
                    <label>Extraction Fields</label>
                    {fields.map((field, index) => (
                        <div key={index} className="field-row">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Field Name"
                                    value={field.name}
                                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                    className="nodrag"
                                />
                                <div className="row-controls">
                                    <input
                                        type="text"
                                        placeholder="XPATH (e.g. //h1/text())"
                                        value={field.xpath}
                                        onChange={(e) => handleFieldChange(index, 'xpath', e.target.value)}
                                        className="nodrag flex-grow"
                                    />
                                    <select
                                        value={field.mode || 'get'}
                                        onChange={(e) => handleFieldChange(index, 'mode', e.target.value)}
                                        className="nodrag mode-select"
                                    >
                                        <option value="get">Get (1)</option>
                                        <option value="extract">Extract (List)</option>
                                    </select>
                                </div>
                            </div>
                            {fields.length > 1 && (
                                <button className="remove-btn" onClick={() => handleRemoveField(index)}>×</button>
                            )}
                        </div>
                    ))}
                    <button className="add-btn" onClick={handleAddField}>+ Add Field</button>
                </div>

                <div className="info-text">
                    XPATH Extractor ⚡
                    <br />
                    <small>Extract from HTML using XPATH</small>
                </div>
            </div>

            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />

            <style jsx>{`
                .xpath-helper-node {
                    background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
                    border: 2px solid #6366f1;
                    border-radius: 12px;
                    min-width: 320px;
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
                    transition: all 0.3s ease;
                }
                .xpath-helper-node:hover {
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
                }
                .node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-radius: 10px 10px 0 0;
                    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
                }
                .node-icon { font-size: 1.4rem; }
                .node-title {
                    font-weight: 800;
                    color: #2c3e50;
                    font-size: 14px;
                }
                .node-body {
                    padding: 16px;
                    background: white;
                    border-radius: 0 0 10px 10px;
                }
                .fields-container { margin-bottom: 12px; text-align: left; }
                label { display: block; font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
                
                .field-row {
                    display: flex;
                    gap: 6px;
                    margin-bottom: 12px;
                    align-items: flex-start;
                    border-bottom: 1px dashed #f1f5f9;
                    padding-bottom: 12px;
                }
                .field-row:last-child { border-bottom: none; margin-bottom: 8px; }

                .input-group {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .row-controls {
                    display: flex;
                    gap: 4px;
                }
                .flex-grow { flex: 1; }
                
                input, select { 
                    width: 100%; 
                    padding: 6px 10px; 
                    border: 2px solid #f1f5f9; 
                    border-radius: 6px; 
                    font-size: 11px;
                    box-sizing: border-box;
                    background: #f8fafc;
                    font-weight: 600;
                    color: #334155;
                }
                input:focus, select:focus { outline: none; border-color: #6366f1; background: white; }
                
                .mode-select {
                    width: 85px;
                    font-size: 10px;
                    padding: 5px;
                    cursor: pointer;
                    background: #eef2ff;
                    border-color: #e0e7ff;
                    color: #4338ca;
                }

                .remove-btn {
                    padding: 4px 8px;
                    background: #fee2e2;
                    color: #ef4444;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 800;
                    font-size: 14px;
                    margin-top: 2px;
                }
                .remove-btn:hover { background: #fecaca; }

                .add-btn {
                    width: 100%;
                    padding: 6px;
                    background: #f0fdf4;
                    color: #22c55e;
                    border: 2px dashed #bbf7d0;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 4px;
                }
                .add-btn:hover { background: #dcfce7; border-color: #86efac; }

                .info-text { font-size: 11px; margin-top: 10px; color: #475569; font-weight: 600; text-align: center; }
                .info-text small { font-size: 9px; color: #94a3b8; }
            `}</style>
        </div>
    );
};

export default memo(XPATHHelperNode);
