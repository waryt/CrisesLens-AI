import React from 'react';
import {
  FileText,
  CheckCircle2,
  Copy,
  GitMerge,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface AnalyticsViewProps {
  totalReports?: number;
  uniqueCrises?: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  totalReports = 248,
  uniqueCrises = 4,
}) => {
  const reportsReceived = totalReports + 20;
  const duplicateReports = 74;
  const criticalCrises = 2;

  const sourcesData = [
    { name: 'Citizen Mobile App', count: 112, pct: 45 },
    { name: 'Police Dispatch Feeds', count: 48, pct: 19 },
    { name: 'Hospital Emergency Coord', count: 42, pct: 17 },
    { name: 'Social Media / Public Posts', count: 32, pct: 13 },
    { name: 'Emergency Helpline Calls', count: 14, pct: 6 },
  ];

  const severityData = [
    { level: 'Critical', count: 2, color: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50' },
    { level: 'High', count: 1, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    { level: 'Medium', count: 1, color: 'bg-yellow-400', text: 'text-yellow-800', bg: 'bg-yellow-50' },
    { level: 'Low', count: 0, color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  ];

  return (
    <div id="analytics-view" className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Operations Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive report ingestion, deduplication, and triage performance metrics
        </p>
      </div>

      {/* TOP 5 METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Reports Received */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Reports Received</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{reportsReceived}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Total inbound traffic</div>
        </div>

        {/* 2. Reports Processed */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Reports Processed</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalReports}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">NLP entity extracted</div>
        </div>

        {/* 3. Duplicate Reports */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Duplicate Reports</div>
          <div className="text-2xl font-bold text-slate-700 mt-1">{duplicateReports}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Grouped & filtered</div>
        </div>

        {/* 4. Crisis Clusters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Crisis Clusters</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{uniqueCrises}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active distinct events</div>
        </div>

        {/* 5. Critical Crises (Status Highlighted) */}
        <div className="bg-red-50/60 rounded-lg border border-red-200 p-4 shadow-2xs col-span-2 lg:col-span-1">
          <div className="text-xs text-red-700 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Critical Crises
          </div>
          <div className="text-2xl font-bold text-red-700 mt-1">{criticalCrises}</div>
          <div className="text-[11px] text-red-600/80 mt-0.5">Top priority dispatch</div>
        </div>
      </div>

      {/* A FEW CLEAN USEFUL CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Reports by Source */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reports by Ingestion Channel</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribution across multi-agency streams</p>
          </div>

          <div className="space-y-3">
            {sourcesData.map((s) => (
              <div key={s.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-medium">{s.name}</span>
                  <span className="font-mono text-slate-500">{s.count} ({s.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-900 h-2 rounded-full"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Crisis Severity Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Crises by Severity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Incident severity classification</p>
          </div>

          <div className="space-y-3">
            {severityData.map((sev) => (
              <div
                key={sev.level}
                className={`p-3 rounded-lg border border-slate-200/80 flex items-center justify-between ${sev.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${sev.color}`} />
                  <span className={`text-xs font-semibold ${sev.text}`}>
                    {sev.level}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-slate-800">
                  {sev.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Triage Efficiency Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              CrisisLens AI Triage Efficiency
            </h3>
            <p className="text-xs text-slate-500">
              Noise compression and automated report deduplication ratio
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Compression</div>
              <div className="text-xl font-bold font-mono text-slate-900">84.2%</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Avg Triage Time</div>
              <div className="text-xl font-bold font-mono text-emerald-700">1.8 sec</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
