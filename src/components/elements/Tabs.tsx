import React, { useState, ReactNode, Children, isValidElement, cloneElement, useEffect, useRef } from 'react';

interface TabProps {
  id: string;
  label: string;
  children: ReactNode; 
  disabled?: boolean;
  icon?: ReactNode;
}

interface TabsProps {
  tabs?: TabProps[]; 
  children?: ReactNode; 
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string; 
  navClassName?: string; 
  contentClassName?: string; 
  variant?: 'line' | 'pills' | 'enclosed'; 
}


export const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;


const Tabs: React.FC<TabsProps> = ({
  tabs: controlledTabs,
  children,
  defaultTabId,
  onTabChange,
  className,
  navClassName,
  contentClassName,
  variant = 'line',
}) => {
  const tabsArray: TabProps[] = controlledTabs || Children.toArray(children)
    .filter(isValidElement)
    .map(child => child.props as TabProps);

  const [activeTabId, setActiveTabId] = useState(defaultTabId || (tabsArray.length > 0 ? tabsArray[0].id : ''));
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant === 'line' && navRef.current) {
      const activeButton = navRef.current.querySelector(`button[data-tab-id="${activeTabId}"]`) as HTMLElement;
      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      }
    }
  }, [activeTabId, variant, tabsArray]); 


  const handleTabClick = (tabId: string, isDisabled?: boolean) => {
    if (isDisabled) return;
    setActiveTabId(tabId);
    onTabChange?.(tabId);
  };
  
  const variantClasses = {
    line: {
      nav: 'border-b border-slate-200 relative',
      button: 'py-3 px-4 text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:z-10',
      activeButton: 'text-violet-600',
      inactiveButton: 'text-slate-500 hover:text-slate-700 hover:border-slate-300',
      indicator: 'absolute bottom-0 h-0.5 bg-violet-600 transition-all duration-300 ease-in-out'
    },
    pills: {
      nav: 'flex space-x-1 bg-slate-100 p-1 rounded-lg',
      button: 'flex-1 text-center py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1',
      activeButton: 'bg-white text-violet-600 shadow-sm',
      inactiveButton: 'text-slate-600 hover:bg-slate-200 hover:text-slate-800',
      indicator: 'hidden'
    },
    enclosed: {
        nav: 'border-b border-slate-200',
        button: 'py-2.5 px-4 text-sm font-medium border border-b-0 border-transparent rounded-t-md -mb-px focus:outline-none focus:z-10 transition-colors',
        activeButton: 'bg-white border-slate-200 text-violet-600',
        inactiveButton: 'text-slate-500 hover:text-slate-700 hover:border-slate-200 hover:bg-slate-50',
        indicator: 'hidden'
    }
  };

  const currentVariantStyle = variantClasses[variant];

  return (
    <div className={className}>
      <div ref={navRef} className={`${currentVariantStyle.nav} ${navClassName || ''}`}>
        <nav className="-mb-px flex space-x-1 sm:space-x-2" aria-label="Tabs"> 
          {tabsArray.map((tab) => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              disabled={tab.disabled}
              role="tab"
              aria-selected={activeTabId === tab.id}
              aria-controls={`tab-panel-${tab.id}`}
              id={`tab-button-${tab.id}`}
              className={`
                whitespace-nowrap
                ${currentVariantStyle.button}
                ${activeTabId === tab.id ? currentVariantStyle.activeButton : currentVariantStyle.inactiveButton}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed !hover:bg-transparent !text-slate-400' : ''}
                ${tab.icon ? 'flex items-center' : ''}
              `}
            >
              {tab.icon && <span className="mr-2 w-4 h-4">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
        {variant === 'line' && <div className={currentVariantStyle.indicator} style={indicatorStyle}></div>}
      </div>
      <div className={`mt-4 ${contentClassName || ''}`}>
        {tabsArray.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tab-panel-${tab.id}`}
            aria-labelledby={`tab-button-${tab.id}`}
            className={`transition-opacity duration-300 ease-in-out ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 hidden'}`}
          >
            
            {controlledTabs ? tab.children : 
              (Children.toArray(children).filter(isValidElement).find(child => (child.props as TabProps).id === tab.id) as React.ReactElement)?.props.children
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;