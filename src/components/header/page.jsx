import React from 'react';

import { ChevronLeft, Search } from 'lucide-react';

import './index.css';

const Header = () => {
  return (
    <>
      <div className="header-container">
        <div className='close-button-div' >
          <ChevronLeft className='close-icon' size={25} />
        </div>
        <div className="header-title">
          <p className='bot-name' >Dr. MediMind AI <span className='gpt-cloud'>GPT-4</span> </p>
          <p className='bot-intro' >Your goto health care AI</p>
        </div>
        <div className='search-button-div' >
          <Search className='search-icon' size={25} />
        </div>
      </div>
    </>
  );
};

export default Header;
