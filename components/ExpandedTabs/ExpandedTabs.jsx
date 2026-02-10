import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './ExpandedTabs.css';

const HomeIcon = ({ className = 'icon' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const UserIcon = ({ className = 'icon' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const SettingsIcon = ({ className = 'icon' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const MailIcon = ({ className = 'icon' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const spanVariants = {
    initial: {
        width: 0,
        opacity: 0
    },
    animate: {
        width: 'auto',
        opacity: 1,
        transition: {
            delay: 0.05,
            duration: 0.2,
            ease: 'easeOut'
        }
    },
    exit: {
        width: 0,
        opacity: 0,
        transition: {
            duration: 0.1,
            ease: 'easeIn'
        }
    }
};

const ExpandedTabs = ({ tabs, className, onChange }) => {
    const [selected, setSelected] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSelected(null);
                if (onChange) onChange(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onChange]);

    const handleSelect = (index) => {
        setSelected(index);
        if (onChange) onChange(index);
    };

    const SeparatorComponent = () => (
        <div className="tab-separator" aria-hidden="true" />
    );

    return (
        <div ref={containerRef} className={`expanded-tabs-container ${className || ''}`}>
            {tabs.map((tab, index) => {
                if (tab.type === 'separator') {
                    return <SeparatorComponent key={`separator-${index}`} />;
                }

                const Icon = tab.icon;
                const isSelected = selected === index;

                return (
                    <button
                        key={tab.title}
                        onClick={() => handleSelect(index)}
                        className={`tab-button ${isSelected ? 'selected' : ''}`}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="pill"
                                className="tab-pill"
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 40
                                }}
                            />
                        )}

                        <span className="tab-content">
                            <Icon className="tab-icon" />
                            <AnimatePresence initial={false}>
                                {isSelected && (
                                    <motion.span
                                        variants={spanVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="tab-text"
                                    >
                                        {tab.title}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ExpandedTabs;
