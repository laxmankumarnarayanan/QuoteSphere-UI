import React from 'react';
import { Check, AlertCircle, Clock } from 'lucide-react'; 
import Tooltip from './Tooltip'; 

interface Stage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'delayed';
  approvedBy?: string; 
  approvedAt?: string; 
  expectedDate?: string; 
  notes?: string; 
}

interface WorkflowProgressProps {
  stages: Stage[];
  className?: string;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ stages, className }) => {
  if (!stages || stages.length === 0) {
    return <p className="text-slate-500">No workflow stages to display.</p>;
  }

  const getStageStyles = (status: Stage['status']) => {
    switch (status) {
      case 'completed':
        return {
          borderColor: 'border-violet-500',
          bgColor: 'bg-violet-500',
          textColor: 'text-white',
          Icon: Check,
          lineBg: 'bg-violet-500',
        };
      case 'current':
        return {
          borderColor: 'border-violet-500 animate-pulse-border', 
          bgColor: 'bg-white',
          textColor: 'text-violet-500',
          Icon: () => <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>, 
          lineBg: 'bg-slate-200', 
        };
      case 'delayed':
        return {
          borderColor: 'border-amber-500',
          bgColor: 'bg-white',
          textColor: 'text-amber-500',
          Icon: AlertCircle,
          lineBg: 'bg-slate-200',
        };
      case 'pending':
      default:
        return {
          borderColor: 'border-slate-300',
          bgColor: 'bg-white',
          textColor: 'text-slate-400',
          Icon: Clock,
          lineBg: 'bg-slate-200',
        };
    }
  };
  /* Add to global CSS if using animate-pulse-border:
    @keyframes pulse-border {
      0%, 100% { border-color: #8b5cf6; box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
      50% { border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167, 139, 250, 0); }
    }
    .animate-pulse-border { animation: pulse-border 2s infinite; }
  */

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className || ''}`}>
      <h2 className="text-lg font-semibold text-slate-800 mb-8 text-center sm:text-left">Workflow Progress</h2>
      <div className="relative overflow-x-auto pb-4"> {}
        <div className="flex items-start min-w-[600px]" style={{ width: `${stages.length * Math.max(150, 800 / stages.length)}px`}}> {}
          {stages.map((stage, index) => {
            const styles = getStageStyles(stage.status);
            const { Icon } = styles;
            const isLastStage = index === stages.length - 1;

            const tooltipContent = (
              <div className="text-xs text-left">
                <p className="font-semibold">{stage.name}</p>
                {stage.status === 'completed' && stage.approvedBy && (
                  <p>By: {stage.approvedBy} on {stage.approvedAt}</p>
                )}
                {(stage.status === 'pending' || stage.status === 'delayed') && stage.expectedDate && (
                  <p>Expected: {stage.expectedDate}</p>
                )}
                {stage.status === 'delayed' && <p className="text-amber-300">This stage is delayed.</p>}
                {stage.notes && <p className="mt-1 text-slate-300">{stage.notes}</p>}
              </div>
            );

            return (
              <div key={stage.id} className="flex-1 flex flex-col items-center relative px-2">
                {}
                <div className="text-xs font-medium text-slate-600 text-center mb-3 h-8 overflow-hidden">
                  {stage.name}
                </div>

                {}
                <div className="flex items-center w-full relative justify-center">
                  {}
                  {index > 0 && (
                    <div className={`absolute right-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full ${getStageStyles(stages[index-1].status).lineBg}`}></div>
                  )}
                 
                  <Tooltip content={tooltipContent} position="top">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 relative z-10
                        ${styles.borderColor} ${styles.bgColor}
                        transition-all duration-300 transform hover:scale-110
                      `}
                    >
                      <Icon className={`w-5 h-5 ${styles.textColor}`} />
                    </div>
                  </Tooltip>
                </div>
                
                {}
                <div className="text-xs text-slate-500 mt-3 text-center h-10">
                  {stage.status === 'completed' && stage.approvedAt ? (
                    <span className="font-medium text-green-600">Completed: {stage.approvedAt}</span>
                  ) : stage.expectedDate ? (
                    <span>Exp: {stage.expectedDate}</span>
                  ) : stage.status === 'current' ? (
                    <span className="font-medium text-violet-600">In Progress</span>
                  ) : null}
                   {stage.status === 'delayed' && (
                        <p className="text-amber-600 font-medium">Delayed</p>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgress;