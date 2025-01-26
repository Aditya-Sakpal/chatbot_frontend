import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Chatbot from './components/chatbot/page'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Chatbot />
  </StrictMode>
)


