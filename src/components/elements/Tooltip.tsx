import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content?: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string; 
  delay?: number; 
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
  delay = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId: NodeJS.Timeout;

  if (!content) {
    return <>{children}</>;
  }

  const showTooltip = () => {
    timeoutId = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800',
    bottom: 'absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-slate-800',
    left: 'absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-slate-800',
    right: 'absolute top-1/2 -translate-y-1/2 right-full w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-slate-800',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip} 
      onBlur={hideTooltip}
      tabIndex={0} 
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        >
          <div
            className={`bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap relative ${positionClasses[position]} ${className || ''}`}
          >
            {content}
            <div className={arrowClasses[position]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;