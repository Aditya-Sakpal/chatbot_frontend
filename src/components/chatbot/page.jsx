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

    const [messages, setMessages] = useState([]); 

    const user_id = "user_123"; 
    const session_id = "s_123"; 
  
    const sendMessage = async (query) => {
      setMessages((prev) => [...prev,  { role: "user", content: query }]);
      const lastThreeMessages = messages.slice(-3);
      const requestData = {
        query,
        user_id,
        session_id,
        messages: lastThreeMessages, 
      };
  
      try {
        const response = await fetch("http://localhost:8000/api/v1/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
  
        const responseData = await response.json();
        console.log(responseData);
        const botMessage = { 
          role: "assistant", 
          content: responseData.message,
          is_graph: responseData.is_graph || false,
          graph_data: responseData.is_graph ? {
            bar_chart: responseData.message.bar_chart,
            pie_chart: responseData.message.pie_chart
          } : null
        };
  
        setMessages((prev) => [...prev,  botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };
  


    return (
        <>
            <div className={`chatbot-container ${isChatbotVisible ? 'visible' : ''}`}>
                <Header toggleChatbot={toggleChatbot} />
                <Body messages={messages} />
                <Footer onSendMessage={sendMessage} />
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