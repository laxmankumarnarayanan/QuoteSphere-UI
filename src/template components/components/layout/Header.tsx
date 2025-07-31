/**
 * Header.tsx
 * Main header component with user info, settings, and view toggle.
 */
import React from 'react';
import { Settings, LogOut, Bell } from 'lucide-react';
import Toggle from '../form/Toggle';

interface HeaderProps {
  userEmail?: string;
  employeeId?: string;
}

const Header: React.FC<HeaderProps> = ({
  userEmail = 'laxman.narayanan@fractalhive.com',
  employeeId = 'FH240002'
}) => {
  const [isManager, setIsManager] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  // Example notifications
  const notifications = [
    { id: 1, message: 'New deal assigned to you.' },
    { id: 2, message: 'Document approved by manager.' },
    { id: 3, message: 'Reminder: Update deal status.' },
  ];

  return (
    <header className="sticky top-0 h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out z-20">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{employeeId}</span>
          <span className="text-gray-400">|</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">{userEmail}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <Toggle
          id="viewToggle"
          label="Manager View"
          checked={isManager}
          onChange={setIsManager}
          size="sm"
        />
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          {/* Notifications Icon (no logic, no dropdown) */}
          <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" aria-label="Show notifications">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;