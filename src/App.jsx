import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Login from './components/login/page'
import TestChatbot from './components/admin-panel/components/test-chatbot/page'
import DataUpload from './components/admin-panel/components/data-upload/page'
import QueryHistory from './components/admin-panel/components/query-history/page'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin routes with shared layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="test-chatbot" replace />} />
          <Route path="test-chatbot" element={<TestChatbot />} />
          <Route path="data-upload" element={<DataUpload />} />
          <Route path="query-history" element={<QueryHistory />} />
        </Route>

        {/* Redirect root to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  )
}

export default App 