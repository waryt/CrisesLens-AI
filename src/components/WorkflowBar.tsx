import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface WorkflowStep<T extends string> {
  id: T;
  label: string;
  count?: number | string;
  description?: string;
}

interface WorkflowBarProps<T extends string> {
  title: string;
  subtitle?: string;
  steps: WorkflowStep<T>[];
  activeStep: T;
  onSelectStep: (stepId: T) => void;
  badge?: string;
}

export function WorkflowBar<T extends string>({
  title,
  subtitle,
  steps,
  activeStep,
  onSelectStep,
}: WorkflowBarProps<T>) {
  return (
    <div className="border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Clean Horizontal Workflow: [ Step 1 ] → [ Step 2 ] → [ Step 3 ] */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {steps.map((step, idx) => {
          const isActive = activeStep === step.id;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <button
                id={`workflow-step-${step.id}`}
                onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white font-medium shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title={step.description}
              >
                <span>{step.label}</span>
                {step.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step.count}
                  </span>
                )}
              </button>

              {!isLast && (
                <ArrowRight className="w-3 h-3 text-slate-300 shrink-0 mx-0.5" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
