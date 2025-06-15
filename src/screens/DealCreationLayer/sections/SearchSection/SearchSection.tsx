import { LayoutDashboardIcon, SettingsIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";

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

export const SearchSection = (): JSX.Element => {
  return (
    <aside className="h-full w-[252px] bg-[#f8f9fa] border-r border-[#e5e7eb] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 flex items-center gap-4">
        <img className="w-12 h-12" alt="QuoteSphere Logo" src="/image-1.png" />
        <div className="flex flex-col">
          <h2 className="font-['Archivo',Helvetica] font-bold text-[#171a1f] text-lg leading-7">
            QuoteSphere
          </h2>
          <p className="font-['Inter',Helvetica] font-normal text-[#565e6c] text-xs leading-5">
            Nex-Gen Banking
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-4 mt-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start rounded-2xl h-10 ${
                item.active
                  ? "bg-[#636ae8] text-white font-bold"
                  : "text-[#565e6c] font-normal"
              }`}
            >
              <span className="w-6 h-6 flex items-center justify-center mr-2">
                {item.icon}
              </span>
              <span className="font-['Inter',Helvetica] text-sm leading-[22px]">
                {item.label}
              </span>
            </Button>
          ))}
        </nav>
        <Separator className="my-4 mx-4 bg-gray-200" />
      </div>
    </aside>
  );
};
