import React, { useState } from 'react';
import {
  ArrowUpDown,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  FileText,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { CrisisCluster } from '../types';
import { WorkflowBar, WorkflowStep } from './WorkflowBar';

interface PriorityViewProps {
  crises: CrisisCluster[];
  selectedCrisisId: string;
  onSelectCrisis: (crisisId: string) => void;
  onNavigateToResponse: (crisisId: string) => void;
  onNavigateToMap: (crisisId: string) => void;
  onOpenCrisisDetail?: (crisis: CrisisCluster) => void;
}

type PriorityWorkflowStep = 'overview' | 'rank' | 'explain';

export const PriorityView: React.FC<PriorityViewProps> = ({
  crises,
  selectedCrisisId,
  onSelectCrisis,
  onNavigateToResponse,
  onNavigateToMap,
  onOpenCrisisDetail,
}) => {
  const [activeStep, setActiveStep] = useState<PriorityWorkflowStep>('overview');

  // Sorted crises by priority score descending
  const rankedCrises = [...crises].sort((a, b) => b.priorityScore - a.priorityScore);

  const currentCrisis =
    rankedCrises.find((c) => c.id === selectedCrisisId) || rankedCrises[0];

  const workflowSteps: WorkflowStep<PriorityWorkflowStep>[] = [
    { id: 'overview', label: 'Overview', description: 'Which crisis should be handled first?' },
    { id: 'rank', label: 'Rank', count: `${rankedCrises.length} Crises`, description: 'Full prioritized triage queue' },
    { id: 'explain', label: 'Explain', description: 'Explainable AI scoring factors' },
  ];

  const isCritical = currentCrisis?.severity === 'Critical';
  const isHigh = currentCrisis?.severity === 'High';

  return (
    <div id="priority-view" className="flex flex-col min-h-full">
      {/* Top Horizontal Workflow: [ Overview ] → [ Rank ] → [ Explain ] */}
      <WorkflowBar<PriorityWorkflowStep>
        title="Priority Ranking"
        subtitle="Which crisis should be handled first? Multi-factor explainable triage"
        steps={workflowSteps}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
      />

      {/* Main Content Area */}
      <div className="p-6 space-y-6 max-w-6xl mx-auto w-full flex-1">
        {/* WORKFLOW 1: OVERVIEW (RANKED LIST + CRISIS DETAILS PANEL) */}
        {activeStep === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Clean Ranked List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ranked Priority Queue
                </h3>
                <span className="text-[11px] text-slate-400">Click to inspect</span>
              </div>

              <div className="space-y-2">
                {rankedCrises.map((crisis, index) => {
                  const isSelected = crisis.id === currentCrisis.id;
                  const itemIsCritical = crisis.severity === 'Critical';
                  const itemIsHigh = crisis.severity === 'High';

                  return (
                    <button
                      key={crisis.id}
                      onClick={() => onSelectCrisis(crisis.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-sm font-bold text-slate-400 pt-0.5">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {crisis.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                itemIsCritical
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : itemIsHigh
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                              }`}
                            >
                              {crisis.severity.toUpperCase()}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {crisis.relatedReportsCount} reports
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-xl font-bold font-mono ${
                            itemIsCritical
                              ? 'text-red-600'
                              : itemIsHigh
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {crisis.priorityScore}
                          <span className="text-xs text-slate-400 font-normal">/100</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Selected Crisis Inspector (7 cols) */}
            {currentCrisis && (
              <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-5">
                {/* Header */}
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

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-[11px] text-slate-500 font-medium">Priority Score</div>
                    <div
                      className={`text-3xl font-bold font-mono ${
                        isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-slate-800'
                      }`}
                    >
                      {currentCrisis.priorityScore}
                      <span className="text-sm font-normal text-slate-400">/100</span>
                    </div>
                  </div>
                </div>

                {/* 1. WHY THIS SCORE? */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Why this score?
                  </h4>
                  <div className="space-y-2">
                    {currentCrisis.scoreFactors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-md bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{factor.name}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5 ml-3">
                            {factor.description}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0">
                          +{factor.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. SUPPORTING REPORTS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                      Supporting Reports ({currentCrisis.relatedReportsCount})
                    </h4>
                    <span className="text-slate-500">
                      {currentCrisis.independentSourcesCount} independent sources
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-md p-3 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span>
                      Corroborated across citizen hotlines, emergency services, and field units.
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {currentCrisis.reportIds?.slice(0, 4).join(', ') || 'REP-201, REP-202, ...'}
                    </span>
                  </div>
                </div>

                {/* 3. AI REASONING */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    AI Reasoning
                  </h4>
                  <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    {currentCrisis.explanation}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateToResponse(currentCrisis.id)}
                    className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Proceed to Response Protocols</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigateToMap(currentCrisis.id)}
                    className="px-3 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Location</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WORKFLOW 2: RANK (FULL QUEUE TABLE) */}
        {activeStep === 'rank' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Incident Prioritization Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time sorted queue ordered strictly by evaluated urgency score
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Crisis Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Priority Score</th>
                    <th className="py-3 px-4">Reports</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {rankedCrises.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">#{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3 px-4 text-slate-600">{c.location}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            c.severity === 'Critical'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : c.severity === 'High'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                          }`}
                        >
                          {c.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {c.priorityScore}/100
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {c.relatedReportsCount} reports ({c.independentSourcesCount} sources)
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            onSelectCrisis(c.id);
                            onNavigateToResponse(c.id);
                          }}
                          className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
                        >
                          Response
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKFLOW 3: EXPLAIN */}
        {activeStep === 'explain' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Explainable AI Scoring Methodology</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every priority score is calculated transparently using weighted life-safety, infrastructure, and velocity metrics
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">Life Safety (Max 40 pts)</div>
                <p className="text-slate-500 text-[11px]">
                  Imminent threat to human life, casualties, stranded medical patients, or toxic hazards.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">Infrastructure (Max 25 pts)</div>
                <p className="text-slate-500 text-[11px]">
                  Severance of major transportation arteries, hospitals, power substations, or water plants.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">Corroboration (Max 20 pts)</div>
                <p className="text-slate-500 text-[11px]">
                  Cross-validation across independent official and civilian reporting channels.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">Escalation Velocity (Max 15 pts)</div>
                <p className="text-slate-500 text-[11px]">
                  Rate of inbound report surge over 15-minute sliding analysis windows.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
