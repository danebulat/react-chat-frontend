import React    from 'react'
import ReactDOM from 'react-dom/client'
import App      from './App.jsx'

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }  from './contexts/AuthContext.jsx'
import { basename }      from './config/server.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

  <BrowserRouter basename={basename}> 
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>

  </React.StrictMode>,
)
