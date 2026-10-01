import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  // Liferay Custom Element fallback handling if needed
  class MekoCrmPortal extends HTMLElement {
    connectedCallback() {
      createRoot(this).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  }
  
  if (!customElements.get('meko-crm-portal')) {
    customElements.define('meko-crm-portal', MekoCrmPortal);
  }
}
