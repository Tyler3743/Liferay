import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} else {
  class CustomElement extends HTMLElement {
    connectedCallback() {
      createRoot(this).render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    }
  }
  if (!customElements.get('meko-crm-term')) {
    customElements.define('meko-crm-term', CustomElement);
  }
}
