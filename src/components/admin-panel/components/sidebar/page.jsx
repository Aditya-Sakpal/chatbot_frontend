import './index.css'
import { Upload, History, MessageSquare, LogOut, User, Mail, BarChart2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import Swal from 'sweetalert2'

const Page = ({ onPageChange, selectedPage }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(false)
  const [totalAnalysis, setTotalAnalysis] = useState(0)
  const [latestRelevantArticles, setLatestRelevantArticles] = useState([])
  const { user } = useUser()
  const { signOut } = useClerk()

  const dummyPublications = [
    "Recent Advances in Medical Imaging - 2024",
    "Neural Networks in Healthcare - 2023",
    "AI-Driven Diagnostic Tools - 2023",
    "Machine Learning in Radiology - 2023",
    "Healthcare Data Analytics - 2022"
  ];

  const handleAutoEmailToggle = async (checked) => {
    setAutoEmailEnabled(checked);
    // Add your API call here to save the preference
  };

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

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8884d8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await signOut(); // Sign out from Clerk
        localStorage.clear(); // Clear local storage
        navigate('/auth'); // Redirect to auth page
      } catch (error) {
        console.error('Error during logout:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to logout. Please try again.',
          icon: 'error'
        });
      }
    }
  };

  const countUniqueQueryIds = (data) => {
    const uniqueQueryIds = new Set();
  
    data.forEach(innerArray => {
      if (innerArray.length > 6) {
        uniqueQueryIds.add(innerArray[6]); // Assuming query_id is at index 6
      }
    });
  
    return uniqueQueryIds.size;
  };
  

  const fetchQueryHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/query_history`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id")
        })
      })
      const data = await response.json()
      const uniqueQueryCount = countUniqueQueryIds(data.message)
      console.log(data)
      setTotalAnalysis(uniqueQueryCount)
    } catch (error) {
      console.error("Error fetching query history:", error)
      setTotalAnalysis(0)
    }
  }

  const fetchLatestRelevantArticles = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_latest_relevant_publications`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",   
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id")
        })
      })
      const data = await response.json()
      console.log(data)
      setLatestRelevantArticles(data.message)
    } catch (error) {
      console.error("Error fetching latest relevant articles:", error)
      setLatestRelevantArticles([])
    }
  }
  

  useEffect(() => {
    if (isProfileOpen) {
      fetchQueryHistory()
      fetchLatestRelevantArticles()
    }
  }, [isProfileOpen])

  return (
    <>
      {isProfileOpen && (
        <div className='profile-modal' onClick={() => setIsProfileOpen(false)}>
          <div className='profile-modal-content' onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-left">
              <div className="profile-header">
                <div className="profile-image">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" />
                  ) : (
                    <User className="default-avatar" />
                  )}
                </div>
                <div className="profile-info-details">
                  <h3>{user?.fullName}</h3>
                  <p>{user?.primaryEmailAddress?.emailAddress}</p>
                  <p className="join-date">Joined {new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <BarChart2 className="stat-icon" />
                  <div className="stat-info">
                    <h4>Total Analysis</h4>
                    <p>{totalAnalysis}</p>
                  </div>
                </div>

                <div className="stat-item">
                  <Mail className="stat-icon" />
                  <div className="stat-info">
                    <h4>Auto Email Snapshots</h4>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={autoEmailEnabled}
                        onChange={(e) => handleAutoEmailToggle(e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-modal-right">
              <h3>Latest Publications</h3>
              <div className="publications-list">
                {dummyPublications.map((pub, index) => (
                  <div key={index} className="publication-item">
                    <p>{pub}</p>
                    <span className="publication-date">
                      {pub.split(' - ')[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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
              <div className='profile-details' onClick={() => setIsProfileOpen(!isProfileOpen)}>
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
    </>
  )
}

export default Page