import React, { useState } from 'react';
import './FileTree.css';

const FileIcon = () => (
    <svg className="file-tree-icon file-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const JsIcon = () => (
    <svg className="file-tree-icon js-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
        <path fill="#ffd600" d="M6,42V6h36v36H6z"></path>
        <path fill="none" stroke="#000001" strokeMiterlimit="10" strokeWidth="3.3" d="M23.783,22.352v9.819 c0,3.764-4.38,4.022-6.283,0.802"></path>
        <path fill="none" stroke="#000001" strokeMiterlimit="10" strokeWidth="3.3" d="M34.69,25.343 c-1.739-2.727-5.674-2.345-5.84,0.558c-0.214,3.757,6.768,2.938,6.247,7.107c-0.365,2.92-4.874,3.858-7.193-0.065"></path>
    </svg>
);

const HtmlIcon = () => (
    <svg className="file-tree-icon html-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
        <path fill="#E65100" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path>
        <path fill="#FF6D00" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path>
        <path fill="#FFF" d="M24,25v-4h8.6l-0.7,11.5L24,35.1v-4.2l4.1-1.4l0.3-4.5H24z M32.9,17l0.3-4H24v4H32.9z"></path>
        <path fill="#EEE" d="M24,30.9v4.2l-7.9-2.6L15.7,27h4l0.2,2.5L24,30.9z M19.1,17H24v-4h-9.1l0.7,12H24v-4h-4.6L19.1,17z"></path>
    </svg>
);

const CssIcon = () => (
    <svg className="file-tree-icon css-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
        <path fill="#0277BD" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path>
        <path fill="#039BE5" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path>
        <path fill="#FFF" d="M33.1 13L24 13 24 17 28.9 17 28.6 21 24 21 24 25 28.4 25 28.1 29.5 24 30.9 24 35.1 31.9 32.5 32.6 21 32.6 21z"></path>
        <path fill="#EEE" d="M24,13v4h-8.9l-0.3-4H24z M19.4,21l0.2,4H24v-4H19.4z M19.8,27h-4l0.3,5.5l7.9,2.6v-4.2l-4.1-1.4L19.8,27z"></path>
    </svg>
);

const ReactIcon = () => (
    <svg className="file-tree-icon react-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <g>
            <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)" stroke="currentColor" strokeWidth="1.5" />
        </g>
    </svg>
);

const FolderIcon = ({ isOpen }) => (
    <svg className="file-tree-icon folder-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        )}
    </svg>
);

const ChevronIcon = ({ isOpen }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`chevron-icon ${isOpen ? 'open' : ''}`}
    >
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const TreeIcon = ({ item, isOpen }) => {
    if (item.icon) {
        const IconComponent = item.icon;
        return <IconComponent />;
    }

    if (item.type === 'folder') {
        return <FolderIcon isOpen={isOpen} />;
    }

    if (item.name.endsWith('.js') || item.name.endsWith('.jsx')) return <JsIcon />;
    if (item.name.endsWith('.html')) return <HtmlIcon />;
    if (item.name.endsWith('.css')) return <CssIcon />;

    return <FileIcon />;
};

const TreeNode = ({ item, selectedFile, onFileSelect }) => {
    const isFolder = item.type === 'folder';
    const [isOpen, setIsOpen] = useState(isFolder);

    const handleToggle = () => {
        if (isFolder) {
            setIsOpen(!isOpen);
        } else {
            onFileSelect(item.name);
        }
    };

    const isSelected = !isFolder && selectedFile === item.name;

    return (
        <div className="tree-node">
            <div
                className={`tree-node-item ${isSelected ? 'selected' : ''}`}
                onClick={handleToggle}
            >
                <div className="tree-node-content">
                    {isFolder ? (
                        <ChevronIcon isOpen={isOpen} />
                    ) : (
                        <div className="tree-spacer"></div>
                    )}
                    <div className="tree-node-label">
                        <TreeIcon item={item} isOpen={isOpen} />
                        <span className="tree-node-name">{item.name}</span>
                    </div>
                </div>
            </div>

            <div className={`tree-children ${isOpen ? 'open' : ''}`}>
                <div className="tree-line"></div>
                {isFolder && isOpen && item.children && item.children.map((child) => (
                    <TreeNode
                        key={child.name}
                        item={child}
                        selectedFile={selectedFile}
                        onFileSelect={onFileSelect}
                    />
                ))}
            </div>
        </div>
    );
};

const FileTree = ({ data, onFileSelect }) => {
    const [selectedFile, setSelectedFile] = useState('App.jsx');

    const handleFileSelect = (fileName) => {
        setSelectedFile(fileName);
        if (onFileSelect) {
            onFileSelect(fileName);
        }
        console.log(`Selected file: ${fileName}`);
    };

    return (
        <div className="file-tree-container">
            <div className="file-tree">
                {data.map((item) => (
                    <TreeNode
                        key={item.name}
                        item={item}
                        selectedFile={selectedFile}
                        onFileSelect={handleFileSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default FileTree;
