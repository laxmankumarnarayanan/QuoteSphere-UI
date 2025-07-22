import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DealCreationLayer } from './screens/DealCreationLayer/DealCreationLayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DealCreationLayer />} />
        <Route path="/deal-creation" element={<DealCreationLayer />} />
      </Routes>
    </Router>
  );
}

export default App; 