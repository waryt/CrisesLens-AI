import React from 'react';
import { Play, AlertCircle, AlertTriangle, FileText } from 'lucide-react';
import { PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  onOpenSimulation: () => void;
  onNavigate?: (page: PageId) => void;
  criticalCount: number;
  highCount: number;
  totalReportsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenSimulation,
  onNavigate,
  criticalCount,
  highCount,
  totalReportsCount,
}) => {
  const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
    'command-center': {
      title: 'Dashboard',
      subtitle: 'Real-time emergency awareness and high-priority incidents',
    },
    reports: {
      title: 'Reports',
      subtitle: 'Inbound emergency reports intake, NLP entity extraction, and review',
    },
    fusion: {
      title: 'Crisis Fusion',
      subtitle: 'Clustering multi-source reports into unified crisis incidents',
    },
    priority: {
      title: 'Priority Ranking',
      subtitle: 'Multi-criteria emergency triage and explainable scoring',
    },
    map: {
      title: 'Crisis Map',
      subtitle: 'Geographic distribution and status of active crises',
    },
    response: {
      title: 'Response Protocols',
      subtitle: 'AI recommendations and human commander dispatch authorization',
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'System performance, report volume, and triage efficiency',
    },
  };

  const currentInfo = pageTitles[currentPage] || { title: 'Dashboard', subtitle: '' };

  return (
    <header
      id="main-app-header"
      className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20"
    >
      {/* View Title & Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => onNavigate && onNavigate('command-center')}
          className="hover:text-slate-900 transition-colors cursor-pointer font-medium"
        >
          CrisisLens AI
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold text-sm">
          {currentInfo.title}
        </span>
      </div>

      {/* Telemetry Status Badges & Quick Links */}
      <div className="flex items-center gap-3">
        {/* Status indicator buttons */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          {criticalCount > 0 && (
            <button
              onClick={() => onNavigate && onNavigate('priority')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
              title="View Critical Priorities"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="font-semibold">{criticalCount}</span>
              <span>Critical</span>
            </button>
          )}

          {highCount > 0 && (
            <button
              onClick={() => onNavigate && onNavigate('priority')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              title="View High Priorities"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-semibold">{highCount}</span>
              <span>High</span>
            </button>
          )}

          <button
            onClick={() => onNavigate && onNavigate('reports')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="View All Reports"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{totalReportsCount}</span>
            <span>Reports</span>
          </button>
        </div>

        {/* Clean Run Simulation Button */}
        <button
          id="header-run-simulation-btn"
          onClick={onOpenSimulation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Run Live Simulation</span>
        </button>
      </div>
    </header>
  );
};
