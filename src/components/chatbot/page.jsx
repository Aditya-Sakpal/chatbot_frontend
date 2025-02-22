import { useState } from 'react';
import './index.css';
import Header from './components/header/page';
import Body from './components/body/page';
import Footer from './components/footer/page';
import { Infinity as InfinityIcon } from 'lucide-react';

const Page = () => {
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);

    const toggleChatbot = () => {
        setIsChatbotVisible(!isChatbotVisible);
    };

    return (
        <>
            <div className={`chatbot-container ${isChatbotVisible ? 'visible' : ''}`}>
                <Header toggleChatbot={toggleChatbot} />
                <Body />
                <Footer />
            </div>
            {
                !isChatbotVisible && (
                    <button className="chatbot-toggle-button" onClick={toggleChatbot}>
                        <InfinityIcon className='chatbot-toggle-icon' size={30} />
                    </button>
                )
            }
        </>
    );
};

export default Page;