import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {GoogleOAuthProvider} from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// TODO: Replace with your actual Google OAuth Client ID
// Get one at https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
