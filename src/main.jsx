import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './components/UserProvider.jsx'
import { LocationProvider } from './components/LocationProvider.jsx'
import { RouteProvider } from './components/RouteProvider.jsx'

createRoot(document.getElementById('root')).render(
  


<RouteProvider>
  <LocationProvider>
  <UserProvider>
    <BrowserRouter>
    <App />
  </BrowserRouter>
</UserProvider>
</LocationProvider>

</RouteProvider>
)
