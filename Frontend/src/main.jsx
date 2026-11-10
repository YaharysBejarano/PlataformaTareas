import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ProveedorAutenticacion } from './contextos/ContextoAutenticacion';
import { ProveedorNotificaciones } from './contextos/ContextoNotificaciones';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProveedorNotificaciones>
        <ProveedorAutenticacion>
          <App />
        </ProveedorAutenticacion>
      </ProveedorNotificaciones>
    </BrowserRouter>
  </React.StrictMode>
);
