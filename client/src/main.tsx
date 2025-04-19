import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { store,persistor } from './redux/store.ts';
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <GoogleOAuthProvider clientId={googleClientId}>
    <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </PersistGate>
  </Provider>
  </GoogleOAuthProvider>
  </StrictMode>,
)
