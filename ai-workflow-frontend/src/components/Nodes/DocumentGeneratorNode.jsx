import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const DocumentGeneratorNode = ({ data, isConnectable }) => {
    return (
        <div className="document-generator-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="document-generator-node-header">
                <div className="document-generator-node-icon">📄</div>
                <div className="document-generator-node-title">Export Document</div>
                <div className="document-generator-node-tag">Multi-Format</div>
            </div>

            <div className="document-generator-node-body">
                <div className="universal-badge">
                    Doc Engine
                </div>

                <div className="input-field">
                    <label>Document Title</label>
                    <input
                        type="text"
                        value={data.title || 'AI Generated Document'}
                        onChange={(evt) => data.onChange(data.id, { title: evt.target.value })}
                        className="nodrag"
                        placeholder="Enter document title..."
                    />
                </div>

                <div className="input-field">
                    <label>Export Format</label>
                    <select
                        value={data.format || 'pdf'}
                        onChange={(evt) => data.onChange(data.id, { format: evt.target.value })}
                        className="nodrag"
                    >
                        <option value="pdf">📕 PDF</option>
                        <option value="docx">📘 Word (DOCX)</option>
                        <option value="txt">📝 Plain Text</option>
                        <option value="md">📋 Markdown</option>
                    </select>
                </div>

                <div className="input-field">
                    <label>Template Style</label>
                    <select
                        value={data.template || 'simple'}
                        onChange={(evt) => data.onChange(data.id, { template: evt.target.value })}
                        className="nodrag"
                    >
                        <option value="simple">Simple</option>
                        <option value="professional">Professional</option>
                        <option value="executive">Executive</option>
                    </select>
                </div>

                <div className="info-text">
                    {data.format === 'pdf' && 'Professional PDF Layout ⚡'}
                    {data.format === 'docx' && 'Editable Word Document ⚡'}
                    {data.format === 'txt' && 'Clean Plain Text ⚡'}
                    {data.format === 'md' && 'Structured Markdown ⚡'}
                    <br />
                    <small>High-fidelity multi-format export</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .document-generator-node {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    border: 2px solid #f093fb;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(240, 147, 251, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .document-generator-node:hover {
                    box-shadow: 0 10px 30px rgba(240, 147, 251, 0.4);
                    transform: translateY(-3px);
                }
                .document-generator-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(240, 147, 251, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .document-generator-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .document-generator-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #f093fb, #f5576c);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .document-generator-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #f093fb, #f5576c);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .document-generator-node-body {
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
                input, select {
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
                    cursor: pointer;
                }
                input:focus, select:focus {
                    outline: none;
                    border-color: #f093fb;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
                }
                .universal-badge {
                    display: inline-block;
                    background: #fdf2f8;
                    color: #f093fb;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #fce7f3;
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

export default memo(DocumentGeneratorNode);
