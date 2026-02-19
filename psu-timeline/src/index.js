// src/index.js
// This is the entry point for the React application.
// It renders the root <App /> component into the HTML div with id="root".

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css'; // Global CSS resets and base styles
import App from './App';      // The root application component

// Create the React root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
