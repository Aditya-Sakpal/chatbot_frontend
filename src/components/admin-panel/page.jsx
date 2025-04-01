import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from './components/sidebar/page';
import TestChatbot from './components/test-chatbot/page';
import DataUpload from './components/data-upload/page';
import QueryHistory from './components/query-history/page';
import './index.css';

const Page = () => {
  const [selectedPage, setSelectedPage] = useState('test-chatbot');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (!mobile) setIsMobileSidebarOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (page) => {
    setSelectedPage(page);
    if (isMobileView) setIsMobileSidebarOpen(false);
  };

  return (
    <div className='admin-panel-container'>
      {isMobileView && (
        <button 
          className={`mobile-toggle ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {isMobileSidebarOpen ? <ChevronLeft className="icon" /> : <ChevronRight className="icon" />}
        </button>
      )}

      <div className={`admin-panel-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <Sidebar onPageChange={handlePageChange} selectedPage={selectedPage} />
      </div>

      <div className='admin-panel-content'>
        {selectedPage === 'test-chatbot' && <TestChatbot />}
        {selectedPage === 'data-upload' && <DataUpload />}
        {selectedPage === 'query-history' && <QueryHistory />}
      </div>
    </div>
  );
};

export default Page;