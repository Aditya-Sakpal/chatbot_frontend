import './index.css'
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

const page = () => {
    return (
        <>
            <div className="auth-container" >
                <SignedOut>
                    <SignIn
                        fallbackRedirectUrl={'/admin-panel'}
                        appearance={{
                            logoImageUrl:'',
                            elements: {
                                card: "shadow-lg border border-black rounded-xl",  
                                headerTitle: "text-2xl font-bold text-blue-600",  
                                socialButtonsBlockButton: "bg-blue-500 hover:bg-blue-600 text-white", 
                            },
                        }}
                    />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </>
    )
}

export default page