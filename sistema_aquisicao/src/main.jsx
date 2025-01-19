import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home1 from './pages/Component/Home1.jsx'
import Home2 from './pages/Component/Home2.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home1 />
    <Home2 />
  </StrictMode>,
)
