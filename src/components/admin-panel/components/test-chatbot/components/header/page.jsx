import PropTypes from 'prop-types';
import { ChevronLeft, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import './index.css';

const Header = ({ toggleChatbot, onSearch, onNavigateSearch, onCloseSearch }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Pass the search query to the parent component
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
    setSearchQuery('');
    onCloseSearch(); // Clear search results
  };

  return (
    <>
      <div className="header-container">
        <div className="close-button-div">
          <ChevronLeft className="close-icon" onClick={toggleChatbot} />
        </div>
        <div className="header-title">
          <p className="bot-name">
            Dr. MediMind <span className="gpt-cloud">GPT-4</span>
          </p>
          <p className="bot-intro">Your goto health care AI</p>
        </div>
        <div className="search-button-div">
          <Search className="search-icon" onClick={() => setIsSearchVisible(true)} />
        </div>
      </div>

      {/* Search Bar */}
      {isSearchVisible && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="search-navigation">
            <ChevronUp onClick={() => onNavigateSearch('up')} />
            <ChevronDown onClick={() => onNavigateSearch('down')} />
          </div>
          <X className="close-search-icon" onClick={handleCloseSearch} />
        </div>
      )}
    </>
  );
};

Header.propTypes = {
  toggleChatbot: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onNavigateSearch: PropTypes.func.isRequired,
  onCloseSearch: PropTypes.func.isRequired,
};

export default Header;