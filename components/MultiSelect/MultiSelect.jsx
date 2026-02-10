import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.css';

const ALL_OPTIONS = [
    { id: 1, name: 'React', value: 'react' },
    { id: 2, name: 'Vue', value: 'vue' },
    { id: 3, name: 'Angular', value: 'angular' },
    { id: 4, name: 'Svelte', value: 'svelte' },
    { id: 5, name: 'Ember', value: 'ember' },
    { id: 6, name: 'Backbone', value: 'backbone' },
    { id: 7, name: 'Preact', value: 'preact' },
    { id: 8, name: 'Alpine.js', value: 'alpine' },
    { id: 9, name: 'Solid.js', value: 'solid' },
    { id: 10, name: 'Qwik', value: 'qwik' },
];

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="multiselect-x-icon">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="multiselect-check-icon">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const MultiSelect = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([ALL_OPTIONS[0], ALL_OPTIONS[2]]);
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

    const filteredOptions = ALL_OPTIONS.filter(
        (option) =>
            !selectedOptions.some((selected) => selected.id === option.id) &&
            option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (option) => {
        setSelectedOptions((prev) =>
            prev.some((o) => o.id === option.id)
                ? prev.filter((o) => o.id !== option.id)
                : [...prev, option]
        );
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const removeOption = (option) => {
        setSelectedOptions(selectedOptions.filter((o) => o.id !== option.id));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && searchTerm === '' && selectedOptions.length > 0) {
            removeOption(selectedOptions[selectedOptions.length - 1]);
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
                setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                    toggleOption(filteredOptions[highlightedIndex]);
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
        <div className="multiselect-wrapper" ref={wrapperRef}>
            <div className="multiselect-container">
                <div
                    className="multiselect-input-area"
                    onClick={() => {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    }}
                >
                    {selectedOptions.map((option) => (
                        <div key={option.id} className="multiselect-tag">
                            {option.name}
                            <button
                                type="button"
                                className="multiselect-tag-remove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeOption(option);
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
                        placeholder={selectedOptions.length === 0 ? 'Select frameworks...' : ''}
                        className="multiselect-input"
                    />
                </div>

                {isOpen && (
                    <div className="multiselect-dropdown">
                        <ul className="multiselect-list">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <li
                                        key={option.id}
                                        className={`multiselect-option ${highlightedIndex === index ? 'multiselect-option-highlighted' : ''
                                            }`}
                                        onClick={() => toggleOption(option)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        {option.name}
                                        {selectedOptions.some((o) => o.id === option.id) && <CheckIcon />}
                                    </li>
                                ))
                            ) : (
                                <li className="multiselect-empty">No options found.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiSelect;
