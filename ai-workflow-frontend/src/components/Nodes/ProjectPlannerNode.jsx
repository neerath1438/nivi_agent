import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import CodeViewModal from '../CodeViewModal';

const ProjectPlannerNode = ({ id, data, isConnectable }) => {
    const [showCode, setShowCode] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const [description, setDescription] = useState(data.description || '');

    const handleDescriptionChange = (e) => {
        const newValue = e.target.value;
        setDescription(newValue);
        if (data.onChange) {
            data.onChange(id, { ...data, description: newValue });
        }
    };

    const handleViewRunnerCode = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/code/projectPlanner');
            const result = await response.json();
            setCode(result.code);
            setShowCode(true);
        } catch (error) {
            console.error('Failed to fetch code:', error);
            alert('Failed to load runner code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="project-planner-node">
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div className="planner-header">
                    <div className="planner-icon">🏢</div>
                    <div className="planner-title">Project Architect</div>
                    <div className="planner-tag">Enterprise</div>
                    <button
                        className="code-view-btn"
                        onClick={handleViewRunnerCode}
                        disabled={loading}
                    >
                        {loading ? '⏳' : '</>'}
                    </button>
                </div>

                <div className="planner-body">
                    <div className="architect-badge">
                        FastAPI • Docker • RBAC
                    </div>

                    <div className="input-section">
                        <label>Describe your project</label>
                        <textarea
                            className="nodrag"
                            placeholder="Example: E-commerce with JWT, PostgreSQL, and Admin panel..."
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </div>

                    <div className="features-list">
                        <div className="feature-item">✅ Standard Backend (FastAPI)</div>
                        <div className="feature-item">✅ Security (JWT Cookies)</div>
                        <div className="feature-item">✅ Advanced RBAC Logic</div>
                        <div className="feature-item">✅ Docker Containerization</div>
                    </div>

                    <div className="status-footer">
                        AI-Ready Boilerplate Generator
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <style jsx>{`
                    .project-planner-node {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border: 2px solid #5a67d8;
                        border-radius: 12px;
                        min-width: 280px;
                        box-shadow: 0 10px 25px rgba(118, 75, 162, 0.3);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        overflow: hidden;
                    }
                    .project-planner-node:hover {
                        transform: translateY(-5px) scale(1.02);
                        box-shadow: 0 15px 35px rgba(118, 75, 162, 0.4);
                    }
                    .planner-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 10px 14px;
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .planner-icon {
                        font-size: 1.2rem;
                    }
                    .planner-title {
                        font-weight: 800;
                        color: #2d3748;
                        font-size: 13px;
                        flex: 1;
                        letter-spacing: -0.2px;
                    }
                    .planner-tag {
                        font-size: 8px;
                        background: #764ba2;
                        color: #fff;
                        padding: 2px 6px;
                        border-radius: 10px;
                        text-transform: uppercase;
                        font-weight: 900;
                    }
                    .code-view-btn {
                        background: #edf2f7;
                        border: none;
                        color: #4a5568;
                        border-radius: 4px;
                        padding: 4px 6px;
                        cursor: pointer;
                        font-size: 10px;
                        font-weight: bold;
                    }
                    .planner-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                    }
                    .architect-badge {
                        background: #ebf4ff;
                        color: #2b6cb0;
                        padding: 4px 10px;
                        border-radius: 4px;
                        font-size: 10px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        text-align: center;
                        border: 1px solid #bee3f8;
                    }
                    .input-section {
                        margin-bottom: 12px;
                    }
                    label {
                        display: block;
                        font-size: 10px;
                        font-weight: 700;
                        color: #718096;
                        margin-bottom: 5px;
                        text-transform: uppercase;
                    }
                    textarea {
                        width: 100%;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 10px;
                        font-size: 12px;
                        color: #2d3748;
                        background: #f7fafc;
                        min-height: 80px;
                        resize: vertical;
                        box-sizing: border-box;
                    }
                    textarea:focus {
                        outline: none;
                        border-color: #667eea;
                        background: #fff;
                        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    }
                    .features-list {
                        background: #f8fafc;
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 12px;
                    }
                    .feature-item {
                        font-size: 10px;
                        color: #4a5568;
                        font-weight: 600;
                        margin-bottom: 4px;
                        display: flex;
                        align-items: center;
                    }
                    .status-footer {
                        font-size: 9px;
                        color: #a0aec0;
                        text-align: center;
                        font-style: italic;
                    }
                `}</style>
            </div>

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="ProjectPlanner"
                code={code}
                filePath="app/runners/project_planner_runner.py"
            />
        </>
    );
};

export default ProjectPlannerNode;
