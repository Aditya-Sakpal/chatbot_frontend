import PropTypes from 'prop-types';

import { ChevronLeft, Search } from 'lucide-react';

import './index.css';

const Header = ({toggleChatbot}) => {
  return (
    <>
      <div className="header-container">
        <div className='close-button-div' >
          <ChevronLeft className='close-icon' onClick={toggleChatbot} />
        </div>
        <div className="header-title">
          <p className='bot-name' >Dr. MediMind AI <span className='gpt-cloud'>GPT-4</span> </p>
          <p className='bot-intro' >Your goto health care AI</p>
        </div>
        <div className='search-button-div' >
          <Search className='search-icon'/>
        </div>
      </div>
    </>
  );
};
Header.propTypes = {
  toggleChatbot: PropTypes.func.isRequired,
};

export default Header;
