import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Configuration des flags futurs de React Router
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function AppWrapper() {
  return (
    <BrowserRouter {...router}>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper; 