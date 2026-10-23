import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fuente Inter servida desde la propia app (sin Google Fonts: no se envía la IP del usuario a Google)
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker } from './registerServiceWorker'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

registerServiceWorker()
