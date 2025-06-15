/**
 * WorkflowProgress.tsx
 * A component that displays workflow stages with approval status and timeline.
 */
import React from 'react';
import { Check } from 'lucide-react';
import { Tooltip } from '../';

interface Stage {
  id: string;
  name: string;
  approvedBy?: string;
  approvedAt?: string;
  expectedDate?: string;
  isDelayed?: boolean;
}

interface WorkflowProgressProps {
  stages: Stage[];
  currentStage: number;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ stages, currentStage }) => {
  const totalStages = 7; // Fixed number of stages
  const stageWidth = 100 / totalStages; // Width of each stage

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-8">Workflow Progress</h2>
      <div className="relative overflow-x-auto min-h-[calc(2rem+2.5rem+4rem+2rem)]">
        <div className="relative min-w-[1000px] h-32">
          {/* Base Line - Always gray and at the center */}
          <div 
            className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-purple-500"
            style={{
              left: `calc(${50 / totalStages}%)`,
              width: `calc(${100 - (100 / totalStages)}%)`
            }}
          />
          
          {/* Stages */}
          <div className="absolute top-0 left-0 right-0 h-full flex">
            {stages.map((stage, index) => {
              const isCompleted = index < currentStage;
              const isCurrent = index === currentStage;
              const stageWidth = `${100 / totalStages}%`;

              return (
                <div 
                  key={stage.id} 
                  className="relative flex flex-col items-center justify-center h-full"
                  style={{ width: stageWidth }}
                >
                  {/* Stage Name */}
                  <div className="absolute -top-2 w-full text-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stage.name}
                    </span>
                  </div>

                  {/* Circle */}
                  <Tooltip
                    content={
                      isCompleted ? (
                        <div className="text-sm">
                          <div className="font-medium">{stage.approvedBy}</div>
                          <div className="text-gray-200 mt-1">{stage.approvedAt}</div>
                        </div>
                      ) : undefined
                    }
                  >
                    <div
                      className={`
                        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center 
                        border-2 bg-white dark:bg-gray-800 transition-colors duration-300 transform
                        ${isCompleted ? 'border-purple-500' : 
                         isCurrent ? 'border-purple-500' : 
                          'border-gray-300 dark:border-gray-600'}
                      `}
                    >
                      {isCompleted ? (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-3 h-3 bg-purple-500 rounded-full transition-all duration-300" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full" />
                      )}
                    </div>
                  </Tooltip>

                  {/* Date Info */}
                  <div className="absolute -bottom-2 w-full text-center">
                    {isCompleted ? (
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Approved
                      </div>
                    ) : (
                      <>
                        <div className="text-xs text-gray-400">
                          Expected by
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {stage.expectedDate}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowProgress;