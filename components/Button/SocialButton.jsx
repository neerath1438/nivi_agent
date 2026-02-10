import Button from "./Button";
import { GoogleIcon, GitHubIcon, FacebookIcon, EmailIcon, XIcon2, AppleIcon, MicrosoftIcon, SlackIcon, LinkedInIcon } from "./Icons";
import './ButtonView.css'

const SocialButton = () => {
    return (
        <div className="button-view-container">
            {/* Social Login Buttons */}
            <div className="button-section">
                <h3 className="section-title">Social Login Buttons</h3>
                <div className="button-group">
                    <Button variant="outline" iconLeft={<EmailIcon />}>
                        Login with Email
                    </Button>
                    <Button variant="outline" iconLeft={<GoogleIcon />}>
                        Continue with Google
                    </Button>
                    <Button variant="outline" iconLeft={<GitHubIcon />}>
                        Continue with GitHub
                    </Button>
                    <Button variant="outline" iconLeft={<FacebookIcon />}>
                        Login with Facebook
                    </Button>
                    <Button variant="outline" iconLeft={<XIcon2 />}>
                        Login with X
                    </Button>
                    <Button variant="outline" iconLeft={<AppleIcon />}>
                        Login with Apple
                    </Button>
                    <Button variant="outline" iconLeft={<MicrosoftIcon />}>
                        Login with Microsoft
                    </Button>
                    <Button variant="outline" iconLeft={<SlackIcon />}>
                        Login with Slack
                    </Button>
                    <Button variant="outline" iconLeft={<LinkedInIcon />}>
                        Login with LinkedIn
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SocialButton;
