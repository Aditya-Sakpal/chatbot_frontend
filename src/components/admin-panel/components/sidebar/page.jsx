import './index.css'
import { Upload, History, MessageSquare, LogOut, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const Page = ({ onPageChange, selectedPage }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      title: 'Test Chatbot',
      icon: <MessageSquare className='icon' />,
      path: 'test-chatbot'
    },
    {
      title: 'Data Upload',
      icon: <Upload className='icon' />,
      path: 'data-upload'
    },
    {
      title: 'Query History',
      icon: <History className='icon' />,
      path: 'query-history'
    }
  ]




  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className='sidebar-container'>
      <div className='sidebar-content'>
        <div className='sidebar-top'>
          <h2 className='sidebar-title'>Admin Panel</h2>
        </div>
        
        <div className='sidebar-options'>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`sidebar-option ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => onPageChange(item.path)}
            >
              {item.icon}
              <p>{item.title}</p>
            </div>
          ))}
        </div>

        <div className='sidebar-profile'>
          <div className='profile-info'>
            <div className='profile-avatar'>
              <User className='profile-icon' />
            </div>
            <div className='profile-details'>
              <p className='profile-name'>{localStorage.getItem('user_name') || 'Admin User'}</p>
              <p className='profile-email'>{localStorage.getItem('user_email') || 'admin@example.com'}</p>
            </div>
          </div>
          <div className='logout-button' onClick={handleLogout}>
            <LogOut className='icon' />
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page