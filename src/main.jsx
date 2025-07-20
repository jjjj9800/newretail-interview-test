import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './assets/style.scss'
import 'bootstrap/dist/js/bootstrap';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
