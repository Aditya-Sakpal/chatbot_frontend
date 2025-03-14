import './index.css'
import {SignedOut, RedirectToSignIn} from "@clerk/clerk-react";

const Page = () => {

    return (
        <>
            <div className="auth-container">
                <SignedOut>
                    <RedirectToSignIn
                        path="/admin-panel"
                        fallbackRedirectUrl={'/admin-panel'}
                        redirectUrl={'/admin-panel'}
                    />
                </SignedOut>
            </div>
        </>
    );
};

export default Page;