import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DealCreationLayer } from './screens/DealCreationLayer/DealCreationLayer';
import Dashboard from './screens/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DealCreationLayer />} />
        <Route path="/deal-creation" element={<DealCreationLayer />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App; 