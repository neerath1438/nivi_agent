import React, { useState, useEffect, useRef } from "react";
import './UserProfileDropdown.css';

// Icon Components
const User = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const Settings = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6" />
        <path d="M1 12h6m6 0h6" />
    </svg>
);

const CreditCard = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

const HelpCircle = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);

const LogOut = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

// Dropdown Menu Component
const DropdownMenu = ({ children, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTriggerClick = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <div onClick={handleTriggerClick} className="dropdown-trigger">
                {trigger}
            </div>
            {isOpen && (
                <div className="dropdown-menu" role="menu" aria-orientation="vertical">
                    {children}
                </div>
            )}
        </div>
    );
};

// Dropdown Menu Item
const DropdownMenuItem = ({ children, onClick }) => (
    <a
        href="#"
        onClick={(e) => {
            e.preventDefault();
            if (onClick) onClick();
        }}
        className="dropdown-menu-item"
        role="menuitem"
    >
        {children}
    </a>
);

// Dropdown Menu Separator
const DropdownMenuSeparator = () => <div className="dropdown-separator" />;

// Main UserProfileDropdown Component
const UserProfileDropdown = () => {
    return (
        <div className="user-profile-dropdown-wrapper">
            <DropdownMenu
                trigger={
                    <button className="profile-trigger-button">
                        <div className="profile-avatar">JD</div>
                        <div className="profile-info">
                            <div className="profile-name">John Doe</div>
                            <div className="profile-email">john@example.com</div>
                        </div>
                    </button>
                }
            >
                <div className="dropdown-header">
                    <div className="header-content">
                        <div className="header-avatar">JD</div>
                        <div>
                            <div className="header-name">John Doe</div>
                            <div className="header-email">john@example.com</div>
                            <div className="header-plan">Pro Plan</div>
                        </div>
                    </div>
                </div>

                <div className="dropdown-section">
                    <DropdownMenuItem onClick={() => console.log("Profile")}>
                        <User className="menu-icon" />
                        Your Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Settings")}>
                        <Settings className="menu-icon" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Billing")}>
                        <CreditCard className="menu-icon" />
                        Billing & Plans
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                <div className="dropdown-section">
                    <DropdownMenuItem onClick={() => console.log("Help")}>
                        <HelpCircle className="menu-icon" />
                        Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Sign out")}>
                        <LogOut className="menu-icon" />
                        Sign Out
                    </DropdownMenuItem>
                </div>
            </DropdownMenu>
        </div>
    );
};

export default UserProfileDropdown;
