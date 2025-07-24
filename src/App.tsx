import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './screens/Dashboard/Dashboard';
import DealCreationPage from './screens/DealCreationLayer/DealCreationPage';
import Underwriter from './screens/Underwriter/Underwriter';

// Simple test component wrapped in Layout
const TestPage = () => (
  <Layout currentPath={[{ label: 'Test', href: '/test' }]}>
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">QuoteSphere</h1>
        <p className="text-gray-600 mb-4">Layout component is working!</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">If you can see this with header, sidebar, and footer, the Layout is working.</p>
          <p className="text-sm text-gray-500">Next step: Add the Dashboard component.</p>
        </div>
      </div>
    </div>
  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deal-creation" element={<DealCreationPage />} />
        <Route path="/underwriter" element={<Underwriter />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/*" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;