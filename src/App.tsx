import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Simple test component to verify routing works
const TestDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard Test</h1>
      <p>If you can see this, routing is working!</p>
    </div>
  );
};

// Simple test component for deal creation
const TestDealCreation: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Deal Creation Test</h1>
      <p>Deal creation page is working!</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<TestDashboard />} />
        <Route path="/deal-creation" element={<TestDealCreation />} />
      </Routes>
    </Router>
  );
}

export default App;