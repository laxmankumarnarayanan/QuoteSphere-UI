/**
 * Sidebar.tsx
 * A collapsible sidebar component with icons for navigation.
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { useEffect } from 'react';

interface NavItem {
  icon: string | React.ReactNode;
  label: string;
  href: string;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    icon: '/Handshake.png',
    label: 'Deal Desk',
    href: '/deal-desk'
  },
  {
    icon: '/Exclusive Product.png',
    label: 'Product Hub',
    href: '/product-hub'
  },
  {
    icon: '/Omnichannel.png',
    label: 'Customer Tower',
    href: '/customer-tower'
  },
  {
    icon: '/Group 3.png',
    label: 'Contract Vault',
    href: '/contract-vault'
  },
  {
    icon: '/Service.png',
    label: 'Service Pod',
    href: '/service-pod'
  },
  {
    icon: '/Web Analytics.png',
    label: 'Analytics HQ',
    href: '/analytics-hq'
  },
  {
    icon: '/Group 4.png',
    label: 'Alert Central',
    href: '/alert-central'
  }
];

interface SidebarProps {
  onNavigate?: (path: { label: string; href: string }[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Track if we're in mobile/tablet view
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside to close sidebar on mobile/tablet
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMobileView) return;
      
      const target = e.target as HTMLElement;
      const sidebar = document.getElementById('sidebar');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (!isCollapsed && 
          sidebar && 
          !sidebar.contains(target) && 
          toggleButton && 
          !toggleButton.contains(target)) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCollapsed, isMobileView]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const NavItem = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
    const isActive = location.pathname === item.href || 
                    (item.href === '/dashboard' && location.pathname === '/');

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(item.href);
      onNavigate?.([{ label: item.label, href: item.href }]);
      
      // Close sidebar on mobile after navigation
      if (isMobileView) {
        setIsCollapsed(true);
      }
    };

    return (
      <button
        onClick={handleClick}
        className={`group flex items-center w-full px-2 py-2 rounded-lg text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
          ${depth > 0 ? 'ml-4' : ''}
          ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-900 dark:text-brand-300' : ''}
        `}
      >
        <span className="flex items-center min-w-[24px] justify-center">
          {typeof item.icon === 'string' ? (
            <img src={item.icon} alt={item.label} className="w-4 h-4" />
          ) : (
            item.icon
          )}
          {!isCollapsed && (
            <span className="ml-3">{item.label}</span>
          )}
        </span>
      </button>
    );
  };

  return (
    <>
      <div 
        className={`
          fixed h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30
          transition-all duration-300 ease-in-out z-30
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
        id="sidebar"
      >
        <button
          onClick={toggleSidebar}
          id="sidebar-toggle"
          className={`
            absolute right-0 top-4 translate-x-1/2 p-1 bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 rounded-full shadow-sm
            ${isCollapsed || !isMobileView ? 'block' : 'hidden'}
          `}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        <div className="p-4 h-screen overflow-hidden">
          <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "gap-4"}`}>
            <img 
              className="w-12 h-12 flex-shrink-0" 
              alt="HDFC Bank Logo" 
              src="/Logo/HDFC Bank Logo.png" 
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <h2 className="font-['Archivo',Helvetica] font-bold text-[#171a1f] text-lg leading-7">
                  Deal Desk
                </h2>
                <p className="font-['Inter',Helvetica] font-normal text-[#565e6c] text-xs leading-5">
                  Nex-Gen Banking
                </p>
              </div>
            )}
          </div>

          <nav className={`space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)] ${isCollapsed ? 'w-8' : ''}`}>
            {navigation.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </nav>
        </div>
      </div>
      <div className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`} />
      
      {/* Overlay for mobile/tablet */}
      {!isCollapsed && isMobileView && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export { Sidebar };
export default Sidebar;