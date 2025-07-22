import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './screens/Dashboard/Dashboard';
import { DealCreationLayer } from './screens/DealCreationLayer/DealCreationLayer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Deal creation route */}
        <Route path="/deal-creation" element={<DealCreationLayer />} />
        
        {/* Add placeholder routes for sidebar navigation */}
        <Route path="/deal-desk" element={<div>Deal Desk - Coming Soon</div>} />
        <Route path="/product-hub" element={<div>Product Hub - Coming Soon</div>} />
        <Route path="/customer-tower" element={<div>Customer Tower - Coming Soon</div>} />
        <Route path="/contract-vault" element={<div>Contract Vault - Coming Soon</div>} />
        <Route path="/service-pod" element={<div>Service Pod - Coming Soon</div>} />
        <Route path="/analytics-hq" element={<div>Analytics HQ - Coming Soon</div>} />
        <Route path="/alert-central" element={<div>Alert Central - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;