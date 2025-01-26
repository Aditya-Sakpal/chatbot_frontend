import React from 'react';
import './index.css';

const Header = () => {
  return (
    <>
    <div className="header-container">
      <h1>AI Chatbot</h1>
      <button className="close-button" onClick={() => console.log("Close clicked!")}>
        &times;
      </button>
    </div>
    </>
  );
};

export default Header;
