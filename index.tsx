import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import posthog from 'posthog-js';

// --- POSTHOG CONFIGURATION ---
// Replace with your Project API Key from PostHog Settings
try {
  posthog.init('phc_fo8qgYNyGVcsQdLHhZpHrqXzdZPoBZzm0mnVrDRetWM', {
      api_host: 'https://us.i.posthog.com', // Change to 'https://eu.i.posthog.com' if your project is in Europe
      person_profiles: 'identified_only', 
      autocapture: true,
  });
} catch (e) {
  console.warn("PostHog initialization deferred or blocked:", e);
}
// -----------------------------

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use relative path to support subfolder deployment (e.g., GitHub Pages)
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        // Suppress expected errors in certain preview environments
        console.warn('Service Worker registration failed (common in preview environments):', error);
      });
  });
}