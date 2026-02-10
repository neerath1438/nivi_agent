import MasonryGrid from './MasonryGrid';

const initialItems = [
    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop', title: 'Misty Mountain Valley' },
    { id: 2, imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop', title: 'Lakeside Cabin' },
    { id: 3, imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop', title: 'Sunlight Through Forest' },
    { id: 4, imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop', title: 'Dramatic Mountain Peak' },
    { id: 5, imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop', title: 'Golden Hour on River' },
    { id: 6, imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800&auto=format&fit=crop', title: 'Green Rolling Hills' },
    { id: 7, imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=800&auto=format&fit=crop', title: 'Waterfall Oasis' },
    { id: 8, imageUrl: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800&auto=format&fit=crop', title: 'Crashing Ocean Waves' },
    { id: 9, imageUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=800&auto=format&fit=crop', title: 'Beach Sunset' },
    { id: 10, imageUrl: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?q=80&w=800&auto=format&fit=crop', title: 'Path in the Woods' },
    { id: 11, imageUrl: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=800&auto=format&fit=crop', title: 'Colorful Hot Air Balloons' },
    { id: 12, imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop', title: 'Starry Night Sky' },
];

const MasonryGridView = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '2rem',
                color: 'var(--text-color, #111827)'
            }}>
                Masonry Grid
            </h1>
            <MasonryGrid items={initialItems} />
        </div>
    );
};

export default MasonryGridView;
