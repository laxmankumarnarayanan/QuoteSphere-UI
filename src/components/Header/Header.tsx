/**
 * Header.tsx
 * Main header component with user info, settings, and view toggle.
 */
import React from 'react';
import { Settings, LogOut, Bell } from 'lucide-react';
import Toggle from '../../template components/components/ui/Toggle';

interface HeaderProps {
  userEmail?: string;
  employeeId?: string;
}

const Header: React.FC<HeaderProps> = ({
  userEmail = 'laxman.narayanan@fractalhive.com',
  employeeId = 'FH240002'
}) => {
  const [isManager, setIsManager] = React.useState(false);

  return (
    <header className="sticky top-0 h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white transition-all duration-300 ease-in-out z-20">
      {/* Left section - Employee ID and Email */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">{employeeId}</span>
        <span className="text-gray-400">|</span>
        <span className="text-sm text-gray-600">{userEmail}</span>
      </div>
      
      {/* Center section - Welcome text */}
      <div className="flex-1 flex justify-center">
        <span className="text-sm font-semibold text-gray-800">Welcome, Laxman Narayanan</span>
      </div>
      
      {/* Right section - Manager View toggle and action buttons */}
      <div className="flex items-center space-x-6">
        <Toggle
          label="Manager View"
          enabled={isManager}
          onChange={setIsManager}
        />
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          {/* Notifications Icon (no logic, no dropdown) */}
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Show notifications">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 