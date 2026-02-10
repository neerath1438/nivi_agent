import CategoryMultiSelect from './CategoryMultiSelect';

const CategoryMultiSelectView = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    color: 'var(--text-color, #111827)'
                }}>
                    Category Multi-Select
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.875rem'
                }}>
                    Select content categories with icons, descriptions, and item counts.
                </p>
                <CategoryMultiSelect />
            </div>
        </div>
    );
};

export default CategoryMultiSelectView;
