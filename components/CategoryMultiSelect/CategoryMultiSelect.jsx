import React, { useState, useRef, useEffect } from 'react';
import './CategoryMultiSelect.css';

const ALL_CATEGORIES = [
    { id: 1, name: 'Technology', value: 'technology', icon: '💻', description: 'Tech-related content', count: 245 },
    { id: 2, name: 'Design', value: 'design', icon: '🎨', description: 'UI/UX and visual design', count: 189 },
    { id: 3, name: 'Business', value: 'business', icon: '💼', description: 'Business and entrepreneurship', count: 156 },
    { id: 4, name: 'Marketing', value: 'marketing', icon: '📈', description: 'Marketing and growth', count: 134 },
    { id: 5, name: 'Education', value: 'education', icon: '📚', description: 'Learning and tutorials', count: 298 },
    { id: 6, name: 'Health', value: 'health', icon: '🏥', description: 'Health and wellness', count: 87 },
    { id: 7, name: 'Travel', value: 'travel', icon: '✈️', description: 'Travel and adventure', count: 76 },
    { id: 8, name: 'Food', value: 'food', icon: '🍕', description: 'Recipes and cooking', count: 123 },
    { id: 9, name: 'Sports', value: 'sports', icon: '⚽', description: 'Sports and fitness', count: 98 },
    { id: 10, name: 'Entertainment', value: 'entertainment', icon: '🎬', description: 'Movies, music, and fun', count: 167 }
];

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cat-multiselect-x">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cat-multiselect-check">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const HashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cat-multiselect-hash">
        <line x1="4" x2="20" y1="9" y2="9" />
        <line x1="4" x2="20" y1="15" y2="15" />
        <line x1="10" x2="8" y1="3" y2="21" />
        <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
);

const CategoryMultiSelect = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([ALL_CATEGORIES[0], ALL_CATEGORIES[1]]);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCategories = ALL_CATEGORIES.filter(
        (category) =>
            !selectedCategories.some((selected) => selected.id === category.id) &&
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.some((c) => c.id === category.id)
                ? prev.filter((c) => c.id !== category.id)
                : [...prev, category]
        );
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const removeCategory = (category) => {
        setSelectedCategories(selectedCategories.filter((c) => c.id !== category.id));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && searchTerm === '' && selectedCategories.length > 0) {
            removeCategory(selectedCategories[selectedCategories.length - 1]);
        }

        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
                setHighlightedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % filteredCategories.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + filteredCategories.length) % filteredCategories.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCategories[highlightedIndex]) {
                    toggleCategory(filteredCategories[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(0);
        }
    }, [isOpen, searchTerm]);

    return (
        <div className="cat-multiselect-wrapper" ref={wrapperRef}>
            <div className="cat-multiselect-container">
                <div
                    className="cat-multiselect-input-area"
                    onClick={() => {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    }}
                >
                    {selectedCategories.map((category) => (
                        <div key={category.id} className="cat-multiselect-tag">
                            <span className="cat-tag-icon">{category.icon}</span>
                            <HashIcon />
                            <span className="cat-tag-name">{category.name}</span>
                            <span className="cat-tag-count">{category.count}</span>
                            <button
                                type="button"
                                className="cat-tag-remove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeCategory(category);
                                }}
                            >
                                <XIcon />
                            </button>
                        </div>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedCategories.length === 0 ? 'Select categories...' : ''}
                        className="cat-multiselect-input"
                    />
                </div>

                {isOpen && (
                    <div className="cat-multiselect-dropdown">
                        <ul className="cat-multiselect-list">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category, index) => (
                                    <li
                                        key={category.id}
                                        className={`cat-multiselect-option ${highlightedIndex === index ? 'cat-option-highlighted' : ''
                                            }`}
                                        onClick={() => toggleCategory(category)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        <div className="cat-option-content">
                                            <span className="cat-option-emoji">{category.icon}</span>
                                            <div className="cat-option-info">
                                                <div className="cat-option-header">
                                                    <span className="cat-option-name">{category.name}</span>
                                                    <span className="cat-option-count-badge">{category.count}</span>
                                                </div>
                                                <span className="cat-option-description">{category.description}</span>
                                            </div>
                                        </div>
                                        {selectedCategories.some((c) => c.id === category.id) && <CheckIcon />}
                                    </li>
                                ))
                            ) : (
                                <li className="cat-multiselect-empty">No categories found.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryMultiSelect;
