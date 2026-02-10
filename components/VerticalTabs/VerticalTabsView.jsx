import VerticalTabs from './VerticalTabs';

const DashboardIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
);

const AnalyticsIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m22 21-2-2" />
        <path d="M16 16.28A13.84 13.84 0 0 1 22 21" />
    </svg>
);

const FileIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14,2 14,8 20,8" />
    </svg>
);

const VerticalTabsView = () => {
    const tabs = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: DashboardIcon,
            content: 'Welcome to your dashboard! Here you can view an overview of all your important metrics and recent activity. The dashboard provides a comprehensive view of your data and performance indicators.',
            badge: 3
        },
        {
            id: 'analytics',
            title: 'Analytics',
            icon: AnalyticsIcon,
            content: 'Dive deep into your analytics data. View detailed reports, trends, and insights about your performance. Track key metrics and identify opportunities for growth and optimization.',
            badge: 12
        },
        {
            id: 'users',
            title: 'Users',
            icon: UsersIcon,
            content: 'Manage your user base effectively. View user profiles, activity logs, and engagement metrics. Monitor user behavior and implement strategies to improve user experience.'
        },
        {
            id: 'files',
            title: 'Files',
            icon: FileIcon,
            content: 'Organize and manage your files efficiently. Upload, download, and share documents with your team. Keep everything organized with our intuitive file management system.',
            badge: 5
        }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <VerticalTabs tabs={tabs} />
        </div>
    );
};

export default VerticalTabsView;
