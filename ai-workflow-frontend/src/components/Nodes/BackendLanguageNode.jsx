import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Server, Database, Cpu, Terminal } from 'lucide-react';

const BackendLanguageNode = ({ data, isConnectable }) => {
    const selectedLang = data.language || 'Python (Standard)';

    const options = [
        { id: 'python-std', label: 'Python (Standard)', icon: <Terminal size={12} /> },
        { id: 'python-fastapi', label: 'Python (FastAPI)', icon: <Terminal size={12} /> },
        { id: 'node', label: 'Node.js (Express)', icon: <Cpu size={12} /> },
        { id: 'java', label: 'Java (Spring)', icon: <Server size={12} /> },
        { id: 'php', label: 'PHP (Laravel)', icon: <Database size={12} /> }
    ];

    const handleSelect = (langLabel) => {
        if (data.onChange) {
            data.onChange(data.id, { language: langLabel, is_frontend: false });
        }
    };

    return (
        <div className="be-lang-node">
            <div className="be-lang-header">
                <div className="be-lang-icon">
                    <Server size={18} color="#475569" />
                </div>
                <div className="be-lang-title">Backend Stack</div>
                <div className="be-lang-tag">API</div>
            </div>

            <div className="be-lang-body">
                <div className="instruction">Select server technology:</div>
                <div className="lang-chips">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className={`lang-chip ${selectedLang === opt.label ? 'active' : ''}`}
                            onClick={() => handleSelect(opt.label)}
                        >
                            {opt.icon}
                            <span>{opt.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />

            <style jsx>{`
                .be-lang-node {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    border: 2px solid #334155;
                    border-radius: 14px;
                    min-width: 280px;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    color: white;
                }
                .be-lang-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .be-lang-title {
                    font-weight: 800;
                    color: #1e293b;
                    font-size: 14px;
                    flex: 1;
                }
                .be-lang-tag {
                    font-size: 9px;
                    background: #1e293b;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .be-lang-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    color: #4b5563;
                }
                .instruction {
                    font-size: 10px;
                    font-weight: 700;
                    color: #64748b;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                }
                .lang-chips {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .lang-chip {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 14px;
                    background: #f1f5f9;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #334155;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #e2e8f0;
                }
                .lang-chip:hover {
                    background: #e2e8f0;
                    transform: translateX(4px);
                }
                .lang-chip.active {
                    background: #334155;
                    color: white;
                    border-color: #334155;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default memo(BackendLanguageNode);
