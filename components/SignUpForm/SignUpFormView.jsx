import SignUpForm from './SignUpForm';

const SignUpFormView = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            minHeight: '600px'
        }}>
            <SignUpForm />
        </div>
    );
};

export default SignUpFormView;
