import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  FileText,
  Activity,
  ArrowRight,
  MapPin,
  Clock,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { CrisisCluster, EmergencyReport, ActivityLog, PageId } from '../types';

interface CommandCenterViewProps {
  crises: CrisisCluster[];
  topCrisis: CrisisCluster;
  recentReports: EmergencyReport[];
  aiActivities?: ActivityLog[];
  totalReportsCount: number;
  criticalCount: number;
  highCount: number;
  activeCrisesCount: number;
  onNavigate: (page: PageId) => void;
  onSelectCrisis: (crisisId: string) => void;
  onOpenCrisisDetail?: (crisis: CrisisCluster) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  crises,
  topCrisis,
  recentReports,
  totalReportsCount,
  criticalCount,
  highCount,
  activeCrisesCount,
  onNavigate,
  onSelectCrisis,
  onOpenCrisisDetail,
}) => {
  // Sort crises by priority score descending
  const sortedCrises = [...crises].sort((a, b) => b.priorityScore - a.priorityScore);
  const currentTop = topCrisis || sortedCrises[0];

  // Latest 4-5 reports
  const displayReports = recentReports.slice(0, 5);

  const handleViewCrisis = (crisis: CrisisCluster) => {
    onSelectCrisis(crisis.id);
    if (onOpenCrisisDetail) {
      onOpenCrisisDetail(crisis);
    } else {
      onNavigate('priority');
    }
  };

  return (
    <div id="dashboard-view" className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* 1. TOP SECTION: EXACTLY 4 METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Crises */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Active Crises</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {activeCrisesCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Clustered incidents</div>
        </div>

        {/* Critical (Status Red) */}
        <button
          onClick={() => onNavigate('priority')}
          className="bg-red-50/50 hover:bg-red-50 rounded-lg border border-red-200 p-4 shadow-2xs text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-700 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              Critical
            </span>
            <span className="text-[10px] text-red-600 group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
          <div className="text-2xl font-bold text-red-700 mt-1">
            {criticalCount}
          </div>
          <div className="text-[11px] text-red-600/80 mt-0.5">Immediate triage required</div>
        </button>

        {/* High (Status Orange) */}
        <button
          onClick={() => onNavigate('priority')}
          className="bg-amber-50/50 hover:bg-amber-50 rounded-lg border border-amber-200 p-4 shadow-2xs text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              High
            </span>
            <span className="text-[10px] text-amber-600 group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {highCount}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-0.5">Escalation potential</div>
        </button>

        {/* Reports Processed */}
        <button
          onClick={() => onNavigate('reports')}
          className="bg-white hover:bg-slate-50 rounded-lg border border-slate-200 p-4 shadow-2xs text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Reports Processed
            </span>
            <span className="text-[10px] text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalReportsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Multi-source intake</div>
        </button>
      </div>

      {/* 2. TOP PRIORITY CRISIS */}
      {currentTop && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Top Priority Crisis
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Updated in real-time
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {currentTop.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  {currentTop.severity.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentTop.relatedReportsCount} reports • {currentTop.independentSourcesCount} sources
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentTop.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentTop.location}</span>
              </p>
            </div>

            {/* Priority Score & Action */}
            <div className="flex items-center sm:flex-col sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="sm:text-right">
                <div className="text-[11px] text-slate-500 font-medium">Priority Score</div>
                <div className="text-3xl font-bold text-red-600 font-mono leading-none mt-0.5">
                  {currentTop.priorityScore}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </div>
              </div>

              <button
                onClick={() => handleViewCrisis(currentTop)}
                className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>View Crisis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Key critical reasons */}
          <div className="bg-slate-50 rounded-md p-3 border border-slate-200/80 text-xs space-y-1.5">
            <div className="font-medium text-slate-700">Primary factors for high priority:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Medical emergency & vulnerable persons at risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Arterial road access severed by 4.2ft water</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Corroborated by 7 independent multi-agency channels</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Escalating surge (+18% volume in last 15 min)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RECENT REPORTS (4-5 LATEST REPORTS) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Reports</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest inbound reports being ingested</p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View all reports</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
          {displayReports.map((report, idx) => (
            <div
              key={`${report.id}-${idx}`}
              onClick={() => onNavigate('reports')}
              className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                    {report.id}
                  </span>
                  <span className="font-medium text-slate-900">{report.source}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {report.time}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {report.location}
                  </span>
                </div>
                <p className="text-slate-700 line-clamp-1">{report.text}</p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                    report.severity === 'Critical'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : report.severity === 'High'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : report.severity === 'Medium'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {report.severity}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {report.crisisType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ACTIVE CRISIS LIST */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Crisis List</h3>
            <p className="text-xs text-slate-500 mt-0.5">Prioritized multi-report crisis clusters</p>
          </div>
          <button
            onClick={() => onNavigate('priority')}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Full priority ranking</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
          {sortedCrises.map((crisis, index) => {
            const isCritical = crisis.severity === 'Critical';
            const isHigh = crisis.severity === 'High';

            return (
              <div
                key={crisis.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400 w-5 pt-0.5">
                    #{index + 1}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {crisis.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isHigh
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {crisis.severity}
                      </span>
                    </div>
                    <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{crisis.location}</span>
                      <span className="text-slate-300">•</span>
                      <span>{crisis.relatedReportsCount} reports ({crisis.independentSourcesCount} sources)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium">Priority</div>
                    <div
                      className={`text-lg font-bold font-mono ${
                        isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-slate-700'
                      }`}
                    >
                      {crisis.priorityScore}
                      <span className="text-[11px] font-normal text-slate-400">/100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewCrisis(crisis)}
                    className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
