import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Layout, Palette, Code, Sparkles } from 'lucide-react';

const FrontendLanguageNode = ({ data, isConnectable }) => {
    const selectedLang = data.language || 'React + Tailwind';

    const options = [
        { id: 'react', label: 'React + Tailwind', color: '#61dafb' },
        { id: 'next', label: 'Next.js + Tailwind', color: '#000000' },
        { id: 'html', label: 'HTML + Tailwind', color: '#e34f26' },
        { id: 'vue', label: 'Vue.js + Tailwind', color: '#4fc08d' }
    ];

    const handleSelect = (langLabel) => {
        if (data.onChange) {
            data.onChange(data.id, { language: langLabel, is_frontend: true });
        }
    };

    return (
        <div className="fe-lang-node">
            <div className="fe-lang-header">
                <div className="fe-lang-icon">
                    <Layout size={18} color="#2563eb" />
                </div>
                <div className="fe-lang-title">Frontend Stack</div>
                <div className="fe-lang-tag">UI</div>
            </div>

            <div className="fe-lang-body">
                <div className="instruction">Select styling & framework:</div>
                <div className="lang-chips">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className={`lang-chip ${selectedLang === opt.label ? 'active' : ''}`}
                            onClick={() => handleSelect(opt.label)}
                        >
                            <Sparkles size={10} style={{ opacity: selectedLang === opt.label ? 1 : 0.3 }} />
                            <span>{opt.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />

            <style jsx>{`
                .fe-lang-node {
                    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                    border: 2px solid #2563eb;
                    border-radius: 14px;
                    min-width: 280px;
                    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    color: white;
                }
                .fe-lang-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(37, 99, 235, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .fe-lang-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #2563eb, #1e40af);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    flex: 1;
                }
                .fe-lang-tag {
                    font-size: 9px;
                    background: #dbeafe;
                    color: #1e40af;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .fe-lang-body {
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
                    background: #f8fafc;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #e2e8f0;
                }
                .lang-chip:hover {
                    background: #f1f5f9;
                    transform: translateX(4px);
                }
                .lang-chip.active {
                    background: #2563eb;
                    color: white;
                    border-color: #2563eb;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }
            `}</style>
        </div>
    );
};

export default memo(FrontendLanguageNode);
