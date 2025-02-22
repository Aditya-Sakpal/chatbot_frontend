import { useState } from 'react';

import { Home, User, Settings } from 'lucide-react';
import { PanelRight } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

import './index.css';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const sideBarItems = [
    {
      icon: <Home />,
      text: 'Home',
    },
    {
      icon: <User />,
      text: 'Profile',
    },
    {
      icon: <Settings />,
      text: 'Settings',
    },
  ]

  return (
    <div className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <ul className="menu">
          {sideBarItems.map((item, index) => (
            <li key={index} className={`menu-item ${isExpanded ? 'menu-item-expanded' : 'menu-item-collapsed'}`}>
              {item.icon}
              {isExpanded && <span className='menu-item-text' >{item.text}</span>}
            </li>
          ))}
        </ul>
        <div className={`user-profile ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <UserButton />
          {isExpanded && <span>LogOut</span>}
        </div>
      </div>
      <div className='sidebar-closing-button' >
        <PanelRight onClick={toggleSidebar} />
      </div>
    </div>
  );
};

export default Sidebar;