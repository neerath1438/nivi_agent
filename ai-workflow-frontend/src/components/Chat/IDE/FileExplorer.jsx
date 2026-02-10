import React, { useState } from 'react';
import {
    FileCode, Folder, FolderOpen, ChevronRight, ChevronDown,
    FilePlus, FolderPlus, RotateCw, Layers, FileText, Hash, Key
} from 'lucide-react';

const FileExplorer = ({ files, onFileSelect, selectedFile, projectName }) => {
    const [expandedFolders, setExpandedFolders] = useState(['app', 'app/api', 'app/models', 'app/services']);

    const toggleFolder = (path) => {
        setExpandedFolders(prev =>
            prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
        );
    };

    // Helper to build tree structure
    const buildTree = (fileList) => {
        const root = {};
        fileList.forEach(file => {
            const parts = file.path.split('/');
            let current = root;
            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    current[part] = { _isFile: true, ...file };
                } else {
                    if (!current[part]) current[part] = { _isFolder: true, _path: parts.slice(0, index + 1).join('/') };
                    current = current[part];
                }
            });
        });
        return root;
    };

    const tree = buildTree(files);

    const renderTree = (node, name, depth = 0) => {
        const isFolder = node._isFolder;
        const isFile = node._isFile;
        const path = node._path || node.path;
        const isExpanded = expandedFolders.includes(path);

        if (isFolder) {
            return (
                <div key={path} className="tree-node">
                    <div
                        className="tree-folder"
                        style={{ paddingLeft: `${depth * 12 + 12}px` }}
                        onClick={() => toggleFolder(path)}
                    >
                        <span className="chevron-icon">
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                        <span className="folder-icon">
                            {isExpanded ? <FolderOpen size={16} color="#dcb67a" /> : <Folder size={16} color="#dcb67a" />}
                        </span>
                        <span className="folder-name">{name}</span>
                    </div>
                    {isExpanded && (
                        <div className="folder-children">
                            {Object.entries(node)
                                .filter(([key]) => !key.startsWith('_'))
                                .sort(([aName, aNode], [bName, bNode]) => {
                                    if (aNode._isFolder && !bNode._isFolder) return -1;
                                    if (!aNode._isFolder && bNode._isFolder) return 1;
                                    return aName.localeCompare(bName);
                                })
                                .map(([childName, childNode]) => renderTree(childNode, childName, depth + 1))
                            }
                        </div>
                    )}
                </div>
            );
        }

        if (isFile) {
            const isSelected = selectedFile?.path === node.path;
            const extension = node.path.split('.').pop();

            const getIcon = (ext) => {
                if (['py'].includes(ext)) return <FileCode size={16} color="#3776ab" />;
                if (['js', 'jsx'].includes(ext)) return <FileCode size={16} color="#f7df1e" />;
                if (['css'].includes(ext)) return <Hash size={16} color="#264de4" />;
                if (['html'].includes(ext)) return <FileCode size={16} color="#e34c26" />;
                if (['env'].includes(ext)) return <Key size={16} color="#f5bb00" />;
                return <FileText size={16} color="#858585" />;
            };

            return (
                <div
                    key={node.path}
                    className={`tree-file ${isSelected ? 'selected' : ''}`}
                    style={{ paddingLeft: `${depth * 12 + 28}px` }}
                    onClick={() => onFileSelect(node)}
                >
                    <span className="file-icon">{getIcon(extension)}</span>
                    <span className="file-name">{name}</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="file-explorer">
            <div className="explorer-header">
                <span className="header-label">EXPLORER</span>
                <div className="header-actions">
                    <div className="action-icon" title="New File"><FilePlus size={14} /></div>
                    <div className="action-icon" title="New Folder"><FolderPlus size={14} /></div>
                    <div className="action-icon" title="Refresh"><RotateCw size={14} /></div>
                    <div className="action-icon" title="Collapse All"><Layers size={14} /></div>
                </div>
            </div>

            <div className="explorer-project-root">
                <ChevronDown size={14} />
                <span className="project-root-name">{projectName}</span>
            </div>

            <div className="explorer-content">
                {Object.entries(tree)
                    .filter(([key]) => !key.startsWith('_'))
                    .sort(([aName, aNode], [bName, bNode]) => {
                        if (aNode._isFolder && !bNode._isFolder) return -1;
                        if (!aNode._isFolder && bNode._isFolder) return 1;
                        return aName.localeCompare(bName);
                    })
                    .map(([name, node]) => renderTree(node, name))}
            </div>

            <style jsx>{`
                .file-explorer {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                    color: #cccccc;
                    font-size: 13px;
                }
                .explorer-header {
                    padding: 8px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #bbbbbb;
                    letter-spacing: 0.5px;
                }
                .header-actions {
                    display: flex;
                    gap: 5px;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .file-explorer:hover .header-actions {
                    opacity: 1;
                }
                .action-icon {
                    padding: 2px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .action-icon:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .explorer-project-root {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px;
                    font-weight: 700;
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    font-size: 11px;
                }
                .explorer-content {
                    flex: 1;
                    overflow-y: auto;
                    padding-top: 4px;
                }
                .tree-folder, .tree-file {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    height: 22px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: background 0.1s;
                }
                .tree-folder:hover, .tree-file:hover {
                    background: #2a2d2e;
                }
                .tree-file.selected {
                    background: #37373d;
                    color: #ffffff;
                }
                .chevron-icon {
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #858585;
                }
                .folder-icon {
                    display: flex;
                    align-items: center;
                }
                .file-icon {
                    display: flex;
                    align-items: center;
                }
                .folder-name, .file-name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `}</style>
        </div>
    );
};

export default FileExplorer;

