import { User, Infinity as InfinityIcon } from 'lucide-react';
import './index.css';
import PropTypes from 'prop-types';

const Body = ({ messages }) => {
  return (
    <div className="body-container">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={msg.role === "user" ? "client-message-container" : "chatbot-message-container"}
        >
          {msg.role === "assistant" && (
            <div className="bot-logo">
              <InfinityIcon size={33} color="grey" />
            </div>
          )}
          <p className={msg.role === "user" ? "client-message" : "bot-message"}>{msg.content}</p>
          {msg.role === "user" && (
            <div className="client-logo">
              <User size={27} color="white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

Body.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Body;