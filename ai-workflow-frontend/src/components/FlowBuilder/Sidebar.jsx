import React, { useState } from 'react';

const nodeTypes = [
    { type: 'chatInput', label: 'Chat Input', icon: '💬', description: 'User message input' },
    { type: 'promptTemplate', label: 'Prompt Template', icon: '📝', description: 'Format prompt with variables' },
    { type: 'openai', label: 'OpenAI Config', icon: '⚙️', description: 'GPT models' },
    { type: 'gemini', label: 'Gemini Config', icon: '🔷', description: 'Google Gemini' },
    { type: 'claude', label: 'Claude Config', icon: '🟣', description: 'Anthropic Claude' },
    { type: 'llm', label: 'LLM Execute', icon: '🤖', description: 'Run any LLM' },
    { type: 'summarization', label: 'AI Summarize', icon: '✨', description: 'Smart multi-provider summarization' },
    { type: 'elasticsearch', label: 'Elasticsearch', icon: '🔍', description: 'Search properties' },
    { type: 'mongoDB', label: 'MongoDB', icon: '🍃', description: 'Fetch data from collections' },
    { type: 'search', label: 'Google Search', icon: '🌐', description: 'Real-time AI research' },
    { type: 'http', label: 'API Connector', icon: '🔗', description: 'Connect to external APIs' },
    { type: 'condition', label: 'Condition', icon: '⚖️', description: 'Branching logic (If/Else)' },
    { type: 'pdf', label: 'PDF Generator', icon: '📄', description: 'Create PDF documents' },
    { type: 'documentGenerator', label: 'Export Document', icon: '📝', description: 'Multi-format export (PDF/DOCX/TXT/MD)' },
    { type: 'knowledge', label: 'Knowledge Base', icon: '📚', description: 'Extract data from your docs' },
    { type: 'whatsAppInput', label: 'WhatsApp Trigger', icon: '📱', description: 'Trigger flow on message' },
    { type: 'whatsAppOutput', label: 'WhatsApp Send', icon: '📤', description: 'Reply to WhatsApp' },
    { type: 'tshirtCatalog', label: 'T-Shirt Catalog', icon: '👕', description: 'One-time catalog link delivery' },
    { type: 'greeting', label: 'SK Sports Wear', icon: '💎', description: 'Rotating 10 attractive templates' },
    { type: 'email', label: 'Email Node', icon: '📧', description: 'Configure email recipients' },
    { type: 'chatOutput', label: 'Chat Output', icon: '✅', description: 'Final response' },
    { type: 'pythonRunner', label: 'Python Runner', icon: '🐍', description: 'Run custom Python code' },
    { type: 'reactRunner', label: 'React Runner', icon: '⚛️', description: 'Run React / Node.js frontend code' },
    { type: 'uiComponents', label: 'UI Designer', icon: '🎨', description: 'Generate UI specifications' },
    { type: 'promptGenerator', label: 'Prompt Gen', icon: '🪄', description: 'Expand intent into technical details' },
    { type: 'masterPrompt', label: 'Master Prompt', icon: '💎', description: 'Structure details into Master JSON' },
    { type: 'frontendLanguage', label: 'Frontend Stack', icon: '🎨', description: 'React, Next.js, HTML + Tailwind' },
    { type: 'backendLanguage', label: 'Backend Stack', icon: '⚙️', description: 'Python, Node, Java, PHP' },
    { type: 'theme', label: 'Visual Theme', icon: '🌈', description: 'Glassmorphism, Cyberpunk, etc.' },
    { type: 'zip', label: 'Zip Utility', icon: '📦', description: 'Compress files or projects' },
    { type: 'browser', label: 'Browser Automation', icon: '🌐', description: 'Playwright-based web automation' },
    { type: 'loop', label: 'For Loop', icon: '🔄', description: 'Iterative control node' },
    { type: 'screenshot', label: 'Capture UI', icon: '📸', description: 'Take high-quality screenshot' },
    { type: 'ide', label: 'IDE Interface', icon: '💻', description: 'Integrated code editor and file explorer' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed, theme, onCreateNew }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const filteredNodes = nodeTypes.filter(node =>
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button
                className="sidebar-toggle-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
                {isCollapsed ? '›' : '‹'}
            </button>

            <div className="sidebar-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>🧩 Node Palette</h3>
                    <button className="new-flow-btn" onClick={onCreateNew}>
                        ✨ New
                    </button>
                </div>
                <div className="sidebar-search-container">
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        className="sidebar-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-nodes">
                    {filteredNodes.length > 0 ? (
                        filteredNodes.map((node) => (
                            <div
                                key={node.type}
                                className="sidebar-node"
                                onDragStart={(e) => onDragStart(e, node.type)}
                                draggable
                            >
                                <span className="sidebar-node-icon">{node.icon}</span>
                                <div className="sidebar-node-content">
                                    <div className="sidebar-node-label">{node.label}</div>
                                    <div className="sidebar-node-desc">{node.description}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="sidebar-no-results">No nodes found</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .sidebar {
                    width: 280px;
                    background: var(--bg-primary);
                    display: flex;
                    flex-direction: column;
                    overflow: visible;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 100;
                    border-right: 1px solid var(--border-color);
                }

                .sidebar.collapsed {
                    width: 0;
                    margin-left: -1px;
                }

                .sidebar.collapsed * {
                    opacity: 0;
                    pointer-events: none;
                }

                .sidebar-toggle-btn {
                    position: absolute;
                    right: -12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 48px;
                    background: #ffffff;
                    border: none;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    cursor: pointer;
                    z-index: 1000;
                    transition: all 0.2s;
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }

                .sidebar-toggle-btn:hover {
                    background: #f5f5f7;
                    transform: translateY(-50%) scale(1.05);
                }

                .sidebar-header {
                    padding: 24px 20px 16px;
                    background: transparent !important;
                    border-bottom: none !important;
                }

                .sidebar-header h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 16px;
                    letter-spacing: -0.02em;
                }

                .sidebar-search-container {
                    margin-bottom: 10px;
                }

                .sidebar-search-input {
                    width: 100%;
                    padding: 10px 14px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    color: var(--text-primary);
                    outline: none;
                }

                .sidebar-search-input:focus {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15);
                }

                .sidebar-search-input:focus {
                    background: #ffffff;
                    border-color: #007aff;
                    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
                }

                .sidebar-content {
                    flex: 1;
                    padding: 0 15px 10px 15px;
                    overflow-y: auto;
                }

                .sidebar-no-results {
                    padding: 40px 20px;
                    text-align: center;
                    color: #86868b;
                    font-size: 0.9rem;
                    font-style: italic;
                }

                .sidebar-node {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    cursor: grab;
                    margin-bottom: 8px;
                    transition: all 0.2s;
                }
                
                .theme-light .sidebar-node {
                    background: #ffffff;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }

                .sidebar-node:hover {
                    border-color: #007aff;
                    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.1);
                    transform: translateX(4px);
                }

                .sidebar-node-label {
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                }

                .sidebar-node-desc {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                .sidebar-back-btn {
                    width: 100%;
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    color: #1d1d1f;
                    padding: 10px;
                    border-radius: 10px;
                    cursor: pointer;
                    margin-bottom: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
                }

                .sidebar-back-btn:hover {
                    background: #f5f5f7;
                    border-color: #007aff;
                }

                @keyframes slideIn {
                    from { transform: translateX(-20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .new-flow-btn {
                    padding: 6px 12px;
                    background: #edf2f7;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 700;
                    color: #4a5568;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .new-flow-btn:hover {
                    background: #e2e8f0;
                    border-color: #cbd5e0;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
};

export default Sidebar;
