import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './components/header/page.jsx'
import Body from './components/body/page.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Body />
    <Header />
  </StrictMode>,
)


