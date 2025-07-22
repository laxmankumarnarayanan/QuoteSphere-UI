import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test component
const TestPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">QuoteSphere</h1>
      <p className="text-gray-600 mb-4">Application is working!</p>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">If you can see this, the basic setup is working.</p>
        <p className="text-sm text-gray-500">Next step: Add your components back one by one.</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/*" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;