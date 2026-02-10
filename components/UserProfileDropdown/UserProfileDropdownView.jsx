import UserProfileDropdown from "./UserProfileDropdown";

const UserProfileDropdownView = () => {
    return (
        <div className="user-profile-dropdown-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                    User Profile Dropdown
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    Click on the profile to open dropdown menu
                </p>
            </div>
            <UserProfileDropdown />
        </div>
    );
};

export default UserProfileDropdownView;
