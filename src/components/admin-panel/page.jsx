import { useEffect } from "react";

import Swal from "sweetalert2";

import Sidebar from "./components/sidebar/page"
import Card from "./components/card/page"
import './index.css'

import { useUser } from "@clerk/clerk-react";

const page = () => {
    const { user } = useUser();

    const createUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/create_user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user?.id,
                first_name: user?.firstName,    
                last_name: user?.lastName,
                email: user?.primaryEmailAddress?.emailAddress,
                created_at : user?.createdAt,
                last_sign_in_at : user?.lastSignInAt
            })
        })

        if(response.status === 200) {
            Swal.fire({
                title: "Welcome to the admin panel",
                icon: "success"
            })
        }
        else if(response.status === 400) {
            Swal.fire({
                title: "User already exists",
                icon: "error"
            })
        }
        else if(response.status === 500) {
            Swal.fire({
                title: "Internal server error",
                icon: "error"
            })
        }
        

    }
    

    useEffect(() => {
        if (user && !localStorage.getItem("isJustSignedUp")) {
            const createdAtTimestamp = new Date(user.createdAt).getTime();
            const lastSignInTimestamp = new Date(user.lastSignInAt).getTime();
            const timeDifference = Math.abs(createdAtTimestamp - lastSignInTimestamp);
            const isJustSignedUp = timeDifference <= 1000; 
    
            if (isJustSignedUp) {

                Swal.fire({
                    title: "Signing up...",
                    icon: "info",
                    allowOutsideClick: false
                })

                createUser()

            } 
            localStorage.setItem("isJustSignedUp", isJustSignedUp)
        }
    }, [user]);
    
    const cards = [
        {
            title: "Data Upload",
            description: "Upload data to the vector database via documents and links",
            link: "/admin-panel/data-upload"
        },
        {
            title: "Query History",
            description: "View the history of queries made to the chatbot",
            link: "/admin-panel/query-history"
        },
        {
            title: "Test Chatbot",
            description: "Go to the chatbot to see how it is working and to test it",
            link: "/admin-panel/test-chatbot"
        }
    ]




    return (
        <>
            <div className="admin-panel-container" >
                <Sidebar />
                <div className="cards-container">

                    {
                        cards.map((card, index) =>
                            <Card
                                key={index}
                                title={card.title}
                                description={card.description}
                                link={card.link}
                            />
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default page