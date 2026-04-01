import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import posthog from 'posthog-js';

posthog.init('phc_qDpWqykcdpSVSAcffGDvwUrDGZA6FiVqG5HujnSWGpRW', {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  ui_host: 'https://us.posthog.com',
  person_profiles: 'always',
  session_recording: {
    maskAllInputs: true,
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)