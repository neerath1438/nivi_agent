import MultiStepForm from './MultiStepForm';

const MultiStepFormView = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            minHeight: '600px'
        }}>
            <MultiStepForm />
        </div>
    );
};

export default MultiStepFormView;
