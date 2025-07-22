import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DealCreationLayer } from './screens/DealCreationLayer/DealCreationLayer';
import Dashboard from './screens/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deal-creation" element={<DealCreationLayer />} />
      </Routes>
    </Router>
  );
}

export default App; 