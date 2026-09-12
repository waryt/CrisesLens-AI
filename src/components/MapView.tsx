import React, { useState } from 'react';
import {
  MapPin,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { CrisisCluster, SeverityLevel, PageId } from '../types';

interface MapViewProps {
  crises: CrisisCluster[];
  selectedCrisisId: string;
  onSelectCrisis: (crisisId: string) => void;
  onNavigateToCrisis: (crisisId: string, page: PageId) => void;
  onOpenCrisisDetail?: (crisis: CrisisCluster) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  crises,
  selectedCrisisId,
  onSelectCrisis,
  onNavigateToCrisis,
  onOpenCrisisDetail,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const selectedCrisis =
    crises.find((c) => c.id === selectedCrisisId) || crises[0];

  const filteredCrises = crises.filter((c) => {
    if (filterSeverity === 'All') return true;
    return c.severity === filterSeverity;
  });

  const getMarkerColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-600 text-white border-red-700 shadow-md ring-4 ring-red-100';
      case 'High':
        return 'bg-amber-500 text-white border-amber-600 shadow-md ring-4 ring-amber-100';
      case 'Medium':
        return 'bg-yellow-400 text-slate-900 border-yellow-500 shadow-sm ring-4 ring-yellow-100';
      case 'Low':
        return 'bg-emerald-500 text-white border-emerald-600 shadow-sm ring-4 ring-emerald-100';
    }
  };

  const handleViewCrisis = (crisis: CrisisCluster) => {
    if (onOpenCrisisDetail) {
      onOpenCrisisDetail(crisis);
    } else {
      onNavigateToCrisis(crisis.id, 'priority');
    }
  };

  return (
    <div id="map-view" className="flex flex-col h-full bg-slate-50">
      {/* Top Simple Filter Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Crisis Incident Map</h2>
          <p className="text-xs text-slate-500">Geographic markers for active crisis clusters</p>
        </div>

        {/* Legend / Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterSeverity('All')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterSeverity === 'All'
                ? 'bg-slate-900 text-white font-medium'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({crises.length})
          </button>

          <button
            onClick={() => setFilterSeverity('Critical')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterSeverity === 'Critical'
                ? 'bg-red-600 text-white font-medium'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>Critical</span>
          </button>

          <button
            onClick={() => setFilterSeverity('High')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterSeverity === 'High'
                ? 'bg-amber-500 text-white font-medium'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>High</span>
          </button>

          <button
            onClick={() => setFilterSeverity('Medium')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterSeverity === 'Medium'
                ? 'bg-yellow-400 text-slate-900 font-medium'
                : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Medium</span>
          </button>

          <button
            onClick={() => setFilterSeverity('Low')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterSeverity === 'Low'
                ? 'bg-emerald-600 text-white font-medium'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Low</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="flex-1 relative p-6 overflow-hidden flex items-center justify-center">
        {/* Clean Map Container */}
        <div className="w-full h-full max-w-6xl max-h-[720px] bg-white rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col">
          {/* Subtle Grid and City Layout Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* City Sector Labels */}
          <div className="absolute top-4 left-6 text-[11px] font-semibold text-slate-400 uppercase tracking-widest pointer-events-none">
            Sector 1 — Downtown Metro
          </div>
          <div className="absolute top-4 right-6 text-[11px] font-semibold text-slate-400 uppercase tracking-widest pointer-events-none">
            Sector 2 — Harbor & Industrial
          </div>
          <div className="absolute bottom-6 left-6 text-[11px] font-semibold text-slate-400 uppercase tracking-widest pointer-events-none">
            Sector 3 — Residential Heights
          </div>
          <div className="absolute bottom-6 right-6 text-[11px] font-semibold text-slate-400 uppercase tracking-widest pointer-events-none">
            Sector 4 — River Corridor
          </div>

          {/* Road / River Lines (Subtle Vector Lines) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <path
              d="M0,280 Q300,320 600,300 T1200,380"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="12"
            />
            <path
              d="M340,0 L340,800"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            <path
              d="M720,0 L720,800"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            <path
              d="M0,450 L1200,450"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
          </svg>

          {/* CRISIS MARKERS */}
          {filteredCrises.map((crisis) => {
            const isSelected = selectedCrisis && selectedCrisis.id === crisis.id;
            return (
              <div
                key={crisis.id}
                style={{
                  left: `${crisis.coordinates.x}%`,
                  top: `${crisis.coordinates.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                onClick={() => onSelectCrisis(crisis.id)}
              >
                {/* Pin marker */}
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform transform group-hover:scale-110 ${getMarkerColor(
                    crisis.severity
                  )} ${isSelected ? 'scale-125 ring-8 ring-slate-900/10' : ''}`}
                >
                  <MapPin className="w-5 h-5 fill-current" />
                </div>

                {/* Marker label pill */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-slate-200 px-2 py-0.5 rounded shadow-sm text-[10px] font-semibold text-slate-800 whitespace-nowrap pointer-events-none">
                  {crisis.name}
                </div>
              </div>
            );
          })}

          {/* SMALL CRISIS SUMMARY (When a marker is selected) */}
          {selectedCrisis && (
            <div className="absolute bottom-6 right-6 z-30 max-w-sm w-full bg-white rounded-lg border border-slate-200 p-4 shadow-lg space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {selectedCrisis.code}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                        selectedCrisis.severity === 'Critical'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : selectedCrisis.severity === 'High'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      }`}
                    >
                      {selectedCrisis.severity.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedCrisis.name}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedCrisis.location}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 font-medium">Priority</div>
                  <div className="text-lg font-bold font-mono text-red-600">
                    {selectedCrisis.priorityScore}
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {selectedCrisis.explanation}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {selectedCrisis.relatedReportsCount} corroborating reports
                </span>

                <button
                  onClick={() => handleViewCrisis(selectedCrisis)}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>View Crisis</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
