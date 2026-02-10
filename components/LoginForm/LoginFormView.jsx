import LoginForm from './LoginForm';

const LoginFormView = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            minHeight: '600px'
        }}>
            <LoginForm />
        </div>
    );
};

export default LoginFormView;
