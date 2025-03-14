import { Route,Routes } from 'react-router-dom';

import Chatbot from '../components/chatbot/page'
import AdminPanel from '../components/admin-panel/page'
import Auth from '../components/auth/page'
import DataUpload from '../components/admin-panel/components/data-upload/page'
import QueryHistory from '../components/admin-panel/components/query-history/page'

const page = () => {
  return (
    <>
        <Routes>
            <Route path="/admin-panel/test-chatbot" element={<Chatbot />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-panel/data-upload" element={<DataUpload />} />
            <Route path="/admin-panel/query-history" element={<QueryHistory />} />
        </Routes>
    </>
  )
}

export default page