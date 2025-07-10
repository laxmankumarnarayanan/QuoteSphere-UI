/**
 * Collapsible Sidebar Component
 * Contains navigation menu with QuoteSphere branding and collapsible functionality
 */
import { ChevronLeftIcon, ChevronRightIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

// Navigation menu items data
const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon size={18} />,
    active: true,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon size={18} />,
    active: false,
  },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = "" }: SidebarProps): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#f8f9fa] border-r border-[#e5e7eb] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] flex flex-col transition-all duration-300 z-50 ${
        isCollapsed ? "w-16" : "w-[252px]"
      } ${className}`}
    >
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-10">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-3 w-3" />
          ) : (
            <ChevronLeftIcon className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Logo and Brand */}
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

      {/* Navigation Menu */}
      <div className={`px-4 mt-4 ${isCollapsed ? "px-2" : ""}`}>
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={item.active ? "default" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} rounded-2xl h-10 ${
                item.active
                  ? "bg-[#636ae8] text-white font-bold"
                  : "text-[#565e6c] font-normal"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="w-6 h-6 flex items-center justify-center">
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-['Inter',Helvetica] text-sm leading-[22px] ml-2">
                  {item.label}
                </span>
              )}
            </Button>
          ))}
        </nav>
        <Separator className={`my-4 bg-gray-200 ${isCollapsed ? "mx-2" : "mx-4"}`} />
      </div>
    </aside>
  );
};