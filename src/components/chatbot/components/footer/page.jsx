import { SendHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './index.css'

const Footer = ({ onSendMessage }) => {
  const [query, setQuery] = useState("");

  const handleSendMessage = () => {
    if (query.trim() === "") return;
    onSendMessage(query);
    setQuery("");
  };

  return (
    <div className="footer-container">
        <div className="input-field-div">
          <input
            type="text"
            placeholder="Type your query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
        </div>
        <div className="send-button-div" >
          <div className="send-button-inner-div">
            <input type="submit" className='chat-submit' />
            <SendHorizontal className="send-icon" size={25} />
          </div>
        </div>
    </div>
  );
};

Footer.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};

export default Footer;