import MultiSelect from './MultiSelect';

const MultiSelectView = () => {
    return (
        <div style={{
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '28rem',
                margin: '0 auto'
            }}>
                <h1 style={{
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '0.5rem'
                }}>
                    Framework Multi-Select
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.875rem'
                }}>
                    Select your favorite frameworks.
                </p>
                <MultiSelect />
            </div>
        </div>
    );
};

export default MultiSelectView;
