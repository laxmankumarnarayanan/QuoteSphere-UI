/**
 * Layout.tsx
 * Main layout component that includes the sidebar and main content area.
 */
import React from 'react';
import Sidebar from './Sidebar';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import Breadcrumb from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: {
    label: string;
    href: string;
  }[];
}

const Layout: React.FC<LayoutProps> = ({ 
  children,
  currentPath
}) => {
  const [currentBreadcrumb, setCurrentBreadcrumb] = React.useState(currentPath);

  const handleNavigate = (path: { label: string; href: string }[]) => {
    setCurrentBreadcrumb(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative pb-[2.7vh]">
      <Sidebar onNavigate={handleNavigate} />
      <div 
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0 relative"
      >
        <Header />
        <Breadcrumb items={currentBreadcrumb} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout