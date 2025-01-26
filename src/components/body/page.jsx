import React from 'react';
import { User, Infinity } from 'lucide-react';
import './index.css';

const Body = () => {
  return (
    <>
      <div className='chat-body-container'>
        <div className='chatbot-message-container'>
        <div className='bot-logo'>
            <Infinity size={33} color='grey' />
          </div>
          <p>hello, how can i help you?</p>
        </div>
        <div className='client-message-container'>
          <p>There is an accident on the road , how will you handle it?</p>
          <div className='client-logo'>
            <User size={33} color='white' />
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;
