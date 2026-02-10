import FileTree from './FileTree';

const ReactIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <g>
            <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)" stroke="currentColor" strokeWidth="1.5" />
        </g>
    </svg>
);

const FileTreeView = () => {
    const fileTreeData = [
        {
            name: 'public',
            type: 'folder',
            children: [
                { name: 'index.html', type: 'file' },
                { name: 'favicon.ico', type: 'file' }
            ]
        },
        {
            name: 'src',
            type: 'folder',
            children: [
                {
                    name: 'components',
                    type: 'folder',
                    children: [
                        { name: 'Button.jsx', type: 'file', icon: ReactIcon },
                        { name: 'Modal.js', type: 'file' }
                    ]
                },
                {
                    name: 'hooks',
                    type: 'folder',
                    children: [
                        { name: 'useFetch.js', type: 'file' }
                    ]
                },
                { name: 'App.jsx', type: 'file', icon: ReactIcon },
                { name: 'index.js', type: 'file' },
                { name: 'styles.css', type: 'file' }
            ]
        },
        { name: 'package.json', type: 'file' },
        { name: 'README.md', type: 'file' }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <FileTree data={fileTreeData} />
        </div>
    );
};

export default FileTreeView;
