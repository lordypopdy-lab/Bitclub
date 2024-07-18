import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId='170268353832-0fn4qbgklemeb9s0o5elvi99ronia9ov.apps.googleusercontent.com'>
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
