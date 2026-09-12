import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Send,
  MapPin,
  Clock,
  Info,
  Users,
} from 'lucide-react';
import { CrisisCluster } from '../types';
import { WorkflowBar, WorkflowStep } from './WorkflowBar';

interface ResponseViewProps {
  crises: CrisisCluster[];
  selectedCrisisId: string;
  onSelectCrisis: (crisisId: string) => void;
  onAuthorizeAction: (crisisId: string, actionId: string) => void;
}

type ResponseWorkflowStep = 'crisis' | 'recommendation' | 'review';

export const ResponseView: React.FC<ResponseViewProps> = ({
  crises,
  selectedCrisisId,
  onSelectCrisis,
  onAuthorizeAction,
}) => {
  const [activeStep, setActiveStep] = useState<ResponseWorkflowStep>('recommendation');

  const currentCrisis =
    crises.find((c) => c.id === selectedCrisisId) || crises[0];

  const workflowSteps: WorkflowStep<ResponseWorkflowStep>[] = [
    { id: 'crisis', label: 'Crisis', description: 'Crisis incident details and context' },
    { id: 'recommendation', label: 'Recommendation', description: 'AI recommended response actions' },
    { id: 'review', label: 'Review', description: 'Commander authorization audit log' },
  ];

  const isCritical = currentCrisis?.severity === 'Critical';
  const isHigh = currentCrisis?.severity === 'High';

  return (
    <div id="response-view" className="flex flex-col min-h-full">
      {/* Top Horizontal Workflow: [ Crisis ] → [ Recommendation ] → [ Review ] */}
      <WorkflowBar<ResponseWorkflowStep>
        title="Emergency Response Protocols"
        subtitle="AI recommendations for human responders — officer authorization required"
        steps={workflowSteps}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
      />

      {/* Main Content Area */}
      <div className="p-6 space-y-6 max-w-5xl mx-auto w-full flex-1">
        {/* Crisis Selector Tabs */}
        <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase px-2 whitespace-nowrap">
            Selected Crisis:
          </span>
          {crises.map((c) => {
            const isSelected = c.id === currentCrisis.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCrisis(c.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{c.code} {c.name}</span>
                <span
                  className={`ml-1.5 text-[10px] font-mono px-1 py-0.2 rounded ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.priorityScore}
                </span>
              </button>
            );
          })}
        </div>

        {/* Human-in-the-loop Operational Notice */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Human-in-the-Loop Protocol: </span>
            <span>
              These recommendations are advisory guidance for human incident commanders. No automated emergency dispatches occur without explicit officer authorization.
            </span>
          </div>
        </div>

        {/* WORKFLOW 1: CRISIS DETAILS */}
        {activeStep === 'crisis' && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    CRISIS {currentCrisis.code}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isCritical
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : isHigh
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    }`}
                  >
                    {currentCrisis.severity.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {currentCrisis.name}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentCrisis.location}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[11px] text-slate-500 font-medium">Priority Score</div>
                <div className="text-2xl font-bold font-mono text-red-600">
                  {currentCrisis.priorityScore}/100
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-semibold text-slate-800">Situation Overview:</div>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {currentCrisis.explanation}
              </p>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setActiveStep('recommendation')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium cursor-pointer"
                >
                  View Recommendations →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW 2: RECOMMENDATION (THE CORE RESPONSE ACTION PLAN) */}
        {activeStep === 'recommendation' && (
          <div className="space-y-5">
            {/* Header info */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      CRISIS {currentCrisis.code}
                    </span>
                    <span className="font-bold text-slate-900 text-base">
                      {currentCrisis.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Location: {currentCrisis.location}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium">Priority: </span>
                  <span className="text-base font-bold font-mono text-red-600">
                    {currentCrisis.priorityScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* AI RECOMMENDATION LIST */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  AI Recommended Actions
                </h3>
                <span className="text-xs text-slate-500">
                  {currentCrisis.recommendedActions.filter((a) => a.status === 'Dispatched').length} of {currentCrisis.recommendedActions.length} Dispatched
                </span>
              </div>

              <div className="space-y-3">
                {currentCrisis.recommendedActions.map((action, idx) => {
                  const isDispatched = action.status === 'Dispatched';

                  return (
                    <div
                      key={action.id}
                      className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3 transition-colors hover:border-slate-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {action.title}
                            </h4>
                            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              Assigned: <span className="text-slate-700 font-medium">{action.targetTeam}</span> • {action.estimatedPersonnel} personnel estimated
                            </div>
                          </div>
                        </div>

                        {/* Dispatch Action Button */}
                        <button
                          onClick={() => onAuthorizeAction(currentCrisis.id, action.id)}
                          className={`px-4 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-center ${
                            isDispatched
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                          }`}
                        >
                          {isDispatched ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Dispatched & Active</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Authorize & Dispatch</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Why this was recommended */}
                      <div className="bg-slate-50 rounded-md p-3 border border-slate-200/80 text-xs">
                        <span className="font-semibold text-slate-700">Rationale: </span>
                        <span className="text-slate-600">{action.rationale}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW 3: REVIEW AUDIT LOG */}
        {activeStep === 'review' && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Commander Authorization Audit Trail</h3>
            <p className="text-xs text-slate-500">
              Verified record of dispatched emergency units and authorized actions
            </p>

            <div className="space-y-2 text-xs">
              {currentCrisis.recommendedActions
                .filter((a) => a.status === 'Dispatched')
                .map((action) => (
                  <div
                    key={action.id}
                    className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{action.title}</div>
                      <div className="text-slate-500 text-[11px]">{action.targetTeam}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[10px] border border-emerald-200">
                      Dispatched
                    </span>
                  </div>
                ))}

              {currentCrisis.recommendedActions.filter((a) => a.status === 'Dispatched').length === 0 && (
                <div className="py-8 text-center text-slate-400">
                  No actions dispatched yet for this crisis.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
