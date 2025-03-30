import { useState, useEffect } from 'react';

import { Infinity as InfinityIcon, Save } from 'lucide-react';

import './index.css';
import Header from './components/header/page';
import Body from './components/body/page';
import Footer from './components/footer/page';
import Swal from 'sweetalert2';

const Page = () => {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [tonality, setTonality] = useState(50);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(true);
  const [tokens, setTokens] = useState(100);
  const [messages, setMessages] = useState([]);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi'
  ];

  const getEmoji = (value) => {
    if (value < 20) return '😠';
    if (value < 40) return '😕';
    if (value < 60) return '😐';
    if (value < 80) return '🙂';
    return '😊';
  };

  const getResponseType = (tokenCount) => {
    if (tokenCount <= 200) return 'Very Concise';
    if (tokenCount <= 400) return 'Concise';
    if (tokenCount <= 600) return 'Ample';
    if (tokenCount <= 800) return 'Descriptive';
    return 'Very Descriptive';
  };

  const getSettings = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/get_settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: localStorage.getItem('user_id')
      })
    });
    const data = await response.json();
    if (response.status === 200) {
      let settings = data.settings;
      setTonality(settings.tonality);
      setSelectedLanguage(settings.language);
      setUseKnowledgeBase(settings.use_knowledge_base);
      setTokens(settings.tokens);
    }
  }

  useEffect(() => {
    getSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      console.log(localStorage.getItem('user_id'), tonality, selectedLanguage, useKnowledgeBase, tokens)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/save_settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id'),
          settings: {
            tonality,
            language: selectedLanguage,
            use_knowledge_base: useKnowledgeBase,
            tokens
          }
        })
      });

      if (response.status === 200) {
        Swal.fire({
          title: 'Success',
          text: 'Settings saved successfully!',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  const user_id = localStorage.getItem("user_id")

  const sendMessage = async (query) => {
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    const lastThreeMessages = messages.slice(-3);
    const requestData = {
      query,
      user_id,
      messages: lastThreeMessages,
      settings: {
        tonality,
        language: selectedLanguage,
        use_knowledge_base: useKnowledgeBase,
        tokens
      }
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      const botMessage = {
        role: "assistant",
        content: responseData.message,
        is_graph: responseData.is_graph || false,
        graph_data: responseData.is_graph ? {
          bar_chart: responseData.message.bar_chart,
          pie_chart: responseData.message.pie_chart
        } : null
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className='test-chatbot-container'>
      <div className='settings-container'>
        <div className='settings-inner-container'>
          <h2>Chatbot Settings</h2>
          
          <div className="settings-section">
            <label>Tonality Adjustment</label>
            <div className="tonality-slider-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={tonality} 
                onChange={(e) => setTonality(e.target.value)}
                className="tonality-slider"
              />
              <span className="emoji-indicator">{getEmoji(tonality)}</span>
            </div>
          </div>

          <div className="settings-section">
            <label>Language Selection</label>
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select"
            >
              {languages.map(lang => (
                <option key={lang.toLowerCase()} value={lang.toLowerCase()}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-section">
            <label>Use Knowledge Base</label>
            <div className="toggle-buttons">
              <button 
                className={`toggle-button ${useKnowledgeBase ? 'active' : ''}`}
                onClick={() => setUseKnowledgeBase(true)}
              >
                Yes
              </button>
              <button 
                className={`toggle-button ${!useKnowledgeBase ? 'active' : ''}`}
                onClick={() => setUseKnowledgeBase(false)}
              >
                No
              </button>
            </div>
          </div>

          <div className="settings-section">
            <label>Response Length (Tokens)</label>
            <div className="token-slider-container">
              <input 
                type="range" 
                min="100" 
                max="1000" 
                step="50"
                value={tokens} 
                onChange={(e) => setTokens(Number(e.target.value))}
                className="token-slider"
              />
              <div className="token-info">
                <span className="token-count">{tokens} tokens</span>
                <span className="response-type">{getResponseType(tokens)}</span>
              </div>
            </div>
          </div>

          <button className="save-button" onClick={handleSaveSettings}>
            <Save className="save-icon" />
            Save Settings
          </button>
        </div>
      </div>
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
    </div>
  );
};

export default Page;