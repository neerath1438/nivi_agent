import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Code2, Terminal, Globe, Cpu } from 'lucide-react';

const CodeLanguageNode = ({ data, isConnectable }) => {
    const selectedLang = data.language || 'Python';

    const languages = [
        { id: 'python', label: 'Python', icon: <Terminal size={12} />, color: '#3776ab' },
        { id: 'java', label: 'Java', icon: <Cpu size={12} />, color: '#007396' },
        { id: 'html', label: 'HTML/CSS', icon: <Globe size={12} />, color: '#e34f26' },
        { id: 'react', label: 'React', icon: <Code2 size={12} />, color: '#61dafb' },
        { id: 'js', label: 'JS', icon: <Code2 size={12} />, color: '#f7df1e' }
    ];

    const handleSelect = (langLabel) => {
        if (data.onChange) {
            data.onChange(data.id, { language: langLabel });
        }
    };

    return (
        <div className="code-lang-node">
            <div className="code-lang-header">
                <div className="code-lang-icon">
                    <Code2 size={18} color="#059669" />
                </div>
                <div className="code-lang-title">Code Language</div>
                <div className="code-lang-tag">Target</div>
            </div>

            <div className="code-lang-body">
                <div className="instruction">Select output language:</div>
                <div className="lang-chips">
                    {languages.map((lang) => (
                        <div
                            key={lang.id}
                            className={`lang-chip ${selectedLang === lang.label ? 'active' : ''}`}
                            onClick={() => handleSelect(lang.label)}
                        >
                            {lang.icon}
                            <span>{lang.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .code-lang-node {
                    background: linear-gradient(135deg, #059669 0%, #065f46 100%);
                    border: 2px solid #059669;
                    border-radius: 14px;
                    min-width: 280px;
                    box-shadow: 0 6px 20px rgba(5, 150, 105, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    color: white;
                }
                .code-lang-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(5, 150, 105, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .code-lang-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #059669, #065f46);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    flex: 1;
                }
                .code-lang-tag {
                    font-size: 9px;
                    background: #d1fae5;
                    color: #065f46;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .code-lang-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    color: #4b5563;
                }
                .instruction {
                    font-size: 10px;
                    font-weight: 700;
                    color: #9ca3af;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .lang-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .lang-chip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: #f3f4f6;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #4b5563;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #e5e7eb;
                }
                .lang-chip:hover {
                    background: #e5e7eb;
                    transform: translateY(-1px);
                }
                .lang-chip.active {
                    background: #059669;
                    color: white;
                    border-color: #059669;
                    box-shadow: 0 4px 10px rgba(5, 150, 105, 0.2);
                }
            `}</style>
        </div>
    );
};

export default memo(CodeLanguageNode);
