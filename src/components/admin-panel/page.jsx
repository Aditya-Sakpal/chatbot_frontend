import Sidebar from "./components/sidebar/page"
import Card from "./components/card/page"

import './index.css'

const page = () => {

    const cards = [
        {
            title: "Data Upload",
            description: "Upload data to the vector database via documents and links", 
            link: "/admin-panel/data-upload"
        },
        {
            title: "Analytics",
            description: "Analyse data and queries , what users have asked to the chatbot",
            link: "/admin-panel/analytics"
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