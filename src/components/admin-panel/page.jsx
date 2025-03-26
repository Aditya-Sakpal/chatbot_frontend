import { useState } from 'react'
import Sidebar from './components/sidebar/page'
import TestChatbot from './components/test-chatbot/page'
import DataUpload from './components/data-upload/page'
import QueryHistory from './components/query-history/page'
import './index.css'

const Page = () => {
  const [selectedPage, setSelectedPage] = useState('test-chatbot')

  const handlePageChange = (page) => {
    setSelectedPage(page)
  }

  return (
    <div className='admin-panel-container'>
      <div className='admin-panel-sidebar'>
        <Sidebar onPageChange={handlePageChange} selectedPage={selectedPage} />
      </div>
      <div className='admin-panel-content'>
        {selectedPage === 'test-chatbot' && <TestChatbot />}
        {selectedPage === 'data-upload' && <DataUpload />}
        {selectedPage === 'query-history' && <QueryHistory />}
      </div>
    </div>
  )
}

export default Page;