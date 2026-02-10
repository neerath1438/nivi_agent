import BlogHeader from "./BlogHeader";

const BlogHeaderView = () => {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '400px', background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
                <BlogHeader />
            </div>
            <div style={{ padding: '6rem 2rem 2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>Page Content</h2>
                <p style={{ color: '#4b5563', lineHeight: '1.6', maxWidth: '800px' }}>
                    This is a preview of the BlogHeader component. It is sticky, so it will stay at the top as you scroll within this container.
                    Try clicking the search icon or the mobile menu (resize your browser if on desktop) to see the animations and responsive behavior.
                </p>
                <div style={{ height: '800px' }}></div>
            </div>
        </div>
    );
};

export default BlogHeaderView;
