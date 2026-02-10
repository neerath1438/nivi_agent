import React, { useState } from 'react';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import Terminal from './Terminal';

const IDEView = ({ ideData, onUpdateFile, onToggleFullscreen }) => {
    const [selectedFile, setSelectedFile] = useState(ideData.files[0] || null);
    const [files, setFiles] = useState(ideData.files);
    const [isTerminalVisible, setIsTerminalVisible] = useState(true);
    const [terminalCommand, setTerminalCommand] = useState('');

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const handleSave = (path, newContent) => {
        const updatedFiles = files.map(f =>
            f.path === path ? { ...f, content: newContent } : f
        );
        setFiles(updatedFiles);
        setSelectedFile(updatedFiles.find(f => f.path === path));

        if (onUpdateFile) {
            onUpdateFile(path, newContent, updatedFiles);
        }
    };

    const handleRun = (path) => {
        setIsTerminalVisible(true);
        // Simulate a command based on the file type
        const ext = path.split('.').pop();
        if (ext === 'py') {
            setTerminalCommand(`python ${path}`);
        } else if (ext === 'js' || ext === 'jsx') {
            setTerminalCommand(`node ${path}`);
        } else {
            setTerminalCommand(`echo "Running ${path}..."`);
        }
    };

    const handleMenuClick = (menu) => {
        if (menu === 'Terminal') {
            setIsTerminalVisible(!isTerminalVisible);
        }
    };

    const projectName = ideData?.project_name?.toUpperCase() || 'GENERATED PROJECT';

    return (
        <div className="ide-layout">
            <TopBar
                projectName={projectName}
                onMenuClick={handleMenuClick}
                onToggleFullscreen={onToggleFullscreen}
            />

            <div className="ide-main-content">
                <div className="ide-sidebar">
                    <div className="activity-bar">
                        <div className="action-icon active">📄</div>
                        <div className="action-icon">🔍</div>
                        <div className="action-icon">🛠️</div>
                        <div className="action-bar-footer">
                            <div className="action-icon">⚙️</div>
                        </div>
                    </div>
                    <div className="side-panel">
                        <FileExplorer
                            files={files}
                            onFileSelect={handleFileSelect}
                            selectedFile={selectedFile}
                            projectName={projectName}
                        />
                    </div>
                </div>

                <div className="ide-editor-area">
                    <div className="editor-container">
                        <CodeEditor
                            file={selectedFile}
                            onSave={handleSave}
                            onRun={handleRun}
                        />
                    </div>

                    <Terminal
                        isVisible={isTerminalVisible}
                        onClose={() => setIsTerminalVisible(false)}
                        autoCommand={terminalCommand}
                        projectName={projectName}
                        physicalPath={ideData?.backend_path || ideData?.physical_path}
                    />
                </div>
            </div>

            <StatusBar
                line={1}
                col={1}
                language={selectedFile?.path.split('.').pop() === 'py' ? 'Python' : 'JavaScript'}
                projectName={projectName}
            />

            <style jsx>{`
                .ide-layout {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #1e1e1e;
                    color: #d1d1d1;
                    overflow: hidden;
                }
                .ide-main-content {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                }
                .ide-sidebar {
                    width: 300px;
                    height: 100%;
                    display: flex;
                    background: #252526;
                    border-right: 1px solid #2b2b2b;
                }
                .activity-bar {
                    width: 48px;
                    height: 100%;
                    background: #333333;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 12px;
                    gap: 16px;
                }
                .action-icon {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0.4;
                    transition: all 0.2s;
                }
                .action-icon.active {
                    opacity: 1;
                    border-left: 2px solid #fff;
                }
                .action-icon:hover {
                    opacity: 1;
                }
                .action-bar-footer {
                    margin-top: auto;
                    padding-bottom: 20px;
                }
                .side-panel {
                    flex: 1;
                    height: 100%;
                    overflow: hidden;
                }
                .ide-editor-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .editor-container {
                    flex: 1;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default IDEView;
