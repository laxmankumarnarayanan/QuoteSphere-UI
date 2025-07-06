/**
 * Footer.tsx
 * Footer component with FractalHive branding.
 */
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-[2.7vh] flex items-center justify-between transition-all duration-300 ease-in-out z-10">
      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm text-gray-600 dark:text-gray-300">Powered by</span>
        <img 
          src="/fractalhive-logo.png"
          alt="FractalHive"
          className="h-[1.35vh] ml-2"
        />
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 px-6">
        v1.123
      </div>
    </footer>
  );
};

export default Footer;