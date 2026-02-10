import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './VerticalTabs.css';

const DashboardIcon = ({ className = 'icon' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
);

const AnalyticsIcon = ({ className = 'icon' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
); 

const UsersIcon = ({ className = 'icon' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m22 21-2-2" />
        <path d="M16 16.28A13.84 13.84 0 0 1 22 21" />
    </svg>
);

const FileIcon = ({ className = 'icon' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14,2 14,8 20,8" />
    </svg>
);

const VerticalTabs = ({ tabs, className }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className={`vertical-tabs-container ${className || ''}`}>
            {/* Sidebar */}
            <div className="vertical-tabs-sidebar">
                <div className="tabs-list">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`tab-item ${isActive ? 'active' : ''}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="tab-active-bg"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 30
                                        }}
                                    />
                                )}

                                <div className="tab-item-content">
                                    <Icon className="tab-icon" />
                                    <span className="tab-title">{tab.title}</span>
                                    {tab.badge && (
                                        <span className="tab-badge">{tab.badge}</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="vertical-tabs-content">
                <AnimatePresence mode="wait">
                    {tabs.map((tab) => {
                        if (activeTab !== tab.id) return null;

                        return (
                            <motion.div
                                key={tab.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="content-panel"
                            >
                                <h2 className="content-title">{tab.title}</h2>
                                <p className="content-text">{tab.content}</p>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VerticalTabs;
