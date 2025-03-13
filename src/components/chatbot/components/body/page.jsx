import { User, Infinity as InfinityIcon } from 'lucide-react';
import './index.css';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useMemo } from 'react';
import TypingAnimation from './typingAnimation';

const Body = ({ messages, searchQuery, onSearchResult }) => {
  const allMessages = useMemo(() => {
    const welcomeMessage = {
      role: "assistant",
      content: "Hello! I'm Dr. MediMind AI, your virtual health assistant. How can I help you today?"
    };
    return [welcomeMessage, ...messages];
  }, [messages]);
  const [isThinking, setIsThinking] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const bodyContainerRef = useRef(null);

  useEffect(() => {
    if (bodyContainerRef.current) {
      bodyContainerRef.current.scrollTop = bodyContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  useEffect(() => {
    if (allMessages.length > 0 && allMessages[allMessages.length - 1].role === "user") {
      setIsThinking(true);
    } else {
      setIsThinking(false);
    }
  }, [allMessages]);

  // Search logic
  useEffect(() => {
    if (searchQuery) {
      const results = allMessages
        .map((msg, index) => ({
          index,
          matches: msg.content.toLowerCase().includes(searchQuery.toLowerCase()),
        }))
        .filter((msg) => msg.matches);
      setSearchResults(results);
      onSearchResult(results); // Pass results to parent
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  }, [searchQuery, allMessages, onSearchResult]);

  // Navigate search results
  useEffect(() => {
    if (currentSearchIndex >= 0 && searchResults.length > 0) {
      const messageIndex = searchResults[currentSearchIndex].index;
      const messageElement = bodyContainerRef.current.querySelector(
        `.message-container:nth-child(${messageIndex + 1})`
      );
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSearchIndex, searchResults]);


  return (
    <div className="body-container" ref={bodyContainerRef}>
      {allMessages.map((msg, index) => {
        const isMatch = searchResults.some((result) => result.index === index);
        return (
          <div
            key={index}
            className={`${msg.role === "user" ? "client-message-container" : "chatbot-message-container"} message-container ${isMatch ? 'highlight' : ''}`}
          >
            {msg.role === "assistant" && (
              <div className="bot-logo">
                <InfinityIcon color="grey" />
              </div>
            )}
            <p className={msg.role === "user" ? "client-message" : "bot-message"}>
              {msg.role === "assistant" ? (
                <TypingAnimation message={msg.content} speed={20} />
              ) : (
                searchQuery
                  ? msg.content.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                      part.toLowerCase() === searchQuery.toLowerCase() ? (
                        <span key={i} className="highlight-text">
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )
                  : msg.content
              )}
            </p>
            {msg.role === "user" && (
              <div className="client-logo">
                <User color="white" />
              </div>
            )}
          </div>
        );
      })}

      {isThinking && (
        <div className="thinking-container">
          <div className="typing-dots">
            <span>Thinking</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      )}
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
  searchQuery: PropTypes.string,
  onSearchResult: PropTypes.func.isRequired,
};

export default Body;