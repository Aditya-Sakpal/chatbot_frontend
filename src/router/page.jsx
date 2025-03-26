import { Route,Routes } from 'react-router-dom';

import AdminPanel from '../components/admin-panel/page'
import Auth from '../components/auth/page'

const page = () => {
  return (
    <>
        <Routes>
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/auth" element={<Auth />} />
        </Routes>
    </>
  )
}

export default page