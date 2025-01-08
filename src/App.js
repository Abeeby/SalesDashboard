import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VintedDashboard from './components/VintedDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<VintedDashboard />} />
      </Routes>
    </div>
  );
}

export default App; 