import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Simple test component
const TestPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Page</h1>
      <p className="text-gray-600">If you can see this, routing is working!</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Test with a simple component first */}
        <Route path="/" element={<TestPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;