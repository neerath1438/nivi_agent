import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import axios from 'axios';

const KnowledgeNode = ({ data, isConnectable }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/knowledge/files');
                setFiles(response.data);
            } catch (err) {
                console.error("Failed to fetch knowledge files", err);
            }
        };
        fetchFiles();
    }, []);

    return (
        <div className="knowledge-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="knowledge-node-header">
                <div className="knowledge-node-icon">📚</div>
                <div className="knowledge-node-title">Knowledge Base</div>
                <div className="knowledge-node-tag">Files</div>
            </div>

            <div className="knowledge-node-body">
                <div className="universal-badge">
                    Data Source
                </div>

                <div className="input-field">
                    <label>Select Document</label>
                    <select
                        value={data.file_id || ''}
                        onChange={(e) => data.onChange(data.id, { file_id: e.target.value })}
                        className="nodrag"
                    >
                        <option value="">-- Latest Upload --</option>
                        {files.map(file => (
                            <option key={file.id} value={file.id}>{file.name}</option>
                        ))}
                    </select>
                </div>

                <div className="info-text">
                    Contextual data for AI ⚡
                    <br />
                    <small>Extracts text from PDF, DOCX, JSON</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .knowledge-node {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    border: 2px solid #4facfe;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(79, 172, 254, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .knowledge-node:hover {
                    box-shadow: 0 10px 30px rgba(79, 172, 254, 0.4);
                    transform: translateY(-3px);
                }
                .knowledge-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(79, 172, 254, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .knowledge-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .knowledge-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #4facfe, #00f2fe);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .knowledge-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #4facfe, #00f2fe);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .knowledge-node-body {
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
                select {
                    width: 100%;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 8px 10px;
                    font-size: 12px;
                    color: #2d3748;
                    background: #f7fafc;
                    transition: all 0.2s;
                    cursor: pointer;
                    font-weight: 500;
                }
                select:focus {
                    outline: none;
                    border-color: #4facfe;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
                }
                .universal-badge {
                    display: inline-block;
                    background: #e3f2fd;
                    color: #4facfe;
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

export default memo(KnowledgeNode);
