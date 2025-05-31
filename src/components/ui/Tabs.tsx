// /mnt/data/banking-ui-components/Tabs.tsx
import React, { useState } from "react";

type TabProps = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: TabProps[];
  defaultActive?: number;
};

const Tabs: React.FC<TabsProps> = ({ tabs, defaultActive = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultActive);

  return (
    <div className="w-full">
      <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`py-2 px-4 font-semibold transition-colors duration-200 ${
              index === activeIndex
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs[activeIndex]?.content || "Content not available"}
      </div>
    </div>
  );
};

export default Tabs;
