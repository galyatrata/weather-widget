import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://06414234c082669d9ff2e080081102e9@o4511169597079552.ingest.us.sentry.io/4511169602977792',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.PROD ? 'production' : 'development',
  replaysOnErrorSampleRate: 1.0,
});

Sentry.setUser({
  id: '12345',
  email: 'olaledovskih860@gmail.com',
  segment: 'student',
});

Sentry.setTag('project', 'weather-widget');
Sentry.setTag('university', 'lpnu');
Sentry.setTag('group', 'PP-33');

posthog.init('phc_qDpWqykcdpSVSAcffGDvwUrDGZA6FiVqG5HujnSWGpRW', {
  api_host: 'https://us.i.posthog.com',
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