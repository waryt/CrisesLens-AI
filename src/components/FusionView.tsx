import React, { useState } from 'react';
import {
  GitMerge,
  ArrowDown,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldAlert,
  Radio,
  FileText,
  Users,
} from 'lucide-react';
import { CrisisCluster, EmergencyReport } from '../types';
import { WorkflowBar, WorkflowStep } from './WorkflowBar';

interface FusionViewProps {
  crises: CrisisCluster[];
  allReports: EmergencyReport[];
  selectedCrisisId: string;
  onSelectCrisis: (crisisId: string) => void;
  onNavigateToPriority: (crisisId: string) => void;
  onOpenCrisisDetail?: (crisis: CrisisCluster) => void;
  onNavigate?: (page: string) => void;
}

type FusionWorkflowStep = 'detect' | 'compare' | 'merge' | 'verify';

export const FusionView: React.FC<FusionViewProps> = ({
  crises,
  allReports,
  selectedCrisisId,
  onSelectCrisis,
  onNavigateToPriority,
  onOpenCrisisDetail,
}) => {
  const [activeStep, setActiveStep] = useState<FusionWorkflowStep>('detect');

  // Selected cluster
  const currentCluster =
    crises.find((c) => c.id === selectedCrisisId) || crises[0];

  // Reports belonging to current cluster
  const clusterReports = allReports.filter(
    (r) => r.clusterId === currentCluster.id || currentCluster.reportIds.includes(r.id)
  );

  const workflowSteps: WorkflowStep<FusionWorkflowStep>[] = [
    { id: 'detect', label: 'Detect', description: 'Cluster detection and multi-source grouping' },
    { id: 'compare', label: 'Compare', description: 'Pairwise semantic correlation and similarity' },
    { id: 'merge', label: 'Merge', description: 'Incident synthesis and deduplication' },
    { id: 'verify', label: 'Verify', description: 'Cross-agency corroboration validation' },
  ];

  const handleViewCrisis = () => {
    if (onOpenCrisisDetail) {
      onOpenCrisisDetail(currentCluster);
    } else {
      onNavigateToPriority(currentCluster.id);
    }
  };

  const isCritical = currentCluster.severity === 'Critical';
  const isHigh = currentCluster.severity === 'High';

  return (
    <div id="fusion-view" className="flex flex-col min-h-full">
      {/* Top Horizontal Workflow: [ Detect ] → [ Compare ] → [ Merge ] → [ Verify ] */}
      <WorkflowBar<FusionWorkflowStep>
        title="Crisis Fusion Engine"
        subtitle="Consolidate duplicate reports from multiple sources into distinct crisis incidents"
        steps={workflowSteps}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
      />

      {/* Main Content Area */}
      <div className="p-6 space-y-6 max-w-5xl mx-auto w-full flex-1">
        {/* Cluster Selector Tabs */}
        <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase px-2 whitespace-nowrap">
            Select Crisis Cluster:
          </span>
          {crises.map((c) => {
            const isSelected = c.id === currentCluster.id;
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
                  className={`ml-1.5 text-[10px] px-1 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {c.relatedReportsCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* WORKFLOW 1: DETECT (CORE FUSION PIPELINE) */}
        {activeStep === 'detect' && (
          <div className="space-y-6">
            {/* 1. RELATED REPORTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Related Reports
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inbound messages identified with overlapping geographic and topical markers
                  </p>
                </div>
                <span className="text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  {clusterReports.length} Raw Reports Ingested
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clusterReports.slice(0, 4).map((report, idx) => (
                  <div
                    key={`${report.id}-${idx}`}
                    className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                          Report 0{idx + 1}
                        </span>
                        <span className="font-medium text-slate-900">{report.source}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{report.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-normal line-clamp-2">
                      "{report.text}"
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-100">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{report.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. DOWN ARROW: AI DETECTED SIMILARITY */}
            <div className="flex flex-col items-center justify-center my-2 space-y-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-2xs flex items-center gap-3 text-xs">
                <span className="font-semibold text-slate-900">
                  AI Detected Similarity:
                </span>
                <span className="text-slate-600 font-mono">96.4% Semantic Match</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-mono">Within 450m Radius</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-mono">15m Window</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* 3. FUSED CRISIS RESULT */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Fused Crisis Incident
              </div>

              <div className="bg-white rounded-lg border-2 border-slate-900 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                        CRISIS {currentCluster.code}
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
                        {currentCluster.severity.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {currentCluster.name}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentCluster.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="sm:text-right">
                      <div className="text-[11px] text-slate-500 font-medium">Priority Score</div>
                      <div className="text-2xl font-bold font-mono text-red-600">
                        {currentCluster.priorityScore}/100
                      </div>
                    </div>
                    <button
                      onClick={handleViewCrisis}
                      className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <span>View Crisis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded bg-slate-50">
                    <div className="text-[11px] text-slate-500">Related Reports</div>
                    <div className="font-bold text-slate-900 mt-0.5 text-sm">
                      {currentCluster.relatedReportsCount} reports
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50">
                    <div className="text-[11px] text-slate-500">Independent Sources</div>
                    <div className="font-bold text-slate-900 mt-0.5 text-sm">
                      {currentCluster.independentSourcesCount} sources
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50">
                    <div className="text-[11px] text-slate-500">First Report</div>
                    <div className="font-bold text-slate-900 mt-0.5 font-mono">
                      {currentCluster.fusionDetails?.firstReportTime || '09:42 AM'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50">
                    <div className="text-[11px] text-slate-500">Cluster Status</div>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {currentCluster.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW 2: COMPARE */}
        {activeStep === 'compare' && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Semantic & Spatial Pairwise Matrix</h3>
            <p className="text-xs text-slate-500">
              Cosine vector similarity computed across incoming reports for {currentCluster.name}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Report Pair</th>
                    <th className="py-2.5 px-3">Semantic Overlap</th>
                    <th className="py-2.5 px-3">Spatial Distance</th>
                    <th className="py-2.5 px-3">Shared Entities</th>
                    <th className="py-2.5 px-3">Cluster Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium">REP-201 ↔ REP-202</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600 font-semibold">98.2%</td>
                    <td className="py-2.5 px-3">120 meters</td>
                    <td className="py-2.5 px-3">4th Ave Underpass, Stalled Bus</td>
                    <td className="py-2.5 px-3"><span className="text-emerald-700 font-medium">Fused</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium">REP-201 ↔ REP-203</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600 font-semibold">94.7%</td>
                    <td className="py-2.5 px-3">280 meters</td>
                    <td className="py-2.5 px-3">Ambulance Route, High Water</td>
                    <td className="py-2.5 px-3"><span className="text-emerald-700 font-medium">Fused</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-medium">REP-202 ↔ REP-204</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600 font-semibold">96.1%</td>
                    <td className="py-2.5 px-3">340 meters</td>
                    <td className="py-2.5 px-3">Submerged Vehicles, Trapped Civilians</td>
                    <td className="py-2.5 px-3"><span className="text-emerald-700 font-medium">Fused</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKFLOW 3: MERGE */}
        {activeStep === 'merge' && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Incident Deduplication & Synthesis</h3>
            <p className="text-xs text-slate-500">
              Multiple duplicate reports merged into unique verifiable facts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500">Raw Reports Filtered</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {currentCluster.fusionDetails?.duplicateReportsFiltered || 5}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Identical duplicate posts removed</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500">Synthesized Entities</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">4 Key Facts</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Locations, hazards & victims</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500">Cluster Confidence</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">96.4%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">TREC Task-2 evaluation metric</div>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW 4: VERIFY */}
        {activeStep === 'verify' && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Cross-Agency Corroboration Checklist</h3>
            <p className="text-xs text-slate-500">
              Corroboration across independent emergency response sectors
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-800">1. Citizen Helpline Reports (11 calls)</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Corroborated
                </span>
              </div>
              <div className="p-3 rounded border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-800">2. Police Dispatch Unit #4 (Radio)</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Corroborated
                </span>
              </div>
              <div className="p-3 rounded border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-800">3. Metro Hospital Ambulance Dispatch</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Corroborated
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
