import PasswordInput from './PasswordInput';

const PasswordInputView = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            padding: '2rem',
            background: '#f9fafb',
            borderRadius: '8px'
        }}>
            <PasswordInput />
        </div>
    );
};

export default PasswordInputView;
