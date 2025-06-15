/**
 * Sidebar.tsx
 * A collapsible sidebar component with icons for navigation.
 */
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  Folder 
} from 'lucide-react';
import { useEffect } from 'react';

interface NavItem {
  icon: React.ReactNode;
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
    icon: <Folder className="w-4 h-4" />,
    label: 'Projects',
    href: '/projects',
    items: [
      { icon: <FileText className="w-4 h-4" />, label: 'Active', href: '/projects/active' },
      { icon: <FileText className="w-4 h-4" />, label: 'Archived', href: '/projects/archived' }
    ]
  },
  {
    icon: <Users className="w-4 h-4" />,
    label: 'Team',
    href: '/team'
  },
  {
    icon: <Settings className="w-4 h-4" />,
    label: 'Settings',
    href: '/settings'
  }
];

interface SidebarProps {
  onNavigate?: (path: { label: string; href: string }[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
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

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const NavItem = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
    const hasSubItems = item.items && item.items.length > 0;
    const isExpanded = expandedItems.includes(item.label);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      
      if (hasSubItems) {
        toggleExpand(item.label);
        onNavigate?.([{ label: item.label, href: item.href }]);
      } else {
        const parentItem = navigation.find(navItem => 
          navItem.items?.some(subItem => subItem.href === item.href)
        );
        
        if (parentItem) {
          onNavigate?.([
            { label: parentItem.label, href: parentItem.href },
            { label: item.label, href: item.href }
          ]);
        } else {
          onNavigate?.([{ label: item.label, href: item.href }]);
        }
      }
    };

    return (
      <>
        <a
          href={item.href}
          className={`group flex items-center px-2 py-2 rounded-lg text-gray-700 dark:text-gray-200
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
            ${depth > 0 ? 'ml-4' : ''}
          `}
          onClick={handleClick}
        >
          <span className="flex items-center min-w-[24px] justify-center">
            {item.icon}
            {!isCollapsed && (
              <>
                <span className="ml-3">{item.label}</span>
                {hasSubItems && (
                  <ChevronRight 
                    className={`w-4 h-4 ml-auto transition-transform duration-200
                      ${isExpanded ? 'transform rotate-90' : ''}
                    `}
                  />
                )}
              </>
            )}
          </span>
        </a>
        {hasSubItems && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.items.map((subItem, index) => (
              <NavItem key={index} item={subItem} depth={depth + 1} />
            ))}
          </div>
        )}
      </>
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
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm truncate">A</span>
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                App
              </span>
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

export default Sidebar;