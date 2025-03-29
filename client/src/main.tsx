import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store.ts';
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <GoogleOAuthProvider clientId={googleClientId}>
    <Provider store={store}> 
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>
  </GoogleOAuthProvider>
  </StrictMode>,
)
