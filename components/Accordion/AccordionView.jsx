import Accordion from './Accordion';
import { Briefcase, Shuffle, AlertCircle, BookOpen, Wallet, Mail, ShieldCheck, MonitorPlay } from 'lucide-react';

const AccordionView = () => {
    const faqData = [
        {
            icon: <Briefcase size={20} />,
            question: 'How do I create an account?',
            answer: 'To create an account, simply click the "Sign Up" button at the top-right corner of the page and fill in your details. It only takes a minute!'
        },
        {
            icon: <Shuffle size={20} />,
            question: 'Can I change my subscription plan?',
            answer: 'Yes, you can upgrade or downgrade your subscription plan at any time from your account settings. Changes will be prorated.'
        },
        {
            icon: <AlertCircle size={20} />,
            question: 'What happens if I forget my password?',
            answer: "Don't worry! You can easily reset your password by clicking the 'Forgot Password' link on the login page. We'll send a reset link to your email."
        },
        {
            icon: <BookOpen size={20} />,
            question: 'Where can I find the user guides?',
            answer: 'All our user guides and documentation are available in the "Help" section of our website. You can also search for specific topics.'
        },
        {
            icon: <Wallet size={20} />,
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, including Visa, MasterCard, and American Express. We also support payments via PayPal.'
        },
        {
            icon: <Mail size={20} />,
            question: 'How can I contact customer support?',
            answer: 'Our support team is available 24/7. You can reach us via the contact form on our website, by email at support@example.com, or through live chat.'
        },
        {
            icon: <ShieldCheck size={20} />,
            question: 'Is my personal data secure?',
            answer: 'Absolutely. We prioritize your privacy and security. We use state-of-the-art encryption and security protocols to protect all your data.'
        },
        {
            icon: <MonitorPlay size={20} />,
            question: 'Do you have video tutorials?',
            answer: 'Yes, we have a library of video tutorials that cover all the main features of our platform. You can find them on our YouTube channel and in the "Tutorials" section.'
        }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <Accordion data={faqData} defaultOpen={0} />
        </div>
    );
};

export default AccordionView;
