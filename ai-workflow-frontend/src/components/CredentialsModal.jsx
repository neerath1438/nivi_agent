import React, { useState, useEffect } from 'react';
import { credentialsService } from '../services/credentialsService';

const CredentialsModal = ({ isOpen, onClose }) => {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        provider: 'openai',
        value: '',
        // SMTP fields
        smtpHost: '',
        smtpPort: '587',
        smtpEmail: '',
        // PostgreSQL fields
        pgHost: '',
        pgPort: '5432',
        pgDatabase: '',
        pgUsername: '',
        // MongoDB fields
        mongoUri: '',
        mongoDatabase: '',
        // Elasticsearch fields
        esUrl: '',
        esUsername: '',
    });

    useEffect(() => {
        if (isOpen) {
            loadCredentials();
        }
    }, [isOpen]);

    const loadCredentials = async () => {
        setLoading(true);
        try {
            const data = await credentialsService.getCredentials();
            setCredentials(data);
        } catch (error) {
            console.error('Failed to load credentials:', error);
            alert('Failed to load credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                await credentialsService.updateCredential(editingId, formData);
            } else {
                await credentialsService.createCredential(formData);
            }

            // Reset form and reload
            setFormData({ name: '', provider: 'openai', value: '' });
            setShowAddForm(false);
            setEditingId(null);
            await loadCredentials();
        } catch (error) {
            console.error('Failed to save credential:', error);
            alert(error.message || 'Failed to save credential');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this credential?')) {
            return;
        }

        setLoading(true);
        try {
            await credentialsService.deleteCredential(id);
            await loadCredentials();
        } catch (error) {
            console.error('Failed to delete credential:', error);
            alert('Failed to delete credential');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (credential) => {
        setEditingId(credential.id);
        setFormData({
            name: credential.name,
            provider: credential.provider,
            value: '' // Don't populate the value for security
        });
        setShowAddForm(true);
    };

    const getProviderIcon = (provider) => {
        const icons = {
            openai: '🤖',
            gemini: '✨',
            claude: '🧠',
            smtp: '📧',
            postgresql: '🐘',
            mongodb: '🍃',
            elasticsearch: '🔍'
        };
        return icons[provider] || '🔑';
    };

    const getProviderColor = (provider) => {
        const colors = {
            openai: '#10a37f',
            gemini: '#4285f4',
            claude: '#cc785c',
            smtp: '#ea4335',
            postgresql: '#336791',
            mongodb: '#47a248',
            elasticsearch: '#005571'
        };
        return colors[provider] || '#6366f1';
    };

    if (!isOpen) return null;

    return (
        <div className="credentials-modal-overlay">
            <div className="credentials-modal" onClick={(e) => e.stopPropagation()}>
                <div className="credentials-modal-header">
                    <h2>🔑 Credentials Manager</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="credentials-modal-body">
                    {!showAddForm ? (
                        <>
                            <div className="credentials-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowAddForm(true)}
                                >
                                    ➕ Add Credential
                                </button>
                            </div>

                            {loading ? (
                                <div className="loading-state">Loading...</div>
                            ) : credentials.length === 0 ? (
                                <div className="empty-state">
                                    <p>No credentials yet. Add your first credential to get started.</p>
                                </div>
                            ) : (
                                <div className="credentials-list">
                                    {credentials.map((cred) => (
                                        <div key={cred.id} className="credential-card">
                                            <div className="credential-info">
                                                <div className="credential-icon" style={{ backgroundColor: getProviderColor(cred.provider) }}>
                                                    {getProviderIcon(cred.provider)}
                                                </div>
                                                <div className="credential-details">
                                                    <h3>{cred.name}</h3>
                                                    <span className="credential-provider">{cred.provider}</span>
                                                </div>
                                            </div>
                                            <div className="credential-actions">
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => handleEdit(cred)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-icon btn-danger"
                                                    onClick={() => handleDelete(cred.id)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="credential-form">
                            <h3>{editingId ? 'Edit Credential' : 'Add New Credential'}</h3>

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., My OpenAI Key"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Provider</label>
                                <select
                                    value={formData.provider}
                                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                    required
                                    style={{ color: '#1a1a1a' }}
                                >
                                    <optgroup label="LLM Providers">
                                        <option value="openai">OpenAI</option>
                                        <option value="gemini">Google Gemini</option>
                                        <option value="claude">Anthropic Claude</option>
                                    </optgroup>
                                    <optgroup label="Databases">
                                        <option value="postgresql">PostgreSQL</option>
                                        <option value="mongodb">MongoDB</option>
                                        <option value="elasticsearch">Elasticsearch</option>
                                    </optgroup>
                                    <optgroup label="Other">
                                        <option value="smtp">SMTP Email</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* OpenAI / Gemini / Claude - API Key */}
                            {(formData.provider === 'openai' || formData.provider === 'gemini' || formData.provider === 'claude') && (
                                <div className="form-group">
                                    <label>API Key</label>
                                    <input
                                        type="password"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        placeholder={editingId ? "Leave empty to keep current value" : "Enter API key"}
                                        required={!editingId}
                                    />
                                </div>
                            )}

                            {/* PostgreSQL - Connection Details */}
                            {formData.provider === 'postgresql' && (
                                <>
                                    <div className="form-group">
                                        <label>Host</label>
                                        <input
                                            type="text"
                                            value={formData.pgHost || ''}
                                            onChange={(e) => setFormData({ ...formData, pgHost: e.target.value })}
                                            placeholder="localhost"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Port</label>
                                        <input
                                            type="number"
                                            value={formData.pgPort || '5432'}
                                            onChange={(e) => setFormData({ ...formData, pgPort: e.target.value })}
                                            placeholder="5432"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Database Name</label>
                                        <input
                                            type="text"
                                            value={formData.pgDatabase || ''}
                                            onChange={(e) => setFormData({ ...formData, pgDatabase: e.target.value })}
                                            placeholder="my_database"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            value={formData.pgUsername || ''}
                                            onChange={(e) => setFormData({ ...formData, pgUsername: e.target.value })}
                                            placeholder="postgres"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            placeholder={editingId ? "Leave empty to keep current value" : "Enter password"}
                                            required={!editingId}
                                        />
                                    </div>
                                </>
                            )}

                            {/* MongoDB - Connection URI */}
                            {formData.provider === 'mongodb' && (
                                <>
                                    <div className="form-group">
                                        <label>Connection URI</label>
                                        <input
                                            type="text"
                                            value={formData.mongoUri || ''}
                                            onChange={(e) => setFormData({ ...formData, mongoUri: e.target.value })}
                                            placeholder="mongodb://localhost:27017"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Database Name</label>
                                        <input
                                            type="text"
                                            value={formData.mongoDatabase || ''}
                                            onChange={(e) => setFormData({ ...formData, mongoDatabase: e.target.value })}
                                            placeholder="my_database"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password (if required)</label>
                                        <input
                                            type="password"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            placeholder={editingId ? "Leave empty to keep current value" : "Enter password (optional)"}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Elasticsearch - Connection Details */}
                            {formData.provider === 'elasticsearch' && (
                                <>
                                    <div className="form-group">
                                        <label>Elasticsearch URL</label>
                                        <input
                                            type="text"
                                            value={formData.esUrl || ''}
                                            onChange={(e) => setFormData({ ...formData, esUrl: e.target.value })}
                                            placeholder="https://localhost:9200"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Username (optional)</label>
                                        <input
                                            type="text"
                                            value={formData.esUsername || ''}
                                            onChange={(e) => setFormData({ ...formData, esUsername: e.target.value })}
                                            placeholder="elastic"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password (optional)</label>
                                        <input
                                            type="password"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            placeholder={editingId ? "Leave empty to keep current value" : "Enter password (optional)"}
                                        />
                                    </div>
                                </>
                            )}

                            {/* SMTP - Multiple Fields */}
                            {formData.provider === 'smtp' && (
                                <>
                                    <div className="form-group">
                                        <label>SMTP Host</label>
                                        <input
                                            type="text"
                                            value={formData.smtpHost || ''}
                                            onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                                            placeholder="smtp.gmail.com"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>SMTP Port</label>
                                        <input
                                            type="number"
                                            value={formData.smtpPort || '587'}
                                            onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                                            placeholder="587"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.smtpEmail || ''}
                                            onChange={(e) => setFormData({ ...formData, smtpEmail: e.target.value })}
                                            placeholder="your-email@gmail.com"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Password</label>
                                        <input
                                            type="password"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            placeholder={editingId ? "Leave empty to keep current value" : "Enter password"}
                                            required={!editingId}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingId(null);
                                        setFormData({ name: '', provider: 'openai', value: '' });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <style jsx>{`
                .credentials-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }

                .credentials-modal {
                    background: var(--bg-primary);
                    border-radius: 16px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border-color);
                }

                .credentials-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--border-color);
                }

                .credentials-modal-header h2 {
                    margin: 0;
                    color: var(--text-primary);
                    font-size: 1.5rem;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }

                .close-btn:hover {
                    opacity: 1;
                }

                .credentials-modal-body {
                    padding: 1.5rem;
                    max-height: calc(80vh - 80px);
                    overflow-y: auto;
                }

                .credentials-actions {
                    margin-bottom: 1.5rem;
                }

                .credentials-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .credential-card {
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                }

                .credential-card:hover {
                    background: var(--bg-secondary);
                    border-color: var(--accent-primary);
                }

                .credential-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .credential-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .credential-details h3 {
                    margin: 0;
                    color: var(--text-primary);
                    font-size: 1rem;
                }

                .credential-provider {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.875rem;
                    text-transform: capitalize;
                }

                .credential-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-icon {
                    background: var(--bg-secondary);
                    border: none;
                    border-radius: 8px;
                    padding: 0.5rem;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.2s;
                }

                .btn-icon:hover {
                    background: var(--bg-primary);
                    box-shadow: var(--shadow);
                }

                .btn-icon.btn-danger:hover {
                    background: rgba(239, 68, 68, 0.3);
                }

                .credential-form {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1.5rem;
                }

                .credential-form h3 {
                    margin: 0 0 1.5rem 0;
                    color: var(--text-primary);
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    color: var(--text-secondary);
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 0.75rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    color: var(--text-primary);
                    font-size: 1rem;
                }

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #ff6b35;
                }

                .form-group select option {
                    background: #fff;
                    color: #1a1a1a;
                }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                }

                .empty-state,
                .loading-state {
                    text-align: center;
                    padding: 3rem 1rem;
                    color: rgba(255, 255, 255, 0.6);
                }
            `}</style>
        </div>
    );
};

export default CredentialsModal;
