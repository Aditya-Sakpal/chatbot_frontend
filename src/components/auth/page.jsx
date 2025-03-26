import './index.css'
import { SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Page = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const createUser = async (userData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/create_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            // Store user data in localStorage regardless of response status
            localStorage.setItem('user_id', userData.user_id);
            localStorage.setItem('user_name', `${userData.first_name} ${userData.last_name}`);
            localStorage.setItem('user_email', userData.email);

            if (response.status === 200) {
                setMessage('Account created successfully!');
            } else if (response.status === 400) {
                setMessage('Welcome back!');
            }

            setShowMessage(true);

            // Redirect after showing message
            setTimeout(() => {
                navigate('/admin-panel');
            }, 2000); // Wait 2 seconds before redirecting

        } catch (error) {
            console.error('Error creating user:', error);
            setMessage('Something went wrong. Please try again.');
            setShowMessage(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            const userData = {
                user_id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.emailAddresses[0].emailAddress,
                created_at: new Date(user.createdAt).toISOString(),
                last_sign_in_at: new Date(user.lastSignInAt).toISOString()
            };

            createUser(userData);
        }
    }, [isLoaded, user]);

    return (
        <div className="auth-container">
            {isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Setting up your account...</p>
                </div>
            ) : showMessage ? (
                <div className={`message-container ${message.includes('successfully') ? 'success' : 'welcome'}`}>
                    <p>{message}</p>
                </div>
            ) : (
                <SignedOut>
                    <RedirectToSignIn />
                </SignedOut>
            )}
        </div>
    );
};

export default Page;