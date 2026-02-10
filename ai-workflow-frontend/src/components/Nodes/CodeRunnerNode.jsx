import { Handle, Position, useNodes } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const CodeRunnerNode = ({ id, data, isConnectable }) => {
    const nodes = useNodes();

    // 1. Detect self-type
    const self = nodes.find(n => n.id === id);
    const nodeType = self?.type || 'pythonRunner';

    // 2. Load code dynamic based on type
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode(nodeType);

    // 3. Detect language context from connected stack nodes
    const backendNode = nodes.find(n => n.type === 'backendLanguage');
    const frontendNode = nodes.find(n => n.type === 'frontendLanguage');

    // Priority: Stack node choice > Self-type preference > Default
    const selectedLang = backendNode?.data?.language || frontendNode?.data?.stack || data.backend_lang;

    const isReactType = nodeType === 'reactRunner';
    const isPythonType = nodeType === 'pythonRunner';

    const isNode = selectedLang?.includes('Node.js');
    const isFrontendContext = selectedLang?.includes('React') || selectedLang?.includes('Next.js') || selectedLang?.includes('Vue');

    // Define Visual Theme
    let theme = {
        primary: '#3776ab',
        secondary: '#ffd43b',
        icon: '🐍',
        title: 'Python Runner',
        glow: 'rgba(55, 118, 171, 0.3)',
        badge: 'Python Engine',
        styleClass: 'python'
    };

    if (isReactType || isFrontendContext) {
        theme = {
            primary: '#ec4899',
            secondary: '#a855f7',
            icon: '⚛️',
            title: 'React Runner',
            glow: 'rgba(236, 72, 153, 0.3)',
            badge: 'UI Engine',
            styleClass: 'frontend'
        };
    } else if (isNode) {
        theme = {
            primary: '#339933',
            secondary: '#000000',
            icon: '📦',
            title: 'Node.js Runner',
            glow: 'rgba(51, 153, 51, 0.3)',
            badge: 'Node.js Engine',
            styleClass: 'node'
        };
    }

    return (
        <>
            <div className={`code-runner-node ${theme.styleClass}-theme`}>
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div className="code-runner-node-header">
                    <div className="code-runner-node-icon">{theme.icon}</div>
                    <div className="code-runner-node-title">{theme.title}</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="code-runner-node-body">
                    <div className={`engine-badge ${theme.styleClass}`}>
                        {theme.badge}
                    </div>

                    <div className="node-info-card">
                        <div className="info-label">Active Runtime</div>
                        <div className="info-value">{selectedLang || (isReactType ? 'React + Tailwind' : 'Python (Standard)')}</div>
                        {data.attempts > 1 && (
                            <div className="healing-badge">🩹 Self-Healed ({data.attempts} tries)</div>
                        )}
                    </div>

                    <div className="info-text">
                        Dynamic Code Generation ⚡
                        <br />
                        <small>Auto-switches language based on Backend Stack</small>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <style jsx>{`
                    .code-runner-node {
                        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
                        border: 2px solid ${theme.primary};
                        border-radius: 14px;
                        min-width: 250px;
                        box-shadow: 0 6px 20px ${theme.glow};
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .code-runner-node:hover {
                        box-shadow: 0 10px 30px ${theme.glow};
                        transform: translateY(-3px);
                    }
                    .code-runner-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .code-runner-node-icon {
                        font-size: 1.4rem;
                    }
                    .code-runner-node-title {
                        font-weight: 800;
                        color: ${theme.primary};
                        font-size: 14px;
                        flex: 1;
                    }
                    .code-runner-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .engine-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 10px;
                        font-weight: 900;
                        margin-bottom: 12px;
                        border: 1px solid;
                        text-transform: uppercase;
                    }
                    .engine-badge.node { background: #e8f5e9; color: #2e7d32; border-color: #c8e6c9; }
                    .engine-badge.python { background: #e3f2fd; color: #1565c0; border-color: #bbdefb; }
                    .engine-badge.frontend { background: #fdf2f8; color: #db2777; border-color: #fbcfe8; }
                    .node-info-card {
                        background: #f8f9fa;
                        border: 1px solid #e9ecef;
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 12px;
                        text-align: left;
                    }
                    .info-label {
                        font-size: 9px;
                        color: #6c757d;
                        text-transform: uppercase;
                        font-weight: 800;
                    }
                    .info-value {
                        font-size: 12px;
                        color: #212529;
                        font-weight: 700;
                    }
                    .info-text {
                        font-size: 11px;
                        color: #4a5568;
                        font-weight: 600;
                    }
                    .info-text small {
                        display: block;
                        margin-top: 4px;
                        font-size: 9px;
                        color: #94a3b8;
                    }
                    .healing-badge {
                        margin-top: 6px;
                        font-size: 10px;
                        background: #fffbeb;
                        color: #92400e;
                        padding: 2px 8px;
                        border-radius: 4px;
                        border: 1px solid #fef3c7;
                        font-weight: 700;
                        display: inline-block;
                    }
                `}</style>
            </div>

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="CodeRunner"
                code={code}
                filePath="app/runners/code_runner.py"
            />
        </>
    );
};

export default CodeRunnerNode;
