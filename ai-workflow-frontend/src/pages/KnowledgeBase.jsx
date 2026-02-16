import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFiles } from '../store/workflowSlice';
import axios from 'axios';

const KnowledgeBase = () => {
    const dispatch = useDispatch();
    const files = useSelector(state => state.workflow.files);

    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (files.length === 0) {
            fetchFiles();
        }
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/knowledge/files');
            dispatch(setFiles(response.data));
        } catch (err) {
            console.error("Failed to fetch files", err);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/api/knowledge/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchFiles(); // Force update Redux after upload
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;
        try {
            await axios.delete(`/api/knowledge/files/${id}`);
            fetchFiles(); // Force update Redux after delete
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="kb-container">
            <div className="kb-header">
                <h1>📚 Knowledge Base</h1>
                <p>Upload your documents (PDF, Excel, JSON, CSV) to train your AI agents.</p>
            </div>

            <div
                className={`upload-zone ${dragActive ? 'active' : ''} ${isUploading ? 'loading' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    hidden
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">{isUploading ? '⏳' : '📤'}</div>
                    <div className="upload-text">
                        {isUploading ? 'Uploading & Analyzing...' : 'Drag & Drop or Click to Upload'}
                    </div>
                    <div className="upload-subtext">Supports PDF, Excel, JSON, CSV, TXT</div>
                </label>
            </div>

            <div className="file-list-section">
                <h2>Your Documents ({files.length})</h2>
                <div className="file-grid">
                    {files.map(file => (
                        <div key={file.id} className="file-card">
                            <div className="file-icon">
                                {file.name.endsWith('.pdf') ? '📄' :
                                    file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? '📊' :
                                        file.name.endsWith('.json') ? '📦' : '📝'}
                            </div>
                            <div className="file-info">
                                <div className="file-name" title={file.name}>{file.name}</div>
                                <div className="file-meta">{(file.size / 1024).toFixed(1)} KB • {file.type}</div>
                            </div>
                            <button className="file-delete" onClick={() => handleDelete(file.id)}>✕</button>
                        </div>
                    ))}
                    {files.length === 0 && (
                        <div className="empty-state">No documents uploaded yet.</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .kb-container { padding: 40px; max-width: 1000px; margin: 0 auto; color: #fff; }
                .kb-header { margin-bottom: 40px; }
                 h1 { font-size: 32px; font-weight: 800; margin-bottom: 10px; background: linear-gradient(135deg, #a855f7, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .kb-header p { color: #9ca3af; font-size: 16px; }

                .upload-zone {
                    border: 2px dashed #4b5563;
                    border-radius: 20px;
                    padding: 60px;
                    text-align: center;
                    background: rgba(31, 41, 55, 0.4);
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 60px;
                }
                .upload-zone:hover, .upload-zone.active {
                    border-color: #8b5cf6;
                    background: rgba(139, 92, 246, 0.1);
                }
                .upload-zone.loading { opacity: 0.6; pointer-events: none; }

                .upload-icon { font-size: 48px; margin-bottom: 20px; }
                .upload-text { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
                .upload-subtext { color: #6b7280; font-size: 14px; }

                .file-list-section h2 { font-size: 20px; margin-bottom: 20px; color: #e5e7eb; }
                .file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
                
                .file-card {
                    background: #1f2937;
                    border: 1px solid #374151;
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    position: relative;
                    transition: transform 0.2s;
                }
                .file-card:hover { transform: translateY(-3px); border-color: #4b5563; }
                
                .file-icon { font-size: 28px; }
                .file-info { flex: 1; min-width: 0; }
                .file-name { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .file-meta { font-size: 12px; color: #9ca3af; margin-top: 4px; }
                
                .file-delete {
                    background: transparent;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 4px;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .file-card:hover .file-delete { opacity: 1; }
                .file-delete:hover { color: #ef4444; }

                .empty-state { grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280; }
            `}</style>
        </div>
    );
};

export default KnowledgeBase;
